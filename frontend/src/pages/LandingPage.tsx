import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Recycle, Users, TrendingUp, Award, Target, Sparkles, ArrowRight, Zap, Leaf } from 'lucide-react';

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2"
        >
          <Recycle className="w-8 h-8 text-green-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            NIRD Platform
          </span>
        </motion.div>
        <div className="flex gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-gray-700 font-semibold hover:text-green-600 transition"
            >
              Connexion
            </motion.button>
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            >
              Commencer
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Numérique Inclusif, Responsable et Durable</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-extrabold mb-6"
          >
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transformez l'Apprentissage
            </span>
            <br />
            <span className="text-gray-900">des Déchets Électroniques</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Rejoignez des milliers d'étudiants dans un parcours gamifié pour comprendre les déchets électroniques.
            Complétez des missions, gagnez des badges, affrontez des équipes et ayez un impact environnemental réel.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/50 transition flex items-center gap-2"
              >
                Commencer l'Aventure
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition border-2 border-gray-200"
              >
                En Savoir Plus
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16"
          >
            {[
              { label: 'Étudiants Actifs', value: '10 000+', icon: Users },
              { label: 'Missions Complétées', value: '50 000+', icon: Target },
              { label: 'CO₂ Économisé (kg)', value: '25 000+', icon: Leaf }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur p-6 rounded-xl shadow-lg"
              >
                <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir <span className="text-green-600">NIRD?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète conçue pour rendre l'éducation environnementale engageante et percutante
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Recycle,
                title: 'Missions Gamifiées',
                description: 'Complétez des défis captivants dans 6 catégories du Recyclage à l\'Économie Circulaire. Gagnez des points et débloquez des réalisations.',
                color: 'from-green-500 to-emerald-600',
                bgColor: 'bg-green-50'
              },
              {
                icon: Users,
                title: 'Collaboration d\'Équipe',
                description: 'Rejoignez ou créez des équipes, affrontez-vous sur les classements et travaillez ensemble pour atteindre des objectifs environnementaux collectifs.',
                color: 'from-blue-500 to-indigo-600',
                bgColor: 'bg-blue-50'
              },
              {
                icon: Award,
                title: 'Gagnez des Badges',
                description: 'Débloquez plus de 10 badges uniques d\'Éco-Guerrier à Protecteur de la Planète. Affichez vos réalisations et votre expertise.',
                color: 'from-purple-500 to-pink-600',
                bgColor: 'bg-purple-50'
              },
              {
                icon: TrendingUp,
                title: 'Classements en Temps Réel',
                description: 'Suivez votre progression et affrontez vos pairs. Voyez les mises à jour en direct et célébrez les meilleurs de votre école.',
                color: 'from-orange-500 to-red-600',
                bgColor: 'bg-orange-50'
              },
              {
                icon: Zap,
                title: 'Ressources Interactives',
                description: 'Accédez à une riche bibliothèque de vidéos, PDFs et articles. Participez aux discussions du forum et partagez vos idées.',
                color: 'from-cyan-500 to-blue-600',
                bgColor: 'bg-cyan-50'
              },
              {
                icon: Leaf,
                title: 'Impact Environnemental',
                description: 'Visualisez votre impact avec les économies de CO₂, les appareils recyclés et l\'équivalent en arbres. Rendez l\'apprentissage tangible.',
                color: 'from-green-600 to-teal-600',
                bgColor: 'bg-teal-50'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`${feature.bgColor} p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-4 py-20 bg-white/50 backdrop-blur rounded-3xl my-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Comment Ça Marche</h2>
            <p className="text-xl text-gray-600">Commencez en trois étapes simples</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Inscrivez-vous & Rejoignez',
                description: 'Créez votre compte, rejoignez votre école et intégrez une équipe ou créez la vôtre.',
                icon: Users
              },
              {
                step: '02',
                title: 'Complétez des Missions',
                description: 'Parcourez les missions dans 6 catégories, relevez les défis et soumettez votre travail pour évaluation.',
                icon: Target
              },
              {
                step: '03',
                title: 'Gagnez & Affrontez',
                description: 'Accumulez des points, débloquez des badges, grimpez les classements et suivez votre impact environnemental.',
                icon: Award
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="text-8xl font-black text-green-100 mb-4"
                >
                  {item.step}
                </motion.div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-xl"
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                <div className="mt-16">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
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
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Prêt à Faire la Différence?
            </h2>
            <p className="text-xl text-green-50 mb-10 max-w-2xl mx-auto">
              Rejoignez la communauté NIRD aujourd'hui et commencez votre voyage vers la sensibilisation et l'impact environnemental.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-12 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition flex items-center gap-2 mx-auto"
              >
                Rejoignez-nous - C'est Gratuit
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 text-center text-gray-600 border-t border-gray-200">
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
