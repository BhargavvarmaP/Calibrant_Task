import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Rocket, Shield, Users } from 'lucide-react';
import CampaignCard from '../components/campaign/CampaignCard';
import FadeIn from '../components/animations/FadeIn';
import AnimatedButton from '../components/animations/AnimatedButton';

const features = [
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Launch Your Dream",
    description: "Create and manage your crowdfunding campaign with ease"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Connect with Backers",
    description: "Build a community around your project"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure & Transparent",
    description: "Blockchain-powered security for all transactions"
  }
];

const campaigns = [
  {
    id: 1,
    title: "Green Energy Initiative",
    description: "Supporting renewable energy projects in developing countries",
    goal: "50",
    deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
    raised: "25",
    contributors: 150,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Tech Education Fund",
    description: "Providing coding education to underprivileged students",
    goal: "30",
    deadline: Date.now() + 15 * 24 * 60 * 60 * 1000,
    raised: "12",
    contributors: 89,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center text-center">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Empower Your Ideas Through Crowdfunding
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-xl text-gray-400 mb-8">
              Launch your campaign, engage with supporters, and bring your vision to life using blockchain technology.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <AnimatedButton
              variant="gradient"
              size="lg"
              onClick={() => window.location.href = '/create'}
              className="group"
            >
              Start Your Campaign
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </AnimatedButton>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Why Choose CrowdChain?
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl bg-gray-800/50 border border-gray-700"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section ref={ref} className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Active Campaigns
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => (
              <FadeIn key={campaign.id} delay={index * 0.2}>
                <CampaignCard campaign={campaign} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;