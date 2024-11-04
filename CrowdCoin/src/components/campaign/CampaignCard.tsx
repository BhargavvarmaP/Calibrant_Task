import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Target, Users } from 'lucide-react';
import Card from '../ui/card';
import { getCampaignDetails } from '@/api/campaignservice';

interface CampaignCardProps {
  campaign: {
    id: number;
    title: string;
    description: string;
    goal: string;
    deadline: number;
    raised: string;
    contributors: number;
    image: string;
  };
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const progress = (Number(campaign.raised) / Number(campaign.goal)) * 100;
  const daysLeft = Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Link to={`/campaign/${campaign.id}`}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="shadow-lg rounded-lg overflow-hidden"
      >
        <Card className="bg-gray-900 hover:bg-gray-800 transition-colors duration-300">
          <motion.div
            className="h-48 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </motion.div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              {campaign.title}
            </h3>
            <p className="text-gray-300 text-sm mb-4">{campaign.description}</p>
            
            <div className="space-y-2">
              <motion.div 
                className="flex items-center text-sm"
                whileHover={{ x: 5 }}
              >
                <Target className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-gray-400">{campaign.raised} ETH raised of {campaign.goal} ETH</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-sm"
                whileHover={{ x: 5 }}
              >
                <Clock className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-gray-400">{daysLeft} days left</span>
              </motion.div>
              <motion.div 
                className="flex items-center text-sm"
                whileHover={{ x: 5 }}
              >
                <Users className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-gray-400">{campaign.contributors} contributors</span>
              </motion.div>
            </div>

            <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default CampaignCard;