// Import Hardhat Runtime Environment
const hre = require("hardhat");

async function main() {
    // Step 1: Compile the contracts
    // Ensures that all contracts are compiled before deployment.
    await hre.run("compile");

    // Step 2: Get the contract factory for Crowdfunding
    // This allows us to deploy instances of the Crowdfunding contract.
    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");

    // Step 3: Deploy the Crowdfunding contract
    // Initiates the deployment of the Crowdfunding contract to the network specified in Hardhat's config.
    const crowdfunding = await Crowdfunding.deploy();

    // Step 4: Wait for the contract to be deployed
    // Ensures the contract is fully deployed and available before proceeding.
    await crowdfunding.deployed();

    // Step 5: Log the contract address
    // Output the address where the Crowdfunding contract is deployed.
    console.log("Crowdfunding contract deployed to:", crowdfunding.address);
}

// Execute the main function and handle any errors that occur during execution
main()
    .then(() => process.exit(0)) // Exit the process with a success code
    .catch((error) => {
        console.error(error); // Log any error to the console
        process.exit(1); // Exit the process with a failure code
    });
