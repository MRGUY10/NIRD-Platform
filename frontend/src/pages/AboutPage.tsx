import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recycle, Target, Users, Award, Heart, Globe, Zap, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services/statsService';

export default function AboutPage() {
  const { data: globalStats } = useQuery({
    queryKey: ['globalStats'],
    queryFn: () => statsService.getGlobalStats(),
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-6 flex justify-between items-center"
      >
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Recycle className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              NIRD Platform
            </span>
          </motion.div>
        </Link>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-gray-700 font-semibold hover:text-green-600 transition"
          >
            ← Back to Home
          </motion.button>
        </Link>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-extrabold mb-6"
          >
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              About NIRD
            </span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-2xl text-gray-600 mb-4 max-w-3xl mx-auto"
          >
            Numérique Inclusif, Responsable et Durable
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            A gamified education platform empowering students to learn about electronic waste management through interactive missions, team collaboration, and real environmental impact tracking.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-white/80 backdrop-blur rounded-3xl p-12 shadow-2xl"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto rounded-full" />
          </motion.div>

          <motion.div variants={fadeInUp} className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              NIRD Platform aims to revolutionize environmental education by transforming learning about electronic waste into an engaging, competitive, and rewarding experience. We believe that through gamification and community collaboration, students can develop a deep understanding of e-waste management while making measurable environmental impacts.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform bridges the gap between theoretical knowledge and practical action, empowering the next generation to become environmental stewards and responsible digital citizens.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Globe,
                title: 'Environmental Responsibility',
                description: 'Promoting sustainable practices and raising awareness about e-waste impact on our planet.',
                color: 'from-green-500 to-emerald-600'
              },
              {
                icon: Users,
                title: 'Inclusive Learning',
                description: 'Making environmental education accessible and engaging for all students, regardless of background.',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Heart,
                title: 'Community First',
                description: 'Fostering collaboration, teamwork, and shared responsibility in environmental stewardship.',
                color: 'from-pink-500 to-rose-600'
              },
              {
                icon: Zap,
                title: 'Innovation',
                description: 'Leveraging gamification and technology to make learning about sustainability fun and effective.',
                color: 'from-yellow-500 to-orange-600'
              }
            ].map((value, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* What We Offer */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Platform Impact</h2>
            <p className="text-xl text-gray-600">Real-time statistics from our community</p>
          </motion.div>

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl font-extrabold text-green-600 mb-2">
                {globalStats?.total_users || 0}
              </div>
              <div className="text-gray-600">Active Users</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl font-extrabold text-blue-600 mb-2">
                {globalStats?.total_teams || 0}
              </div>
              <div className="text-gray-600">Teams</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl font-extrabold text-purple-600 mb-2">
                {globalStats?.approved_submissions || 0}
              </div>
              <div className="text-gray-600">Missions Completed</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl font-extrabold text-orange-600 mb-2">
                {globalStats?.impact?.devices_saved || 0}
              </div>
              <div className="text-gray-600">Devices Saved</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* What We Offer */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for environmental education</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Mission-Based Learning',
                description: '6 categories covering E-Waste Recycling, Device Lifespan, Circular Economy, Hazardous Materials, Awareness Campaigns, and Community Engagement.',
                stats: '8+ Missions'
              },
              {
                icon: Award,
                title: 'Gamification System',
                description: 'Earn points, unlock 10+ unique badges, and compete on real-time leaderboards. Progress from Eco Newbie to Planet Protector.',
                stats: '10+ Badges'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Form teams, compete together, share resources in forums, and achieve collective environmental goals.',
                stats: 'Unlimited Teams'
              },
              {
                icon: TrendingUp,
                title: 'Impact Tracking',
                description: 'Visualize your environmental footprint with metrics like CO₂ saved, devices recycled, and trees equivalent.',
                stats: 'Real-time Analytics'
              },
              {
                icon: Recycle,
                title: 'Rich Resources',
                description: 'Access curated videos, PDFs, articles, and interactive materials to deepen your understanding of e-waste.',
                stats: 'Growing Library'
              },
              {
                icon: Globe,
                title: 'Community Forums',
                description: 'Engage in discussions, ask questions, share insights, and connect with peers passionate about sustainability.',
                stats: 'Active Community'
              }
            ].map((offer, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <offer.icon className="w-12 h-12 text-green-600" />
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {offer.stats}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                <p className="text-gray-600 leading-relaxed">{offer.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Join the Movement
            </h2>
            <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
              Be part of a community making real environmental change through education and action.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-green-600 px-12 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition"
                >
                  Get Started Free
                </motion.button>
              </Link>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-700 text-white px-12 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-green-800 transition"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center text-gray-600 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Recycle className="w-6 h-6 text-green-600" />
          <span className="font-bold text-xl text-gray-900">NIRD Platform</span>
        </div>
        <p className="mb-2">Numérique Inclusif, Responsable et Durable</p>
        <p className="text-sm">&copy; 2025 NIRD Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
