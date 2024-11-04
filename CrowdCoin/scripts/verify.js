const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Verifying contract with the account:", deployer.address);

    const contractAddress = "0x160738de2F9B4b9eC6918194218eB1045f861711"; 
    await hre.run("verify:verify", {
        address: contractAddress,
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
