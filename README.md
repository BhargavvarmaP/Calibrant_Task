# Crowdcoin: Token-Based Crowdfunding Platform

Crowdcoin is a decentralized crowdfunding platform built on the Ethereum blockchain. It allows users to create crowdfunding campaigns, contribute tokens to campaigns, and track campaign progress. The platform is designed to be simple, secure, and transparent, leveraging smart contracts to manage campaign creation, contributions, and fund withdrawals.

## Table of Contents

- [Project Overview](#project-overview)
- [Smart Contract Development](#smart-contract-development)
- [Frontend Interface](#frontend-interface)
- [Testing](#testing)
- [Deployment](#deployment)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Crowdcoin aims to provide a decentralized alternative to traditional crowdfunding platforms. By leveraging the Ethereum blockchain, the platform ensures transparency, security, and trust in the crowdfunding process. Users can create campaigns, contribute to them, and withdraw funds once the campaign goals are met.

## Smart Contract Development

### Features

- **Campaign Creation**: Users can create new crowdfunding campaigns with the following attributes:
  - Campaign Owner: Address of the campaign creator.
  - Goal Amount: Total funding required for the campaign.
  - Deadline: End date for the fundraising.
  - Status: Enum to represent campaign status (Active, Successful, Failed).
- **Contribution**: Users can contribute to campaigns by sending tokens (ETH or an ERC20 token).
- **Fund Withdrawal**: The campaign owner can withdraw funds if the goal is met by the deadline.
- **Refunds**: Contributors can withdraw their contributions if the campaign fails to meet its goal by the deadline.

### Contract Requirements

- Developed using Solidity 0.8.x.
- Deployed to the Sepolia test network.
- Events added for key actions (campaign creation, contribution, goal met, withdrawal).

### Testing

Comprehensive test cases have been written for smart contract functions using Foundry, covering key actions like campaign creation, contribution, withdrawal, and refunds.

## Frontend Interface

### Features

- **Create Campaign**: A form for users to start a new campaign.
- **Contribute to Campaign**: Interface to allow users to contribute tokens to a campaign.
- **Campaign Details**: Page to display details of individual campaigns, including current status, total contributions, and deadline.
- **Web3 Integration**: Ethers.js has been used to connect the frontend to the Ethereum test network.

### Technologies Used

- **React**: Frontend framework for building user interfaces.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Build tool for fast development and building.

## Deployment

- **Frontend**: The frontend has been deployed to Netlify.
- **Smart Contracts**: The smart contracts have been deployed to the Sepolia test network.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/BhargavvarmaP/Calibrant_Task.git
   cd Calibrant_Task
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```



3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Usage

1. **Create a Campaign**:
   - Navigate to the "Create Campaign" page.
   - Fill in the required details (Goal Amount, Deadline, etc.).
   - Submit the form to create a new campaign.

2. **Contribute to a Campaign**:
   - Browse the list of active campaigns.
   - Select a campaign to view its details.
   - Use the "Contribute" form to send tokens to the campaign.

3. **Withdraw Funds**:
   - If you are the campaign owner and the campaign goal is met, you can withdraw the funds.

4. **Refunds**:
   - If the campaign fails to meet its goal by the deadline, contributors can withdraw their contributions.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize the README with your actual project details, such as the repository URL, deployment links, and any other relevant information. This README provides a comprehensive overview of the project, its features, and how to set it up and use it.