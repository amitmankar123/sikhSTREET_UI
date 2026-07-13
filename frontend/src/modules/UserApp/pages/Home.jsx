import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore, useUIStore } from "../../../shared/store/useStore";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import { formatPrice } from "../../../shared/utils/helpers";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import toast from "react-hot-toast";
import { FiHeart, FiStar } from "react-icons/fi";
import { products as allProducts } from "../../../data/products";
import { categories as initialCategories } from "../../../data/categories";

const MobileHome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favoriteShops, setFavoriteShops] = useState(() => {
    try {
      const saved = localStorage.getItem("favorite_shops");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const { addItem } = useCartStore();
  const { categories: backendCategories, initialize: initCategories } = useCategoryStore();

  useEffect(() => {
    try {
      localStorage.setItem("favorite_shops", JSON.stringify(favoriteShops));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteShops]);

  useEffect(() => {
    initCategories();
  }, [initCategories]);

  const rootCategories = (backendCategories.length > 0 ? backendCategories : initialCategories).filter((cat) => {
    const parent = typeof cat.parentId === 'object' ? (cat.parentId?._id || cat.parentId?.id) : cat.parentId;
    return !parent;
  });

  const realTurbanCategory = backendCategories.find(c => c.name?.toLowerCase().includes('turban'));

  // Find our specific mock products for the redesign
  const kirpan = allProducts.find((p) => p.id === 306) || {
    id: 306,
    name: "Premium Sterling Silver Kada",
    price: 95.00,
    image: "/images/redesign/silver_kada.png",
    description: "Elegant and premium Sikh Kada crafted from high-grade sterling silver, offering a brilliant, long-lasting glossy shine.",
    vendorId: 1,
    vendorName: "Sikh Heritage Store"
  };

  const journal = allProducts.find((p) => p.id === 307) || {
    id: 307,
    name: "Introduction to Sikhism",
    price: 15.00,
    image: "/images/redesign/media__1783408531361.png",
    description: "A comprehensive guide to understanding Sikhism, its history, and its practices.",
    vendorId: 1,
    vendorName: "Sikh Heritage Store"
  };

  const juttis = allProducts.find((p) => p.id === 302) || {
    id: 302,
    name: "Swirling Fish Artwork",
    price: 150.00,
    image: "/images/redesign/fish_artwork.png",
    description: "A beautiful painting of fishes swimming in a circular motion. A perfect piece of artwork for your home or office.",
    vendorId: 1,
    vendorName: "Sikh Heritage Store"
  };

  const voile = allProducts.find((p) => p.id === 460) || {
    id: 460,
    name: "Premium Sikh Turban",
    price: 40.00,
    image: "/images/turbans/media__1783759342309.jpg",
    description: "High quality premium voile turban fabric with rich colors.",
    vendorId: 3,
    vendorName: "Heritage Weaves"
  };

  const smallShopProducts = useMemo(() => {
    const targetIds = [303, 302, 460, 307];
    return targetIds.map(id => {
      const found = allProducts.find(p => Number(p.id) === Number(id));
      if (found) return found;
      // Fallback
      return {
        id,
        name: id === 303 ? "Classic Stainless Steel Kadda" : id === 302 ? "Swirling Fish Artwork" : id === 460 ? "Premium Sikh Turban" : "Introduction to Sikhism",
        price: id === 303 ? 35.00 : id === 302 ? 150.00 : id === 460 ? 40.00 : 15.00,
        image: id === 303 ? "/images/redesign/premium_kada.png" : id === 302 ? "/images/redesign/fish_artwork.png" : id === 460 ? "/images/turbans/media__1783759342309.jpg" : "/images/redesign/media__1783408531361.png",
        vendorName: id === 303 ? "Heritage Woodcarvers" : id === 302 ? "Amritsar Fine Arts" : id === 460 ? "Sikh Heritage Weaves" : "Amritsar Fine Arts"
      };
    });
  }, []);

  const handleAddToCart = (product) => {
    const success = addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      vendorId: product.vendorId || 1,
      vendorName: product.vendorName || "Unknown Vendor",
    });
    if (success !== false) {
      toast.success(`${product.name} added to cart!`);
      useUIStore.setState({ isCartOpen: true });
    }
  };

  // Set home page background color
  useEffect(() => {
    document.body.style.background = "#fff8f5";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <PageTransition>
      <MobileLayout fullWidth={true}>
        <div className="w-full relative overflow-hidden bg-background text-on-background font-body-md">

          {/* Hero Section */}
          <section className="pt-4 pb-6 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 lg:h-[300px]">
              {/* Main Feature Block */}
              <div className="lg:col-span-8 bg-[#e2e8e4] rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-sm h-full">
                <div className="w-full md:w-[55%] p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <span className="text-xs font-bold text-[#1b6d24] tracking-widest mb-2 uppercase block">
                    Established in Heritage
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-[2.25rem] font-bold font-serif mb-4 text-[#1a201b] leading-[1.1]">
                    Artisanship<br/>Rooted in<br/>Heritage
                  </h2>
                  <button
                    onClick={() => navigate("/categories")}
                    className="self-start bg-[#1a201b] hover:bg-[#333b34] text-white px-6 py-2.5 rounded-full font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                  >
                    Shop the collection
                  </button>
                </div>
                <div className="w-full md:w-[45%] h-48 md:h-full">
                  <img
                    className="w-full h-full object-cover"
                    alt="A craftsman's workshop"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRcrJXYq55TYTCtcpBAfokwfJVCLHa0pJxpg_qF9GozEgjSj2v6vlltBzQqMIvjkb8eUhzhDwwbcU94q7s8xhlIZy7Rg03Dj9ovs0_tSLW-efBV24zNqQvpgk1ThlcSUhJzzJn0NHYcEifleVZn-C0_Fb-2mvUAVb5B68Y2hBWzLp-g9N-BObQmeLFaP68M-CpJ5dr0ys6SoxDOBzDYgLOtgxn9bgiGCZgKHavOhYfs8aFjyx2BPjCvHHbauGCoHyd7pPfcRgmJdOP"
                  />
                </div>
              </div>

              {/* Secondary Feature Block */}
              <div className="lg:col-span-4 relative rounded-[2rem] overflow-hidden shadow-sm h-[250px] lg:h-full cursor-pointer group" onClick={() => navigate("/category/karas")}>
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="Sculptural Kara"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBz5f9HJGrpM3vRTXYIkoQzQQj8mQTww137XULJlzzvaaCPjDnIE5H7LW1-d_OzICNM5pkzOOTMKrujfK3x6NnNc6q8QBnsyirTlvUfDlk6YETwPK-_NONEUDHIBlB-RIoRGzuVK37X8lCtlHfHo6eFC7nFVk78-2FN8SPYt0YJI5VnVZ2_puk8eEQFcByZFE86bMiYbbBgCVytKaKz3JNEsDyntF3aT1VWbbVUuugoJJ-4N5U3e7Ggwdxfgb7cRWFc59Dc_Ah1A4Y"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full text-left">
                  <h3 className="text-white text-xl lg:text-2xl font-bold mb-2 leading-tight font-serif drop-shadow-md">
                    Timeless pieces that demand attention
                  </h3>
                  <span className="text-white font-semibold text-xs underline underline-offset-4 decoration-2 drop-shadow-md group-hover:text-gray-200">
                    Shop Karas
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Categories */}
          <section className="py-6 md:py-8 px-6 md:px-12 max-w-7xl mx-auto text-left">
            <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
              <div className="text-left">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
                  Curated Categories
                </h3>
                <p className="text-neutral-500 text-sm md:text-base mt-1 leading-relaxed">
                  Exceptional pieces across our cultural landscape.
                </p>
              </div>
              <Link to="/categories" className="text-xs font-semibold text-[#8d4b00] border-b border-[#8d4b00] hover:text-[#6e3900] hover:border-[#6e3900] transition-colors pb-1 self-start md:self-end mb-1">
                View All Categories
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {rootCategories.slice(0, 4).map((cat) => (
                <div
                  key={cat.id || cat._id}
                  onClick={() => navigate(`/category/${cat.id || cat._id}`)}
                  className="group cursor-pointer w-full text-center"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-2 transition-transform duration-500 group-hover:scale-[1.02] shadow-sm hover:shadow bg-[#f2dfd3]">
                    <img
                      className="w-full h-full object-cover"
                      alt={cat.name}
                      src={cat.image}
                    />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-[#231a13] group-hover:text-[#8d4b00] transition-colors block">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Discover Small Shops Section */}
          <section className="py-12 bg-[#faf6f0] text-left">
            <div className="max-w-7xl mx-auto px-container-margin">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
                    Discover small shops
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1 leading-relaxed">
                    Unique items from independent Sikh creators and heritage artisans.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: "heritage-woodcarvers",
                    name: "Heritage Woodcarvers",
                    rating: "4.9",
                    reviews: "124",
                    images: [
                      "/images/artwork/media__1783761276765.jpg",
                      "/images/redesign/premium_kada.png",
                      "/images/redesign/media__1783408531361.png"
                    ]
                  },
                  {
                    id: "amritsar-fine-arts",
                    name: "Amritsar Fine Arts",
                    rating: "5.0",
                    reviews: "82",
                    images: [
                      "/images/redesign/fish_artwork.png",
                      "/images/artwork/media__1783761276765.jpg",
                      "/images/redesign/media__1783408531361.png"
                    ]
                  },
                  {
                    id: "sikh-heritage-weaves",
                    name: "Sikh Heritage Weaves",
                    rating: "4.8",
                    reviews: "95",
                    images: [
                      "/images/turbans/media__1783759342309.jpg",
                      "/images/turbans/media__1783759510824.jpg",
                      "/images/turbans/media__1783759513166.jpg"
                    ]
                  }
                ].map((shop) => {
                  const isFav = !!favoriteShops[shop.id];
                  return (
                    <div
                      key={shop.id}
                      onClick={() => navigate(`/brand/${shop.id}`)}
                      className="bg-white rounded-2xl border border-neutral-205/60 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      {/* Collage Header */}
                      <div className="p-3 pb-0 relative">
                        {/* Heart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFavoriteShops(prev => ({ ...prev, [shop.id]: !prev[shop.id] }));
                            toast.success(isFav ? "Removed from favorites" : "Added to favorites", {
                              icon: isFav ? "💔" : "❤️"
                            });
                          }}
                          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-neutral-600 hover:text-red-500 transition-all active:scale-90"
                        >
                          <FiHeart className={`text-base transition-colors ${isFav ? "text-[#F1641E] fill-[#F1641E]" : ""}`} />
                        </button>

                        <div className="grid grid-cols-3 gap-1.5 h-36 md:h-44 rounded-xl overflow-hidden">
                          {/* Large Image */}
                          <div className="col-span-2 h-full overflow-hidden bg-stone-100">
                            <img
                              src={shop.images[0]}
                              alt={`${shop.name} main`}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            />
                          </div>
                          {/* Stacked Images */}
                          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
                            <div className="h-full overflow-hidden bg-stone-100">
                              <img
                                src={shop.images[1]}
                                alt={`${shop.name} detail 1`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="h-full overflow-hidden bg-stone-100">
                              <img
                                src={shop.images[2]}
                                alt={`${shop.name} detail 2`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shop Info Footer */}
                      <div className="p-4 pt-3 flex flex-row items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#F1641E] transition-colors truncate">
                            {shop.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="flex items-center gap-0.5 text-xs text-neutral-900 font-bold">
                              <FiStar className="text-yellow-500 fill-yellow-500 text-xs" />
                              {shop.rating}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              ({shop.reviews} reviews)
                            </span>
                          </div>
                        </div>
                        {/* Go to shop arrow */}
                        <div className="w-8 h-8 rounded-full bg-stone-50 group-hover:bg-[#F1641E]/10 group-hover:text-[#F1641E] flex items-center justify-center text-neutral-450 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured Items from Small Shops Section */}
          <section className="py-12 bg-[#faf6f0] text-left border-t border-[#ebdcd0]/40">
            <div className="max-w-7xl mx-auto px-container-margin">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
                    Featured Items from Small Shops
                  </h3>
                  <p className="text-neutral-500 text-sm mt-1 leading-relaxed">
                    Handpicked local creations available today.
                  </p>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {smallShopProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="overflow-hidden aspect-square relative bg-stone-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="mb-3">
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider block mb-1">
                          {product.vendorName}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-800 line-clamp-2 hover:text-[#F1641E] transition-colors leading-snug">
                          {product.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-50">
                        <span className="text-sm font-extrabold text-neutral-900">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="px-4 py-2 bg-[#8d4b00] hover:bg-[#6e3900] text-white rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 shadow-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Products (Bento Style) */}
          <section className="py-xl bg-surface-container-low text-left">
            <div className="max-w-7xl mx-auto px-container-margin">
              <div className="mb-12 text-center">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                  Trending Pieces
                </h3>
                <p className="text-neutral-600 text-base md:text-lg mt-2 leading-relaxed">
                  The most sought-after crafts this season.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:h-[800px]">
                {/* Large Feature: Kirpan */}
                <div className="md:col-span-2 md:row-span-2 bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                  <div className="relative h-[250px] sm:h-[350px] md:h-[70%] overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={kirpan.name}
                      src={kirpan.image}
                    />
                    <span className="absolute top-4 left-4 bg-[#1b6d24] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      NEW ARRIVAL
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-bold text-[#231a13]">{kirpan.name}</h4>
                        <span className="text-xl font-bold text-[#8d4b00]">${kirpan.price}</span>
                      </div>
                      <p className="text-sm text-[#554336] mt-2">
                        {kirpan.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(kirpan)}
                      className="w-full bg-[#8d4b00] hover:bg-[#6e3900] text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.98] shadow-sm hover:shadow"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Standard Card 1: Journal */}
                <div className="md:col-span-1 bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${journal.id}`)}>
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={journal.name}
                      src={journal.image}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="cursor-pointer text-left" onClick={() => navigate(`/product/${journal.id}`)}>
                      <h4 className="text-sm font-semibold text-[#231a13] mb-1 truncate">{journal.name}</h4>
                      <span className="text-sm font-bold text-[#8d4b00]">${journal.price}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(journal)}
                      className="flex items-center justify-center self-end text-[#8d4b00] hover:scale-110 transition-transform p-1.5 hover:bg-[#8d4b00]/5 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Standard Card 2: Juttis */}
                <div className="md:col-span-1 bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-48 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${juttis.id}`)}>
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={juttis.name}
                      src={juttis.image}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="cursor-pointer text-left" onClick={() => navigate(`/product/${juttis.id}`)}>
                      <h4 className="text-sm font-semibold text-[#231a13] mb-1 truncate">{juttis.name}</h4>
                      <span className="text-sm font-bold text-[#8d4b00]">${juttis.price}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(juttis)}
                      className="flex items-center justify-center self-end text-[#8d4b00] hover:scale-110 transition-transform p-1.5 hover:bg-[#8d4b00]/5 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Medium Feature: Full-Voile */}
                <div className="md:col-span-2 bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row">
                  <div className="md:w-1/2 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${voile.id}`)}>
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={voile.name}
                      src={voile.image}
                    />
                  </div>
                  <div className="p-6 md:w-1/2 flex flex-col justify-center text-left">
                    <h4 className="text-lg font-bold text-[#231a13] mb-2">{voile.name}</h4>
                    <p className="text-sm text-[#554336] mb-4">
                      {voile.description}
                    </p>
                    <span className="text-lg font-bold text-[#8d4b00] mb-4 block">${voile.price}</span>
                    <button
                      onClick={() => navigate(`/product/${voile.id}`)}
                      className="w-full border border-[#8d4b00]/30 hover:bg-[#8d4b00]/5 text-[#8d4b00] py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                      Shop Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Artisan */}
          <section id="maker-section" className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto text-left">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="w-full md:w-1/2 relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                  <img
                    className="w-full h-full object-cover"
                    alt="Master Gurcharan Singh working on a piece of metalwork"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqMDXl2T65jyXSB9qeTJbnhG6G63aSMxrS9MUh0AbYVUdIDbGb1C9q5zVZDceaN7_Pwv058Lj-KsSgRwEzCJFUMAbtCByAMBt9t7qPEnVu8OX9GKowcLmKAy2DvI40dzo_tFZ-gk8-G2CdQgVtTQ64920GdgIjQGlqIp1wp_iUPpoTgquKdxgTjN9WLcy5cFXNMKqcU8uaA07icHP82RYxtFURIju60gx7_rTdvMXYc1NrM643G5Q7z1Bz2xHFltW_geS4P_MmP9Ow"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#fff8f5]/90 backdrop-blur-md border border-[#e8e8e8] p-6 rounded-2xl shadow-lg max-w-[260px] hidden md:block">
                  <p className="italic text-sm text-[#231a13] mb-3">
                    "Every piece I create carries the breath of my ancestors."
                  </p>
                  <span className="text-xs font-bold text-[#8d4b00]">— Master Gurcharan Singh</span>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <span className="text-xs font-bold text-[#8d4b00] tracking-[0.2em] mb-4 block">MEET THE MAKER</span>
                <h3 className="text-3xl md:text-5xl font-bold mb-6 text-[#231a13] leading-tight">
                  Preserving the Art of Damascening
                </h3>
                <p className="text-base md:text-lg text-[#554336] mb-8 leading-relaxed">
                  Gurcharan Singh is one of the few remaining masters of traditional Koftgari (damascening). For over 40 years, he has dedicated his life to the silent dialogue between steel and gold, ensuring that this sacred craft doesn't fade into the digital hum of the 21st century.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-[#8d4b00]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    <span className="text-sm font-semibold text-[#231a13]">Certified Master Craftsman</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-[#8d4b00]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className="text-sm font-semibold text-[#231a13]">40+ Years of Dedication</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/brand/heritage-forge")}
                  className="bg-[#8d4b00] hover:bg-[#6e3900] text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  Read Gurcharan's Story
                </button>
              </div>
            </div>
          </section>

          {/* Collections Split */}
          <section className="grid grid-cols-1 md:grid-cols-2">
            {/* Split 1 */}
            <div className="relative h-[600px] flex items-center justify-center group overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="The Autumn Turban Collection"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5jOIE9GLvGD1oodEglECqBt0QA2vDPX7jcJ9k41uHIxdO1JHVBBsn-O6SjsQxrXZcl6Obfu6qVpHeqDmqIQ0lTiacm4Z-zphtDQIvI0s6VYse_6VIdvW4uwSSW-Vf618DAW_RFSdzugyQB9jOTEaUW5fuEn57cjDshUjZcA3ddK6KkZPCYgVxAs_BN851yafpF2nPCFRlc3wZ4gxjFjzrWyFjFyjoH3_igTd2Jn-YMUFQ-Dehy6rniOJ9RuQ6BcpF5Z_cM4812eEj"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="relative z-10 text-center text-white p-8 md:p-12">
                <h4 className="text-3xl md:text-5xl mb-4 font-bold font-serif leading-tight">
                  The Autumn Turban Collection
                </h4>
                <p className="text-base mb-8 max-w-sm mx-auto">
                  Seasonal palettes inspired by the golden fields of Punjab.
                </p>
                <button
                  onClick={() => navigate("/category/turbans")}
                  className="border-2 border-white text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-white hover:text-[#231a13] transition-all duration-300 active:scale-95"
                >
                  Discover Autumn
                </button>
              </div>
            </div>

            {/* Split 2 */}
            <div className="relative h-[600px] flex items-center justify-center group overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt="Sacred Art collection"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2VCzKeFarMTmCR89h0pDx4iezNOJ4nXErI-pi9uyeurTsJikFqWwQ33iStse3fWR4av5m5LIvWbtCIN2MZSwrx46RgaGIY_LUFMpG6f10ev03ref0gEXHZtT6-O8pykK3kihCX4SSdkvr4ZmhaBzI1nNwOmCHyqpqlBeh-Z7AXqsuhclMCFrMNQHfeptnRqNptnBpds0PhD8pfh_rQsMCeW9Y_wXvUgK_9M6BGpv3sK1ENtfzI39nzTD66Lb6ZCmtL9Zh5C4zXGnj"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="relative z-10 text-center text-white p-8 md:p-12">
                <h4 className="text-3xl md:text-5xl mb-4 font-bold font-serif leading-tight">
                  Sacred Art
                </h4>
                <p className="text-base mb-8 max-w-sm mx-auto">
                  Spiritual resonance captured through contemporary lenses.
                </p>
                <button
                  onClick={() => navigate("/category/6")}
                  className="border-2 border-white text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-white hover:text-[#231a13] transition-all duration-300 active:scale-95"
                >
                  Explore Art
                </button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 md:py-24 bg-[#fdeade]/40">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12 text-[#8d4b00]/30 mx-auto mb-8">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              <div className="overflow-hidden relative">
                <div
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {/* Testimonial Slide 1 */}
                  <div className="w-full flex-shrink-0 px-4">
                    <p className="text-lg md:text-2xl font-serif italic mb-8 text-[#231a13] max-w-2xl mx-auto leading-relaxed">
                      "The quality of the full-voile fabric is unmatched. You can feel the heritage in every thread. Sikh Street isn't just a store; it's a bridge to our identity."
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#8d4b00]">
                        <img
                          className="w-full h-full object-cover"
                          alt="Customer Amandeep S."
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkUopceKbhLbYLKYKgyiR_-x09JHnybRdjwso8r9VEslGNssgSmFX6Rc7e4WWrAc74jIpIEIH3p-iFI8c5sEo7IGYlyQQ5CRLTiBikdzf9lJ7CWCOurgT9klPxDhd-A8Yqnz0GlIOdKpmmojhNnBYLur3G8FCCpfi969J1pWQwwoc58xxpeZoYyZJIsw4vdRwODlS2_h41gs66Dc8tiFPo_TUxu2vxmj5VEPdpN408Z1V9rzae-RYe0pZJIx91SZivR2CjW40ok0iq"
                        />
                      </div>
                      <span className="text-sm font-semibold text-[#231a13]">Amandeep S.</span>
                      <span className="text-xs text-[#554336]">London, UK</span>
                    </div>
                  </div>

                  {/* Testimonial Slide 2 */}
                  <div className="w-full flex-shrink-0 px-4">
                    <p className="text-lg md:text-2xl font-serif italic mb-8 text-[#231a13] max-w-2xl mx-auto leading-relaxed">
                      "Purchasing the Koftgari Kirpan was a spiritual experience. The craftsmanship is pristine, and you can see the artisan's lifetime devotion in every engraving."
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#8d4b00] bg-[#8d4b00] flex items-center justify-center text-white font-bold font-sans">
                        JS
                      </div>
                      <span className="text-sm font-semibold text-[#231a13]">Jaspreet S.</span>
                      <span className="text-xs text-[#554336]">Toronto, Canada</span>
                    </div>
                  </div>

                  {/* Testimonial Slide 3 */}
                  <div className="w-full flex-shrink-0 px-4">
                    <p className="text-lg md:text-2xl font-serif italic mb-8 text-[#231a13] max-w-2xl mx-auto leading-relaxed">
                      "Extremely fast shipping to the US. The Dilruba has a beautiful resonant sound and was set up perfectly. Truly authentic artisan heritage."
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#8d4b00] bg-[#8d4b00] flex items-center justify-center text-white font-bold font-sans">
                        HK
                      </div>
                      <span className="text-sm font-semibold text-[#231a13]">Harpreet K.</span>
                      <span className="text-xs text-[#554336]">California, USA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {[0, 1, 2].map((slideIdx) => (
                  <button
                    key={slideIdx}
                    onClick={() => setCurrentSlide(slideIdx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === slideIdx ? "bg-[#8d4b00] w-6" : "bg-[#dbc2b0]"
                      }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full bg-[#fff1e9] border-t border-[#dbc2b0]/30 text-left">
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

export default MobileHome;
