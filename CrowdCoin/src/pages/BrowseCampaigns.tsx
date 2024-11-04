import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getAllCampaignIds, getCampaignDetails } from '@/api/campaignservice';
import CampaignCard from '@/components/campaign/CampaignCard';

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

const BrowseCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        // Fetch all campaign IDs
        const campaignIds = await getAllCampaignIds();
        const campaignDetailsPromises = campaignIds.map(id => getCampaignDetails(id));
        const campaignDetails = await Promise.all(campaignDetailsPromises);
        setCampaigns(campaignDetails);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center text-gray-300">
        <h2 className="text-2xl">No Campaigns Found</h2>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        Browse Campaigns
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default BrowseCampaigns;