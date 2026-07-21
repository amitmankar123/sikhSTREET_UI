import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { appLogo } from '../../../data/logos';
import {
  FiTag,
  FiTool,
  FiHelpCircle,
  FiCheckCircle,
  FiShield,
  FiLock,
  FiZap,
  FiDollarSign,
  FiGlobe,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiMessageSquare,
  FiBookOpen,
  FiUsers,
  FiArrowRight,
  FiStar,
  FiShoppingBag,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';
import { useVendorAuthStore } from '../store/vendorAuthStore';

const VendorLanding = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useVendorAuthStore();
  const [activeFaq, setActiveFaq] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: "How do fees work on SikhStreet?",
      answer: "There are three basic selling fees: a listing fee, a transaction fee, and a payment processing fee. There's also an advertising fee for sales that come from Offsite Ads. It costs ₹15 (approx. $0.20) to publish a listing to the marketplace. Listings last for four months or until sold. Once sold, there is a 6.5% transaction fee on the sale price (including shipping) plus standard payment processing."
    },
    {
      question: "What do I need to do to create a shop?",
      answer: "It's easy to set up a shop on SikhStreet. Create an account, set your shop location and currency, choose your unique shop name, create your first product listing, set a payout method (how you want to get paid), and set a billing method."
    },
    {
      question: "How do I get paid?",
      answer: "With our secure payment system, you accept payments from credit cards, debit cards, UPI, net banking, PayPal, and digital wallets. Funds from your sales are deposited directly into your bank account in your preferred currency."
    },
    {
      question: "How does SikhStreet protect sellers?",
      answer: "Eligible purchases qualify for SikhStreet Purchase Protection. This means that we protect sellers against unauthorized payment disputes and handle delivery issues if orders are damaged or lost in transit according to terms."
    },
    {
      question: "What can I sell on SikhStreet?",
      answer: "Buyers come to our marketplace to purchase items that they might not find anywhere else. Everything listed for sale must be made, designed, handpicked, or sourced by a seller, in compliance with our Creativity Standards."
    }
  ];

  const sellerStories = [
    {
      id: 1,
      quote: "My shop started out as a hobby, then a side hustle to support my teaching job. When my first son was born in 2014, I decided to grow it into a full-blown business. Selling here has given us the chance to watch our kids grow while building our business as a family.",
      name: "Nicole Lewis & Erin",
      shop: "Yellow House Handmade & Art 2 the Extreme",
      location: "Noblesville, Indiana",
      avatarBg: "bg-amber-100 text-amber-800"
    },
    {
      id: 2,
      quote: "I never imagined running a vintage shop could make me feel like I was bringing joy into people’s homes, but that’s what I’ve come to experience. I love that it feels like a very personal experience both as a shopper and seller.",
      name: "Alva Mac Gowan",
      shop: "Copenhagen Collected",
      location: "Copenhagen, Denmark",
      avatarBg: "bg-emerald-100 text-emerald-800"
    },
    {
      id: 3,
      quote: "As a mother of three kids, I felt a drive to create something for my children, and children like them, who were unaccustomed to seeing their likenesses in toys. One of my greatest joys when I launched my shop was to have my children glance at my prints and ask 'Oh! Is that me?'",
      name: "Shaina Adams",
      shop: "Paper Play + Wonder",
      location: "San Antonio, Texas",
      avatarBg: "bg-rose-100 text-rose-800"
    },
    {
      id: 4,
      quote: "Sitting down at my workbench to create continues to be my lifeline. My business has continued to grow, and that success is affirming of the bet I made to follow this path at age 45.",
      name: "Micha González",
      shop: "Micha González Studio",
      location: "Mexico City, Mexico",
      avatarBg: "bg-indigo-100 text-indigo-800"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* Main Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/vendor')}>
            <img
              src={appLogo.src}
              alt={appLogo.alt || "SikhStreet Logo"}
              className="h-10 w-auto object-contain mix-blend-multiply"
            />
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">Seller Hub</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('fees')} className="hover:text-amber-600 transition-colors">Fees</button>
            <button onClick={() => scrollToSection('tools')} className="hover:text-amber-600 transition-colors">Tools</button>
            <button onClick={() => scrollToSection('support')} className="hover:text-amber-600 transition-colors">Support</button>
            <button onClick={() => scrollToSection('stories')} className="hover:text-amber-600 transition-colors">Stories</button>
            <button onClick={() => scrollToSection('creativity')} className="hover:text-amber-600 transition-colors">Selling</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-amber-600 transition-colors">FAQ</button>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/vendor/dashboard')}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-sm flex items-center space-x-2"
              >
                <span>Dashboard</span>
                <FiArrowRight />
              </button>
            ) : (
              <>
                <Link
                  to="/vendor/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/vendor/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 rounded-full hover:bg-amber-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Open your Shop
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Sub-Navigation Links for Mobile */}
        <div className="md:hidden border-t border-slate-100 bg-slate-50/80 px-4 py-2 overflow-x-auto flex space-x-6 text-xs font-semibold text-slate-600 whitespace-nowrap">
          <button onClick={() => scrollToSection('fees')}>Fees</button>
          <button onClick={() => scrollToSection('tools')}>Tools</button>
          <button onClick={() => scrollToSection('support')}>Support</button>
          <button onClick={() => scrollToSection('stories')}>Stories</button>
          <button onClick={() => scrollToSection('creativity')}>Selling</button>
          <button onClick={() => scrollToSection('faq')}>FAQ</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative bg-white py-16 lg:py-24 overflow-hidden border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-6">
              ✨ Empowering 1.7M+ Creative Sellers Worldwide
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Join the creative marketplace where millions of shoppers spend billions each year purchasing directly from creative entrepreneurs like you.
            </h1>
          </motion.div>

          {/* 3 Core Value Props Circles */}
          <div id="tools" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 hover:bg-amber-50/50 transition-colors border border-slate-100"
            >
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-inner">
                <FiTag className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Great value</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                List your first item for just ₹15 – you only pay transaction, payment processing, and offsite advertising fees when you make a sale.
              </p>
              <button onClick={() => scrollToSection('fees')} className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4 mt-auto">
                Learn more
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 hover:bg-amber-50/50 transition-colors border border-slate-100"
            >
              <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 shadow-inner">
                <FiTool className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Powerful tools</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Our tools and services make it easy to manage inventory, analyze shop performance, promote products, and grow your business effortlessly.
              </p>
              <button onClick={() => scrollToSection('support')} className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4 mt-auto">
                Learn more
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 hover:bg-amber-50/50 transition-colors border border-slate-100"
            >
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-6 shadow-inner">
                <FiBookOpen className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Support and education</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Reach out to SikhStreet support specialists anytime you need a hand, and get tips on running a successful shop in our Seller Handbook.
              </p>
              <button onClick={() => scrollToSection('support')} className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4 mt-auto">
                Learn more
              </button>
            </motion.div>
          </div>

          {/* Start Selling Central Box */}
          <div className="mt-14 max-w-md mx-auto p-8 rounded-2xl bg-white border-2 border-slate-200 shadow-xl text-center relative">
            <div className="text-3xl mb-2">🙌</div>
            <h4 className="text-lg font-bold text-slate-800 mb-4">Start selling today</h4>
            <Link
              to="/vendor/register"
              className="inline-block w-full py-3.5 px-8 text-base font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-xl"
            >
              Open your SikhStreet shop
            </Link>
          </div>
        </div>
      </section>

      {/* FEES BREAKDOWN SECTION */}
      <section id="fees" className="py-20 bg-amber-50/40 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Simple & secure</h2>
            <p className="text-slate-600 mt-2">Transparent pricing designed so you keep more of what you earn.</p>
          </div>

          {/* Bullet Point Summary Header Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 text-sm">No additional monthly fees</span>
              </div>
              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 text-sm">Automatic deposits</span>
              </div>
              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 text-sm">Secure transactions</span>
              </div>
              <div className="flex items-center space-x-3 justify-center sm:justify-start">
                <FiCheckCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800 text-sm">Seller protection</span>
              </div>
            </div>
          </div>

          {/* Fee Item List */}
          <div className="space-y-6">

            <div className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="p-3 bg-slate-100 rounded-xl text-slate-800 shrink-0">
                <FiShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">One-time shop set up fee</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Once you've opened your shop, please note that you may be charged a nominal one-time shop set-up fee depending on region. If required, you will see the exact amount before completing final steps.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                <FiTag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">₹15 Listing fee*</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Listings are active for four months, or until they sell. Billing is nominal (approx. $0.20 USD equivalent).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">6.5% Transaction fee, 4% + ₹20 payment processing fee*</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  When you sell an item, there's a small commission and standard payment processing fee collected directly upon successful order completion.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shrink-0">
                <FiZap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">15% Offsite Ads Fee*</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  We pay to advertise your items across Google, social media, and web partners through Offsite Ads. You only pay an advertising fee when you make a sale directly from one of those ads.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-5 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
                <FiGlobe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">2.5% Currency Conversion fee</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Charged on funds from your sales if your shop's listing currency is different from the currency of your direct bank payment account.
                </p>
              </div>
            </div>

          </div>

          {/* SSL Banner */}
          <div className="mt-12 bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 shadow-lg">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <FiLock className="w-8 h-8" />
            </div>
            <p className="text-sm leading-relaxed text-slate-200 text-center sm:text-left">
              We process payments on our secure, SSL-encrypted platform, and have dedicated security specialists and automated fraud detection technology to keep your shop transactions safe 24/7.
            </p>
          </div>

        </div>
      </section>

      {/* HELP WHEN YOU NEED IT (SUPPORT & EDUCATION) */}
      <section id="support" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Help when you need it</h2>
            <p className="text-slate-600 mt-3 text-base">
              We’re committed to helping our 1.7 million sellers thrive, with dedicated support and education for shops big and small.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Talk to us</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Reach our support staff by email, live chat, or request a phone call whenever you have a question.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <FiBookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tips for success</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Learn best practices for your business with our always-updating Seller Handbook and guidebooks.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <FiMail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Seller newsletter</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Read the Seller Success newsletter for practical tips on improving your shop, delivered straight to your inbox.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <FiUsers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get advice</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ask questions and find a welcoming community of sellers like you in seller forums and Teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELLER STORIES */}
      <section id="stories" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">Community Voices</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Seller Stories</h2>
            <p className="text-slate-300 mt-3 text-base">
              We think SikhStreet is pretty great, but don’t take our word for it. Hear real stories from our sellers about how SikhStreet made a difference for them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sellerStories.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -4 }}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-200 text-sm sm:text-base italic leading-relaxed mb-6">
                    "{story.quote}"
                  </p>
                </div>
                <div className="flex items-center space-x-4 border-t border-slate-700/60 pt-4 mt-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${story.avatarBg}`}>
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{story.name}</h4>
                    <p className="text-xs text-amber-400 font-medium">{story.shop}</p>
                    <p className="text-xs text-slate-400">{story.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATIVITY STANDARDS / WHAT CAN YOU SELL */}
      <section id="creativity" className="py-20 bg-amber-50/50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-6">
            <FiAward className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">What can you sell on SikhStreet?</h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto mb-8">
            SikhStreet is the marketplace for original items from real people. We believe that every item should have a human touch and reflect the creativity of our community. You can sell unique items that you made, designed, handpicked, or sourced, as described in our Creativity Standards.
          </p>
          <Link
            to="/vendor/register"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-md"
          >
            <span>Review Seller Policy & Register</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 mt-2 text-sm">Here are answers to some common questions about selling on SikhStreet.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex justify-between items-center space-x-4 hover:bg-slate-100/60 transition-colors"
                >
                  <span className="font-bold text-slate-900 text-base sm:text-lg">{faq.question}</span>
                  {activeFaq === index ? (
                    <FiChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <FiChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-slate-200/80 bg-white p-6 text-slate-600 text-sm leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA & NEWSLETTER */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-100 text-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Ready to start selling?</h2>
            <p className="text-slate-600 text-base mb-8">In just a few minutes your shop can be open for business.</p>
            <Link
              to="/vendor/register"
              className="inline-block px-8 py-4 bg-amber-600 text-white font-bold text-lg rounded-full hover:bg-amber-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Open your SikhStreet shop
            </Link>

            <div className="mt-12 pt-8 border-t border-slate-100 max-w-md mx-auto">
              <p className="text-xs text-slate-500 mb-4">
                Yes! Send me exclusive offers, seller growth tips, and personalized recommendations for selling on SikhStreet.
              </p>
              {subscribed ? (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl border border-emerald-200">
                  🎉 Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 w-full sm:w-auto min-w-0 px-4 py-3 rounded-full border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Gift cards</a></li>
                <li><a href="#" className="hover:text-white">Registry</a></li>
                <li><a href="#" className="hover:text-white">Sitemap</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Sell</h4>
              <ul className="space-y-2">
                <li><Link to="/vendor/register" className="hover:text-white">Sell on SikhStreet</Link></li>
                <li><a href="#" className="hover:text-white">Teams</a></li>
                <li><a href="#" className="hover:text-white">Forums</a></li>
                <li><a href="#" className="hover:text-white">Affiliates & Creators</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">About</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">SikhStreet Inc.</a></li>
                <li><a href="#" className="hover:text-white">Policies</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Help</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Help Centre</a></li>
                <li><a href="#" className="hover:text-white">Privacy Settings</a></li>
                <li><a href="#" className="hover:text-white">Seller Protection</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              © 2026 SikhStreet, Inc. • Terms of Use • Privacy • Cookies • Local Shops
            </div>
            <div className="flex space-x-6 text-slate-400">
              <span className="hover:text-white cursor-pointer">India</span>
              <span>|</span>
              <span className="hover:text-white cursor-pointer">English (UK)</span>
              <span>|</span>
              <span className="hover:text-white cursor-pointer">₹ (INR)</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default VendorLanding;
