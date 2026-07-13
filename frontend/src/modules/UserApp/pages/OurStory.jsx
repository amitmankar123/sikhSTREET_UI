import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiAward, FiUsers, FiHeart, FiGlobe, FiTarget, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";

const OurStory = () => {
  const navigate = useNavigate();

  // Scroll animation variants
  const slideFromLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideFromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
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

  return (
    <PageTransition>
      <MobileLayout fullWidth={true}>
        {/* Background Wrapper with premium radial gradient */}
        <div className="w-full min-h-screen bg-gradient-to-br from-[#fff7f2] via-[#ffece0] to-[#fff7f2] pb-24 font-sans relative overflow-hidden">
          
          {/* Decorative Saffron Blurs for Glassmorphism depth */}
          <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] rounded-full bg-[#f1641e]/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-40 right-[-15%] w-[600px] h-[600px] rounded-full bg-[#8d4b00]/10 blur-[150px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 pt-8 relative z-10">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-[#554336] hover:text-[#8d4b00] transition-colors mb-8 group"
            >
              <FiArrowLeft className="w-4 h-4 stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            {/* Header Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <span className="text-[11px] font-extrabold text-[#8d4b00] tracking-widest uppercase bg-[#8d4b00]/5 px-3 py-1 rounded-full">
                Our Heritage & Journey
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#231a13] mt-4 mb-6 leading-tight font-serif">
                The Story of <span className="text-[#f1641e]">Sikh Street</span>
              </h1>
              <p className="text-base md:text-lg text-[#554336]/90 max-w-2xl mx-auto leading-relaxed">
                Empowering generational Sikh artisans and connecting local craftsmanship with global art connoisseurs, bridging historical legacy with modern design.
              </p>
            </motion.div>

            {/* Glassmorphic Vision Panel (Slides Up) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="backdrop-blur-md bg-white/40 border border-white/40 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-500 mb-12 text-left"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#f1641e]/10 text-[#f1641e] rounded-2xl">
                  <FiTarget className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Our Core Vision</h2>
              </div>
              <p className="text-[#4a3e35] text-sm md:text-base leading-relaxed mb-4">
                Sikh Street was born out of a desire to create a global home for traditional Sikh art, apparel, and weaponry. For centuries, artisans in small workshops across Punjab have perfected delicate woodcarving, steel forging, and fabric weaving. Yet, these masters have remained isolated from global markets.
              </p>
              <p className="text-[#4a3e35] text-sm md:text-base leading-relaxed">
                By designing a digital sanctuary that prioritizes creators and heritage, we bring verified, museum-quality Sikh artifacts directly to your home. We bypass heavy distributors to support fair trade, ensuring local makers continue their legacies for generations to come.
              </p>
            </motion.div>

            {/* Grid of Animating Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              
              {/* Left Card: Glassmorphic + Slide from Left */}
              <motion.div
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="backdrop-blur-md bg-white/40 border border-white/40 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-500 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-[#8d4b00]/10 text-[#8d4b00] rounded-xl inline-block mb-5">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Authentic Quality</h3>
                  <p className="text-xs md:text-sm text-[#4a3e35] leading-relaxed">
                    Every turban fabric, sarbloh kara, and miniature portrait undergoes meticulous certification. We work hand-in-hand with our sellers to guarantee high-grade materials and historical accuracy in every artifact.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/30 pt-4 text-xs font-bold text-[#8d4b00]">
                  100% Artisanal Quality Guarantee
                </div>
              </motion.div>

              {/* Right Card: Glassmorphic + Slide from Right */}
              <motion.div
                variants={slideFromRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="backdrop-blur-md bg-white/40 border border-white/40 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-500 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl inline-block mb-5">
                    <FiHeart className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Supporting Artisans</h3>
                  <p className="text-xs md:text-sm text-[#4a3e35] leading-relaxed">
                    With over 85% of our profits directly fueling small family-owned businesses in Amritsar, Mohali, and Jalandhar, we're not just a shop. We are a community preserving generational art.
                  </p>
                </div>
                <div className="mt-6 border-t border-white/30 pt-4 text-xs font-bold text-[#8d4b00]">
                  Supporting 120+ Families Globally
                </div>
              </motion.div>
            </div>

            {/* Timeline Section (Scrolls in from bottom) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="backdrop-blur-md bg-white/30 border border-white/30 rounded-3xl p-8 md:p-10 shadow-xl mb-16 text-left"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
                  <FiGlobe className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Our Milestones</h2>
              </div>

              <div className="relative border-l-2 border-[#dbc2b0]/60 pl-6 ml-3 space-y-8">
                {/* Year 1 */}
                <div className="relative">
                  <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-[#f1641e] border-2 border-white" />
                  <span className="text-xs font-extrabold text-[#f1641e]">MID 2024</span>
                  <h4 className="text-lg font-bold text-gray-900 mt-0.5">Founding Concept</h4>
                  <p className="text-xs md:text-sm text-[#4a3e35] leading-relaxed mt-1">
                    A team of passionate designers and history enthusiasts set out to document local craft studios in Punjab, establishing relationships with generational metal smiths and turban weavers.
                  </p>
                </div>

                {/* Year 2 */}
                <div className="relative">
                  <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-[#8d4b00] border-2 border-white" />
                  <span className="text-xs font-extrabold text-[#8d4b00]">EARLY 2025</span>
                  <h4 className="text-lg font-bold text-gray-900 mt-0.5">Platform Launch</h4>
                  <p className="text-xs md:text-sm text-[#4a3e35] leading-relaxed mt-1">
                    Sikh Street launched its first collection, showcasing verified independent brands and offering custom sizing options for Turbans and metal Kara.
                  </p>
                </div>

                {/* Year 3 */}
                <div className="relative">
                  <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-green-600 border-2 border-white" />
                  <span className="text-xs font-extrabold text-green-600">TODAY</span>
                  <h4 className="text-lg font-bold text-gray-900 mt-0.5">Connecting Globally</h4>
                  <p className="text-xs md:text-sm text-[#4a3e35] leading-relaxed mt-1">
                    Delivering authentic crafts to buyers worldwide and ensuring transparent payouts, fair workspace conditions, and educational initiatives for young apprentice artisans.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bottom CTA / Feedback Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-lg bg-[#8d4b00]/10 border border-[#8d4b00]/20 rounded-3xl p-8 text-center"
            >
              <h3 className="text-xl md:text-2xl font-bold text-gray-950 mb-3 font-serif">
                Join Us in Empowering Creators
              </h3>
              <p className="text-xs md:text-sm text-[#554336] max-w-md mx-auto mb-6 leading-relaxed">
                By purchasing from Sikh Street, you actively fund workshop materials, tool upgrades, and apprentice training for independent Sikh artisans.
              </p>
              <button 
                onClick={() => navigate("/home")}
                className="px-8 py-3.5 bg-gradient-to-r from-[#f1641e] to-[#8d4b00] text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Explore Curated Collections
              </button>
            </motion.div>

          </div>

          {/* Footer */}
          <footer className="w-full bg-[#fff1e9] border-t border-[#dbc2b0]/30 text-left mt-20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 px-6 md:px-12 py-12 w-full max-w-7xl mx-auto">
              <div className="max-w-xs">
                <h2 className="text-xl font-bold font-serif text-[#8d4b00] mb-4">Sikh Street</h2>
                <p className="text-sm text-[#554336] mb-6 leading-relaxed">
                  Celebrating the soul of Sikh craftsmanship. Every piece tells a story of devotion, history, and unmatched skill.
                </p>
                <div className="flex gap-4">
                  <a className="text-[#554336] hover:text-[#8d4b00] transition-colors" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                    </svg>
                  </a>
                  <a className="text-[#554336] hover:text-[#8d4b00] transition-colors" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </a>
                  <a className="text-[#554336] hover:text-[#8d4b00] transition-colors" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186l5.57 3.285m-5.57-3.285l5.57-3.284m0 0a2.25 2.25 0 113.564-1.804 2.25 2.25 0 01-3.564 1.804z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h5 className="text-sm font-bold text-[#8d4b00] mb-4">Shop</h5>
                  <ul className="space-y-3">
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/search">
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/category/turbans">
                        Turbans
                      </Link>
                    </li>
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/category/6">
                        Artwork
                      </Link>
                    </li>
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/search?q=bespoke">
                        Bespoke
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#8d4b00] mb-4">Experience</h5>
                  <ul className="space-y-3">
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/our-story">
                        Our Story
                      </Link>
                    </li>
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/brand/heritage-forge">
                        Artisan Directory
                      </Link>
                    </li>
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/brand/heritage-forge">
                        Sustainability
                      </Link>
                    </li>
                    <li>
                      <Link className="text-sm text-[#554336] hover:text-[#8d4b00] hover:underline transition-all" to="/brand/heritage-forge">
                        Shipping
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-bold text-[#8d4b00] mb-4">Newsletter</h5>
                <p className="text-sm text-[#554336] mb-4">
                  Join us for exclusive artisan stories.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Thank you for subscribing!");
                    e.target.reset();
                  }}
                  className="flex border-b border-[#8d4b00]/30 py-1"
                >
                  <input
                    className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none px-1 text-[#231a13] placeholder-[#554336]/60"
                    placeholder="Email address"
                    type="email"
                    required
                  />
                  <button type="submit" className="text-[#8d4b00] p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className="px-6 py-6 border-t border-[#dbc2b0]/20 text-center">
              <p className="text-xs text-[#554336]/60">
                © 2024 Sikh Street. Heritage Crafted.
              </p>
            </div>
          </footer>

        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default OurStory;
