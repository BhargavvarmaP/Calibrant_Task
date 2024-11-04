import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import AnimatedButton from '../animations/AnimatedButton';

const Header = () => {
  const { login, logout, authenticated, user } = usePrivy();

  // Get wallet address or email, defaulting to 'No Address'
  const displayAddressOrEmail = () => {
    if (user?.email) {
      return String(user.email);
    }
    if (user?.wallet?.address) {
      return `${String(user.wallet.address).slice(0, 6)}...`;
    }
    return 'No Address';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Coins className="h-8 w-8 text-purple-500" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              CrowdChain
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/create">
              <AnimatedButton variant="gradient">Create Campaign</AnimatedButton>
            </Link>

            {authenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  {displayAddressOrEmail()}...
                </span>
                <AnimatedButton variant="outline" onClick={logout}>
                  Logout
                </AnimatedButton>
              </div>
            ) : (
              <AnimatedButton onClick={login}>Connect Wallet</AnimatedButton>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
