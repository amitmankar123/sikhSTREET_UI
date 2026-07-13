import { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiPlayCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LazyImage from "../LazyImage";
import useSwipeGesture from "../../../modules/UserApp/hooks/useSwipeGesture";

const ImageGallery = ({ images, video, productName = "Product", children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ensure images is an array
  const imageArray =
    Array.isArray(images) && images.length > 0
      ? images
      : [images].filter(Boolean);

  const mediaArray = [
    ...imageArray.map((url) => ({ type: "image", url })),
    ...(video ? [{ type: "video", url: video }] : []),
  ];

  if (mediaArray.length === 0) {
    return (
      <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400">No media available</p>
      </div>
    );
  }

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % mediaArray.length);
  };

  const handlePrevious = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + mediaArray.length) % mediaArray.length
    );
  };

  const handleImageClick = () => {
    if (mediaArray[selectedIndex].type === "image") {
      setIsLightboxOpen(true);
    }
  };

  // Swipe gestures for image navigation
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 50,
  });

  return (
    <>
      <div className="w-full flex flex-col-reverse lg:flex-row gap-4">
        {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
        {mediaArray.length > 1 && (
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] lg:w-20 xl:w-24 flex-shrink-0 hide-scrollbar pb-2 lg:pb-0">
            {mediaArray.map((media, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-16 lg:w-full aspect-square flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 relative bg-gray-100 ${selectedIndex === index
                  ? "border-gray-900"
                  : "border-transparent hover:border-gray-300"
                  }`}>
                {media.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <FiPlayCircle className="text-xl text-gray-500" />
                  </div>
                ) : (
                  <LazyImage
                    src={media.url}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/100x100?text=Thumbnail";
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div
            className="relative w-full aspect-[4/5] lg:aspect-square bg-[#F9F9F9] rounded-2xl p-0 overflow-hidden"
            data-gallery>
            <motion.div
              key={selectedIndex}
              className="w-full h-full flex items-center justify-center cursor-zoom-in"
              onClick={handleImageClick}
              onTouchStart={swipeHandlers.onTouchStart}
              onTouchMove={swipeHandlers.onTouchMove}
              onTouchEnd={swipeHandlers.onTouchEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}>
              {mediaArray[selectedIndex].type === "video" ? (
                <video
                  src={mediaArray[selectedIndex].url}
                  controls
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <LazyImage
                  src={mediaArray[selectedIndex].url}
                  alt={`${productName} - Image ${selectedIndex + 1}`}
                  className="w-full h-full object-cover mix-blend-multiply"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/500x500?text=Product+Image";
                  }}
                />
              )}
            </motion.div>

            {/* Navigation Arrows (Mobile Only) */}
            {mediaArray.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:bg-white lg:hidden">
                  <FiChevronLeft className="text-gray-800 text-xl" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:bg-white lg:hidden">
                  <FiChevronRight className="text-gray-800 text-xl" />
                </button>
              </>
            )}
          </div>

          {/* Action Buttons / Badge Area (Injected via children) */}
          {children}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white transition-colors z-10">
              <FiX className="text-2xl" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full">
              <img
                src={mediaArray[selectedIndex]?.url}
                alt={`${productName} - Full view`}
                className="w-full h-full object-contain max-h-[90vh] rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/800x800?text=Product+Image";
                }}
              />

              {/* Navigation in Lightbox */}
              {mediaArray.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white transition-colors">
                      <FiChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white transition-colors">
                    <FiChevronRight className="text-2xl" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {mediaArray.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                  {selectedIndex + 1} / {mediaArray.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
