import { useEffect, useState } from "react";
import { FiHeart, FiArrowLeft, FiGrid, FiList } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import SwipeableWishlistItem from "../components/Mobile/SwipeableWishlistItem";
import WishlistGridItem from "../components/Mobile/WishlistGridItem";
import { useWishlistStore } from "../../../shared/store/wishlistStore";
import { useCartStore } from "../../../shared/store/useStore";
import { useAuthStore } from "../../../shared/store/authStore";
import toast from "react-hot-toast";
import PageTransition from '../../../shared/components/PageTransition';

const MobileWishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, removeItem, moveToCart, clearWishlist, fetchWishlist, isLoading } = useWishlistStore();
  const { addItem } = useCartStore();
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist().catch(() => null);
    }
  }, [isAuthenticated, fetchWishlist]);

  const handleMoveToCart = (item) => {
    const wishlistItem = moveToCart(item.id);
    if (wishlistItem) {
      addItem({
        ...wishlistItem,
        quantity: 1,
      });
      toast.success("Moved to cart!");
    }
  };

  const handleRemove = (id) => {
    removeItem(id);
    toast.success("Removed from wishlist");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
      toast.success("Wishlist cleared");
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={true} showCartBar={true}>
        <div className="w-full min-h-screen bg-gradient-to-br from-[#fff7f2] via-[#ffece0] to-[#fff7f2] pb-24 relative overflow-hidden font-sans">
          
          {/* Decorative Saffron Blurs */}
          <div className="absolute top-20 left-[-10%] w-[500px] h-[500px] rounded-full bg-[#f1641e]/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-40 right-[-15%] w-[600px] h-[600px] rounded-full bg-[#8d4b00]/10 blur-[150px] pointer-events-none" />

          {/* Header */}
          <div className="px-4 py-4 backdrop-blur-md bg-white/40 border-b border-white/20 sticky top-0 z-40 shadow-sm relative">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/40 rounded-full transition-colors flex-shrink-0">
                <FiArrowLeft className="text-xl text-gray-700" />
              </button>
              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-lg font-black text-gray-900 truncate font-serif">
                  My Wishlist
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
              </div>
              {items.length > 0 && (
                <div className="flex items-center gap-2">
                  {/* View Toggle Buttons */}
                  <div className="flex items-center bg-[#8d4b00]/5 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded transition-colors ${viewMode === "list"
                        ? "bg-white text-[#8d4b00] shadow-sm font-bold"
                        : "text-gray-500"
                        }`}>
                      <FiList className="text-lg" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded transition-colors ${viewMode === "grid"
                        ? "bg-white text-[#8d4b00] shadow-sm font-bold"
                        : "text-gray-500"
                        }`}>
                      <FiGrid className="text-lg" />
                    </button>
                  </div>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-600 font-bold px-3 py-1.5 hover:bg-red-50/50 rounded-lg transition-colors flex-shrink-0">
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-4 relative z-10">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading wishlist...</p>
              </div>
            ) : items.length === 0 ? (
              <EmptyWishlistState />
            ) : (
              <WishlistItems
                items={items}
                viewMode={viewMode}
                onMoveToCart={handleMoveToCart}
                onRemove={handleRemove}
              />
            )}
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

// Empty State Component
const EmptyWishlistState = () => (
  <div className="backdrop-blur-md bg-white/40 border border-white/40 rounded-3xl p-10 shadow-xl max-w-md mx-auto text-center mt-12 relative z-10">
    <div className="w-16 h-16 rounded-full bg-[#f1641e]/10 text-[#f1641e] flex items-center justify-center mx-auto mb-5">
      <FiHeart className="text-3xl" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">
      Your wishlist is empty
    </h3>
    <p className="text-sm text-[#554336]/80 mb-6">Start adding items you love!</p>
    <Link
      to="/home"
      className="px-8 py-3.5 bg-gradient-to-r from-[#f1641e] to-[#8d4b00] text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all inline-block">
      Continue Shopping
    </Link>
  </div>
);

// Wishlist Items Component
const WishlistItems = ({ items, viewMode, onMoveToCart, onRemove }) => {
  if (viewMode === "grid") {
    return (
      <AnimatePresence>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {items.map((item, index) => (
            <WishlistGridItem
              key={item.id}
              item={item}
              index={index}
              onMoveToCart={onMoveToCart}
              onRemove={onRemove}
            />
          ))}
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {items.map((item, index) => (
          <SwipeableWishlistItem
            key={item.id}
            item={item}
            index={index}
            onMoveToCart={onMoveToCart}
            onRemove={onRemove}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export default MobileWishlist;
