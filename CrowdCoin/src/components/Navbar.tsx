import React from 'react';
import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const Navbar = () => {
  const { account, connectWallet } = useWeb3();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              CrowdChain
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/browse"
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
            >
              Browse Campaigns
            </Link>
            
            <Link
              to="/create"
              className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
            >
              Create Campaign
            </Link>
            
            <button
              onClick={connectWallet}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;