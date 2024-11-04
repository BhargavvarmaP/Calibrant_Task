import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { usePrivy } from '@privy-io/react-auth';
import FadeIn from '../components/animations/FadeIn';
import AnimatedButton from '../components/animations/AnimatedButton';
import { createCampaign } from '@/api/campaignservice';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { authenticated } = usePrivy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    deadline: '',
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      toast.error('Please connect your wallet to create a campaign');
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Form validation
      if (!formData.title || !formData.description || !formData.goal || !formData.deadline || !formData.image) {
        throw new Error("Please fill in all fields");
      }

      const goalAmount = parseFloat(formData.goal);
      if (isNaN(goalAmount) || goalAmount <= 0) {
        throw new Error("Please enter a valid goal amount");
      }

      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        throw new Error("Deadline must be in the future");
      }

      // Create campaign
      await createCampaign(
        formData.title,
        formData.description,
        goalAmount,
        formData.deadline,
        formData.image
      );

      toast.success('Campaign created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(error.message || 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-200";

  return (
    <div className="max-w-2xl mx-auto p-4">
      <FadeIn>
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Create New Campaign
        </h1>
      </FadeIn>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FadeIn delay={0.1}>
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Title</label>
            <input
              type="text"
              required
              maxLength={100}
              className={inputClasses}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              required
              rows={4}
              maxLength={1000}
              className={inputClasses}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div>
            <label className="block text-sm font-medium mb-2">Goal Amount (ETH)</label>
            <input
              type="number"
              step="0.0001"
              required
              className={inputClasses}
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              disabled={isSubmitting}
              min="0.0001"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              required
              className={inputClasses}
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              disabled={isSubmitting}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Image URL</label>
            <input
              type="url"
              required
              className={inputClasses}
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              disabled={isSubmitting}
              placeholder="https://..."
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <AnimatedButton
            type="submit"
            variant="gradient"
            className="w-full py-3 px-4 rounded-lg font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
          </AnimatedButton>
        </FadeIn>
      </form>
    </div>
  );
};

export default CreateCampaign;