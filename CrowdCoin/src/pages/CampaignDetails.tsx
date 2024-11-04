import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Target, Users, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useWeb3 } from '../context/Web3Context';
import { contributeToCampaign, getCampaignDetails } from "@/api/campaignservice";

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: string;
  deadline: number;
  raised: string;
  contributors: number;
  image: string;
  owner: string;
}

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { account } = useWeb3();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contribution, setContribution] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignData = await getCampaignDetails(Number(id)); // Ensure id is a number
        setCampaign(campaignData);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast.error('Failed to load campaign details');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      await contributeToCampaign(Number(id), contribution); // Ensure id is a number
      toast.success('Contribution successful!');
      setContribution('');
      // Optionally refresh campaign details after contribution
      const updatedCampaign = await getCampaignDetails(Number(id));
      setCampaign(updatedCampaign);
    } catch (error) {
      console.error('Error contributing:', error);
      toast.error('Failed to contribute');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center text-gray-300">
        <h2 className="text-2xl">Campaign Not Found</h2>
        <p>Please check the URL or try again later.</p>
      </div>
    );
  }

  const progress = (Number(campaign.raised) / Number(campaign.goal)) * 100;
  const daysLeft = Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          <div className="mt-6 bg-gray-900 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Campaign Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="text-gray-300">Raised</span>
                </div>
                <span className="font-medium text-white">{campaign.raised} ETH of {campaign.goal} ETH</span>
              </div>
              <div className="bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-purple-500" />
                  <span>{daysLeft} Days Left</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-purple-500" />
                  <span>{campaign.contributors} Contributors</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">{progress.toFixed(1)}% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4 text-white">{campaign.title}</h1>
          <p className="text-gray-300 mb-6">{campaign.description}</p>

          <div className="bg-gray-900 rounded-xl p-6 mb-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Contribute to this Campaign</h3>
            <form onSubmit={handleContribute}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors font-medium text-white shadow-lg"
              >
                Contribute Now
              </button>
            </form>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 shadow-md">
            <div className="flex items-center space-x-2 text-yellow-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Important Notice</h3>
            </div>
            <p className="text-sm text-gray-400">
              This campaign is running on the Ethereum blockchain. Ensure you have sufficient ETH in your wallet before contributing. All transactions are irreversible and will incur gas fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;