import { expect } from "chai"; // Importing expect from chai
import { ethers } from "ethers"; // Import ethers from hardhat

describe("Crowdfunding", function () {
    let crowdfunding;
    let owner, contributor1;

    beforeEach(async () => {
        [owner, contributor1] = await ethers.getSigners(); // Get signers
        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();
        await crowdfunding.deployed();
    });

    it("Should deploy the contract", async function () {
        console.log("Crowdfunding deployed to:", crowdfunding.address);
        expect(crowdfunding.address).to.be.properAddress; // Verify proper address
    });

    it("should create a campaign successfully", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002"); // 0.0002 ETH
        const duration = 3600; // 1 hour in seconds

        await expect(crowdfunding.createCampaign(goalAmount, duration))
            .to.emit(crowdfunding, "CampaignCreated")
            .withArgs(1, owner.address, goalAmount, (await ethers.provider.getBlock("latest")).timestamp + duration);
        
        const campaignDetails = await crowdfunding.getCampaignDetails(1);
        expect(campaignDetails.owner).to.equal(owner.address);
        expect(campaignDetails.goalAmount).to.equal(goalAmount);
        expect(campaignDetails.totalContributions).to.equal(0);
        expect(campaignDetails.status).to.equal(0); // Active
    });

    it("should allow contributions to a campaign", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);

        await expect(crowdfunding.connect(contributor1).contribute({ value: ethers.utils.parseEther("0.0001") }))
            .to.emit(crowdfunding, "Contributed")
            .withArgs(1, contributor1.address, ethers.utils.parseEther("0.0001"));
        
        const campaignDetails = await crowdfunding.getCampaignDetails(1);
        expect(campaignDetails.totalContributions).to.equal(ethers.utils.parseEther("0.0001"));

        const contribution = await crowdfunding.getUserContribution(1, contributor1.address);
        expect(contribution).to.equal(ethers.utils.parseEther("0.0001"));
    });

    it("should allow the owner to withdraw funds if the goal is reached", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);

        await crowdfunding.connect(contributor1).contribute({ value: ethers.utils.parseEther("0.0002") });

        await expect(crowdfunding.connect(owner).withdrawFunds(1))
            .to.emit(crowdfunding, "FundWithdrawn")
            .withArgs(1, ethers.utils.parseEther("0.0002"))
            .and.to.emit(crowdfunding, "CampaignStatusUpdated")
            .withArgs(1, 1); // Successful
        
        const campaignDetails = await crowdfunding.getCampaignDetails(1);
        expect(campaignDetails.status).to.equal(1); // Successful
    });

    it("should allow contributors to refund if the campaign fails", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);

        await crowdfunding.connect(contributor1).contribute({ value: ethers.utils.parseEther("0.0001") });

        // Wait for the deadline to pass
        await new Promise(resolve => setTimeout(resolve, 3600000)); // 1 hour

        await expect(crowdfunding.connect(contributor1).refund(1))
            .to.emit(crowdfunding, "RefundIssued")
            .withArgs(1, contributor1.address, ethers.utils.parseEther("0.0001"))
            .and.to.emit(crowdfunding, "CampaignStatusUpdated")
            .withArgs(1, 2); // Failed

        const contribution = await crowdfunding.getUserContribution(1, contributor1.address);
        expect(contribution).to.equal(0); // Contribution should be reset
    });

    it("should revert if non-owner tries to withdraw funds", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);
        await crowdfunding.connect(contributor1).contribute({ value: ethers.utils.parseEther("0.0002") });

        await expect(crowdfunding.connect(contributor1).withdrawFunds(1)).to.be.revertedWith("NotCampaignOwner(1)");
    });

    it("should revert if the goal is not reached and owner tries to withdraw funds", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);
        await crowdfunding.connect(contributor1).contribute({ value: ethers.utils.parseEther("0.0001") });

        await new Promise(resolve => setTimeout(resolve, 3600000)); // Wait for the deadline

        await expect(crowdfunding.connect(owner).withdrawFunds(1)).to.be.revertedWith("GoalNotReached(1)");
    });

    it("should revert if a contribution amount is zero", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);

        await expect(crowdfunding.connect(contributor1).contribute({ value: 0 })).to.be.revertedWith("ContributionMustBeGreaterThanZero()");
    });

    it("should revert if trying to refund when the campaign is active", async () => {
        const goalAmount = ethers.utils.parseEther("0.0002");
        const duration = 3600;
        await crowdfunding.createCampaign(goalAmount, duration);
        await crowdfunding.connect(contributor1).contribute({ value: ethers.utils.parseEther("0.0001") });

        await expect(crowdfunding.connect(contributor1).refund(1)).to.be.revertedWith("DeadlineNotPassed(1)");
    });
});
