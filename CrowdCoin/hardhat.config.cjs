require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
    solidity: "0.8.26",
    networks: {
        sepolia: {
            url: "https://ethereum-sepolia-rpc.publicnode.com", // Replace with your RPC URL
            accounts: [`0xb159187223352d160776256299bac81dfe8d7df72a7df6377ffebd93178afbed`], // Replace with your wallet's private key
            timeout: 200000
        }
    },
    etherscan: {
        apiKey: {
            sepolia: 'WKGH9PDGYNA4SHMDH3WHQ7BKKYQTP1R8BK' // Replace with your Etherscan API key
        }
    },
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        }
    }
};
