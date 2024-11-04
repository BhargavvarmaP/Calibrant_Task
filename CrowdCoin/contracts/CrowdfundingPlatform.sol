// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the Ownable contract from OpenZeppelin to allow for ownership management
import "@openzeppelin/contracts/access/Ownable.sol";
// Importing ReentrancyGuard from OpenZeppelin to prevent reentrancy attacks on critical functions
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Crowdfunding Platform
/// @dev This contract allows users to create crowdfunding campaigns, contribute funds, withdraw funds if the goal is met, 
/// and receive refunds if the campaign fails to meet the goal by the deadline.
contract Crowdfunding is Ownable, ReentrancyGuard {
    /// Enum to represent the different states of a crowdfunding campaign
    enum CampaignStatus { Active, Successful, Failed }

    /// Struct to store details of each campaign
    struct Campaign {
        address payable owner;         // Address of the campaign owner
        uint256 goalAmount;           // The target amount needed for the campaign to be successful
        uint256 deadline;             // Timestamp representing the campaign end time
        uint256 totalContributions;   // Total amount of funds raised for the campaign
        CampaignStatus status;        // Current status of the campaign (Active, Successful, or Failed)
        string title;                 // Title of the campaign
        string description;           // Description of the campaign
        string imageUrl;              // Image URL associated with the campaign
    }

    // State variables
    mapping(uint256 => Campaign) public campaigns;                   // Stores each campaign's data by its ID
    mapping(uint256 => mapping(address => uint256)) public contributions; // Tracks contributions per user per campaign
    uint256 public campaignCount;                                     // Counter for the number of campaigns created

    // Custom errors for efficient error handling
    error CampaignNotActive(uint256 campaignId);
    error NotCampaignOwner(uint256 campaignId);
    error ContributionMustBeGreaterThanZero();
    error GoalAmountMustBeGreaterThanZero();
    error DurationMustBeGreaterThanZero();
    error ContributionNotFound(uint256 campaignId, address contributor);

    // Events to log significant contract actions
    event CampaignCreated(uint256 indexed campaignId, address indexed owner, uint256 goalAmount, uint256 deadline, string title, string description, string imageUrl);
    event Contributed(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event FundWithdrawn(uint256 indexed campaignId, uint256 amount);
    event RefundIssued(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event CampaignStatusUpdated(uint256 indexed campaignId, CampaignStatus status);

    /// @notice Constructor that initializes the contract with the deployer as the owner
    constructor() Ownable() {}

    /// @dev Modifier to ensure that a campaign is active before allowing certain actions
    modifier onlyActiveCampaign(uint256 campaignId) {
        if (campaigns[campaignId].status != CampaignStatus.Active) {
            revert CampaignNotActive(campaignId);
        }
        _;
    }

    /// @dev Modifier to restrict access to the campaign owner
    modifier onlyOwnerOfCampaign(uint256 campaignId) {
        if (msg.sender != campaigns[campaignId].owner) {
            revert NotCampaignOwner(campaignId);
        }
        _;
    }

    /// @notice Creates a new crowdfunding campaign
    /// @param title The title of the campaign
    /// @param description The description of the campaign
    /// @param goalAmount The target funding amount required for the campaign
    /// @param duration The duration in seconds until the campaign ends
    /// @param imageUrl The URL of the campaign image
    function createCampaign(
        string memory title,
        string memory description,
        uint256 goalAmount,
        uint256 duration,
        string memory imageUrl
    ) external {
        // Validate that the goal amount and duration are greater than zero
        if (goalAmount <= 0) revert GoalAmountMustBeGreaterThanZero();
        if (duration <= 0) revert DurationMustBeGreaterThanZero();

        // Increment campaign count to generate a unique ID and store the new campaign
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            owner: payable(msg.sender),
            goalAmount: goalAmount,
            deadline: block.timestamp + duration,
            totalContributions: 0,
            status: CampaignStatus.Active,
            title: title,
            description: description,
            imageUrl: imageUrl
        });

        emit CampaignCreated(campaignCount, msg.sender, goalAmount, block.timestamp + duration, title, description, imageUrl);
    }

    /// @notice Allows users to contribute funds to an active campaign
    /// @param campaignId The ID of the campaign to contribute to
    function contribute(uint256 campaignId) external payable onlyActiveCampaign(campaignId) nonReentrant {
        // Ensure the contribution amount is positive
        if (msg.value <= 0) revert ContributionMustBeGreaterThanZero();

        Campaign storage campaign = campaigns[campaignId];
        // Update campaign total contributions and individual contributor record
        campaign.totalContributions += msg.value;
        contributions[campaignId][msg.sender] += msg.value;

        emit Contributed(campaignId, msg.sender, msg.value);
    }

    /// @notice Allows the campaign owner to withdraw funds if the campaign goal is met by the deadline
    /// @param campaignId The ID of the campaign to withdraw funds from
    function withdrawFunds(uint256 campaignId) external onlyOwnerOfCampaign(campaignId) nonReentrant {
        Campaign storage campaign = campaigns[campaignId];

        // Check if the campaign is successful based on the deadline and contributions
        if (block.timestamp > campaign.deadline) {
            if (campaign.totalContributions >= campaign.goalAmount) {
                campaign.status = CampaignStatus.Successful;

                uint256 amountToWithdraw = campaign.totalContributions;
                campaign.totalContributions = 0;

                // Transfer funds to the campaign owner
                (bool success, ) = campaign.owner.call{value: amountToWithdraw}("");
                require(success, "Transfer failed");

                emit FundWithdrawn(campaignId, amountToWithdraw);
                emit CampaignStatusUpdated(campaignId, CampaignStatus.Successful);
            } else {
                campaign.status = CampaignStatus.Failed;
                emit CampaignStatusUpdated(campaignId, CampaignStatus.Failed);
            }
        }
    }

    /// @notice Allows contributors to receive a refund if the campaign fails
    /// @param campaignId The ID of the campaign for which a refund is requested
    function refund(uint256 campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[campaignId];

        // Ensure that the campaign is marked as failed and the contributor has a valid contribution
        if (campaign.status != CampaignStatus.Failed) revert CampaignNotActive(campaignId);

        uint256 contributedAmount = contributions[campaignId][msg.sender];
        if (contributedAmount == 0) revert ContributionNotFound(campaignId, msg.sender);

        contributions[campaignId][msg.sender] = 0;

        // Transfer the contribution back to the contributor
        (bool success, ) = msg.sender.call{value: contributedAmount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(campaignId, msg.sender, contributedAmount);
    }

    /// @notice Retrieves details of a specific campaign
    /// @param campaignId The ID of the campaign to retrieve details for
    /// @return owner The campaign owner's address
    /// @return goalAmount The target funding amount for the campaign
    /// @return deadline The timestamp for the campaign's end time
    /// @return totalContributions The total funds contributed to the campaign
    /// @return status The current status of the campaign (Active, Successful, or Failed)
    /// @return title The title of the campaign
    /// @return description The description of the campaign
    /// @return imageUrl The URL of the campaign image
    function getCampaignDetails(uint256 campaignId) external view returns (
        address owner,
        uint256 goalAmount,
        uint256 deadline,
        uint256 totalContributions,
        CampaignStatus status,
        string memory title,
        string memory description,
        string memory imageUrl
    ) {
        Campaign storage campaign = campaigns[campaignId];
        return (
            campaign.owner,
            campaign.goalAmount,
            campaign.deadline,
            campaign.totalContributions,
            campaign.status,
            campaign.title,
            campaign.description,
            campaign.imageUrl
        );
    }

    /// @notice Checks a specific user's contribution to a given campaign
    /// @param campaignId The ID of the campaign to check
    /// @param contributor The address of the contributor
    /// @return The amount contributed by the specified user to the specified campaign
    function getUserContribution(uint256 campaignId, address contributor) external view returns (uint256) {
        return contributions[campaignId][contributor];
    }
}
