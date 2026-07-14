import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiStar,
  FiHeart,
  FiShoppingBag,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShare2,
  FiCheckCircle,
  FiTrash2,
  FiTag,
  FiCompass,
  FiInfo,
  FiChevronDown,
  FiFlag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useCartStore, useUIStore } from "../../../shared/store/useStore";
import { useWishlistStore } from "../../../shared/store/wishlistStore";
import { useReviewsStore } from "../../../shared/store/reviewsStore";
import { useOrderStore } from "../../../shared/store/orderStore";
import { useAuthStore } from "../../../shared/store/authStore";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import {
  getProductById,
  getSimilarProducts,
  getVendorById,
  getBrandById,
} from "../data/catalogData";
import api from "../../../shared/utils/api";
import { formatPrice } from "../../../shared/utils/helpers";
import toast from "react-hot-toast";
import MobileLayout from "../components/Layout/MobileLayout";
import ImageGallery from "../../../shared/components/Product/ImageGallery";
import VariantSelector from "../../../shared/components/Product/VariantSelector";
import ReviewForm from "../../../shared/components/Product/ReviewForm";
import ProductQA from "../components/ProductQA";
import MobileProductCard from "../components/Mobile/MobileProductCard";
import PageTransition from "../../../shared/components/PageTransition";
import Badge from "../../../shared/components/Badge";
import ProductCard from "../../../shared/components/ProductCard";
import { getVariantSignature, resolveVariantPrice } from "../../../shared/utils/variant";



const isMongoId = (value) => {
  const str = String(value || "").trim();
  return /^[a-fA-F0-9]{24}$/.test(str) || /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i.test(str);
};
const normalizeProduct = (raw) => {
  if (!raw) return null;

  const vendorObj =
    raw?.vendor && typeof raw.vendor === "object"
      ? raw.vendor
      : raw?.vendorId && typeof raw.vendorId === "object"
        ? raw.vendorId
        : null;
  const brandObj =
    raw?.brand && typeof raw.brand === "object"
      ? raw.brand
      : raw?.brandId && typeof raw.brandId === "object"
        ? raw.brandId
        : null;
  const categoryObj =
    raw?.category && typeof raw.category === "object"
      ? raw.category
      : raw?.categoryId && typeof raw.categoryId === "object"
        ? raw.categoryId
        : null;

  const id = String(raw?.id || raw?._id || "").trim();
  if (!id) return null;

  const vendorId = String(vendorObj?._id || vendorObj?.id || raw?.vendorId || "").trim();
  const brandId = String(brandObj?._id || brandObj?.id || raw?.brandId || "").trim();
  const categoryId = String(categoryObj?._id || categoryObj?.id || raw?.categoryId || "").trim();
  const image = raw?.image || raw?.images?.[0] || "";
  const images = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : image ? [image] : [];

  return {
    ...raw,
    id,
    _id: id,
    vendorId,
    brandId,
    categoryId,
    image,
    images,
    price: Number(raw?.price) || 0,
    originalPrice:
      raw?.originalPrice !== undefined && raw?.originalPrice !== null
        ? Number(raw.originalPrice)
        : undefined,
    rating: Number(raw?.rating) || 0,
    reviewCount: Number(raw?.reviewCount) || 0,
    stockQuantity: Number(raw?.stockQuantity) || 0,
    vendorName: raw?.vendorName || vendorObj?.storeName || vendorObj?.name || "",
    brandName: raw?.brandName || brandObj?.name || "",
    categoryName: raw?.categoryName || categoryObj?.name || "",
    vendor: vendorObj
      ? {
        ...vendorObj,
        id: String(vendorObj?.id || vendorObj?._id || vendorId),
      }
      : null,
    brand: brandObj
      ? {
        ...brandObj,
        id: String(brandObj?.id || brandObj?._id || brandId),
      }
      : null,
    stock:
      raw?.stock ||
      (Number(raw?.stockQuantity) > 0 ? "in_stock" : "out_of_stock"),
    description: String(raw?.description || "").trim(),
    unit: String(raw?.unit || "Piece").trim(),
  };
};

const MobileProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const localFallbackProduct = useMemo(() => normalizeProduct(getProductById(id)), [id]);
  const [product, setProduct] = useState(localFallbackProduct);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [embroideryEnabled, setEmbroideryEnabled] = useState(false);
  const [giftWrapEnabled, setGiftWrapEnabled] = useState(false); // Turban only
  const [embroideryDemand, setEmbroideryDemand] = useState("");
  const [giftWrapDemand, setGiftWrapDemand] = useState("");
  const [artGiftWrapEnabled, setArtGiftWrapEnabled] = useState(false); // Art only — separate from turban
  const [personalMessage, setPersonalMessage] = useState("");
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [selectedArtSize, setSelectedArtSize] = useState(null);
  const [selectedArtMaterial, setSelectedArtMaterial] = useState(null);

  useEffect(() => {
    if (product?.turbanConfig?.fabric?.length > 0) {
      setSelectedFabric(null);
    }
  }, [product]);

  const { categories, initialize: initializeCategories } = useCategoryStore();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      initializeCategories();
    }
  }, [categories, initializeCategories]);

  const breadcrumbs = useMemo(() => {
    if (!product || !categories || categories.length === 0) return [];

    const path = [];
    let currentId = product.categoryId;
    const visited = new Set();

    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const cat = categories.find(
        (c) => String(c.id || c._id) === String(currentId)
      );
      if (!cat) break;
      path.unshift(cat);

      const parent = cat.parentId;
      const parentId =
        parent && typeof parent === "object"
          ? parent._id || parent.id
          : parent;
      currentId = parentId;
    }

    return path;
  }, [product, categories]);


  const isKada = useMemo(() => {
    if (!product) return false;
    const nameMatch = (product.name || "").toLowerCase().includes("kada") || (product.name || "").toLowerCase().includes("kadda") || (product.name || "").toLowerCase().includes("bangle");
    const catMatch = (product.categoryName || "").toLowerCase().includes("kada") || (product.categoryName || "").toLowerCase().includes("kadda") || (product.categoryName || "").toLowerCase().includes("bangle");
    const idMatch = String(product.categoryId).toLowerCase().includes("kada") || String(product.categoryId).toLowerCase().includes("kadda");
    return nameMatch || catMatch || idMatch;
  }, [product]);

  const isTurbanProduct = useMemo(() => {
    if (!product) return false;
    const catMatch = (product.categoryName || "").toLowerCase().includes("turban");
    const hasTurbanConfig = product.turbanConfig && (
      Array.isArray(product.turbanConfig.fabric) && product.turbanConfig.fabric.length > 0 ||
      product.turbanConfig.embroidery?.enabled ||
      product.turbanConfig.giftWrap?.enabled
    );
    return catMatch || hasTurbanConfig;
  }, [product]);

  // isArtProduct: completely separate from isTurbanProduct — artConfig never mixes with turbanConfig
  
  const isBookProduct = useMemo(() => {
    if (!product) return false;
    const catMatch = (product.categoryName || "").toLowerCase().includes("book");
    const idMatch = String(product.categoryId).toLowerCase().includes("book");
    return catMatch || idMatch;
  }, [product]);

  const isArtProduct = useMemo(() => {
    if (!product) return false;
    const catMatch = (product.categoryName || "").toLowerCase().includes("art");
    const hasArtConfig = !!product.artConfig;
    const hasFrameVariant = Array.isArray(product.variants?.attributes) &&
      product.variants.attributes.some((a) => String(a.name || "").toLowerCase() === "frame");
    return catMatch || hasArtConfig || hasFrameVariant;
  }, [product]);

  const isFractionalUnit = useMemo(() => {
    if (isTurbanProduct) return false;
    if (!product?.unit) return false;
    const unitStr = product.unit.toLowerCase();
    return ['meter', 'meters', 'm', 'kg', 'kilogram', 'kilograms', 'gram', 'grams', 'g', 'litre', 'litres', 'l'].includes(unitStr);
  }, [product?.unit, isTurbanProduct]);

  const quantityStep = isFractionalUnit ? 0.5 : 1;
  const minQuantity = isFractionalUnit ? 0.5 : 1;

  const { items, addItem, removeItem } = useCartStore();
  const triggerCartAnimation = useUIStore(
    (state) => state.triggerCartAnimation
  );
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const { fetchReviews, sortReviews, addReview } = useReviewsStore();
  const { getAllOrders, fetchUserOrders, orders } = useOrderStore();
  const { user, isAuthenticated } = useAuthStore();
  const vendor = useMemo(() => {
    if (!product) return null;
    if (product.vendor?.id) return product.vendor;
    return getVendorById(product.vendorId);
  }, [product]);
  const brand = useMemo(() => {
    if (!product) return null;
    if (product.brand?.id) return product.brand;
    return getBrandById(product.brandId);
  }, [product]);

  const isFavorite = product ? isInWishlist(product.id) : false;
  const selectedVariantSignature = getVariantSignature(selectedVariant || {});
  const isInCart = product
    ? items.some(
      (item) =>
        String(item.id) === String(product.id) &&
        getVariantSignature(item.variant || {}) === selectedVariantSignature
    )
    : false;
  const productReviews = product ? sortReviews(product.id, "newest") : [];

  useEffect(() => {
    let active = true;
    setIsLoadingProduct(true);

    const loadProductDetail = async () => {
      try {
        const [detailRes, similarRes] = await Promise.allSettled([
          api.get(`/products/${id}`),
          api.get(`/similar/${id}`),
        ]);

        const detailPayload =
          detailRes.status === "fulfilled"
            ? detailRes.value?.data ?? detailRes.value
            : null;
        const resolvedProduct = normalizeProduct(detailPayload) || localFallbackProduct;

        const similarPayload =
          similarRes.status === "fulfilled"
            ? similarRes.value?.data ?? similarRes.value
            : null;
        const resolvedSimilar = Array.isArray(similarPayload)
          ? similarPayload
            .map(normalizeProduct)
            .filter(
              (item) => item?.id && String(item.id) !== String(resolvedProduct?.id || "")
            )
            .slice(0, 5)
          : [];

        if (!active) return;

        setProduct(resolvedProduct);
        if (resolvedSimilar.length > 0) {
          setSimilarProducts(resolvedSimilar);
        } else if (resolvedProduct?.id) {
          setSimilarProducts(getSimilarProducts(resolvedProduct.id, 5));
        } else {
          setSimilarProducts([]);
        }
      } catch {
        if (!active) return;
        setProduct(localFallbackProduct);
        setSimilarProducts(
          localFallbackProduct?.id ? getSimilarProducts(localFallbackProduct.id, 5) : []
        );
      } finally {
        if (active) setIsLoadingProduct(false);
      }
    };

    loadProductDetail();
    return () => {
      active = false;
    };
  }, [id, localFallbackProduct]);

  useEffect(() => {
    if (product?.variants?.defaultSelection && typeof product.variants.defaultSelection === "object") {
      setSelectedVariant(product.variants.defaultSelection);
      return;
    }
    if (product?.variants?.defaultVariant) {
      setSelectedVariant(product.variants.defaultVariant);
      return;
    }
    setSelectedVariant({});
  }, [product]);

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id, { sort: "newest", limit: 50 });
    }
  }, [product?.id, fetchReviews]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserOrders(1, 50).catch(() => null);
    }
  }, [isAuthenticated, fetchUserOrders]);

  useEffect(() => {
    if (product?.id && (window.location.hash === "#reviews" || window.location.search.includes("write-review=true"))) {
      // Small timeout to allow DOM to render and layout to settle
      const timer = setTimeout(() => {
        const el = document.getElementById("reviews-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [product, isAuthenticated]);

  const handleAddToCart = (redirectToCheckout = false) => {
    if (!product) return;
    const attributeAxes = Array.isArray(product?.variants?.attributes)
      ? product.variants.attributes.filter((attr) => Array.isArray(attr?.values) && attr.values.length > 0)
      : [];
    const hasDynamicAxes = attributeAxes.length > 0;
    const hasSizeVariants = Array.isArray(product?.variants?.sizes) && product.variants.sizes.length > 0;
    const hasColorVariants = Array.isArray(product?.variants?.colors) && product.variants.colors.length > 0;
    const isMissingDynamicAxis = hasDynamicAxes
      ? attributeAxes.some((attr) => !String(selectedVariant?.[attr.name] || selectedVariant?.[String(attr.name || "").toLowerCase().replace(/\s+/g, "_")] || "").trim())
      : false;
    const selectedSize = String(selectedVariant?.size || "").trim();
    const selectedColor = String(selectedVariant?.color || "").trim();
    if (isMissingDynamicAxis || ((hasSizeVariants && !selectedSize) || (hasColorVariants && !selectedColor))) {
      toast.error("Please select required variant options");
      return;
    }

    if (product?.artworkConfig) {
      if (!selectedArtSize || !selectedArtMaterial) {
        toast.error("Please select both Size and Stretched/Unstretched options");
        return;
      }
    }

    let computedBaseRate = resolveVariantPrice(product, selectedVariant || {});
    if (product?.artworkConfig && selectedArtSize && selectedArtMaterial) {
      computedBaseRate = selectedArtSize.basePrice * selectedArtMaterial.priceMultiplier;
    }
    const baseRate = computedBaseRate;
    const fabricRate = selectedFabric ? Number(selectedFabric.price) : 0;
    const ratePerMeter = isTurbanProduct && fabricRate > 0 ? fabricRate : baseRate;

    // Turban-specific fees
    const embroideryFee = (isTurbanProduct && embroideryEnabled && product?.turbanConfig?.embroidery?.price) ? Number(product.turbanConfig.embroidery.price) : 0;
    const giftWrapFee = (isTurbanProduct && giftWrapEnabled && product?.turbanConfig?.giftWrap?.price) ? Number(product.turbanConfig.giftWrap.price) : 0;

    // Art-specific gift wrap fee (separate from turban)
    const artGiftWrapFeeLocal = (isArtProduct && artGiftWrapEnabled && product?.artConfig?.giftWrap?.price) ? Number(product.artConfig.giftWrap.price) : 0;

    const turbanLength = isTurbanProduct ? (parseFloat(selectedVariant?.size) || 1) : 1;
    // baseRate for art already includes frame add-on price
    const finalPrice = ratePerMeter * turbanLength + embroideryFee + giftWrapFee + artGiftWrapFeeLocal;

    const cartVariant = {
      ...(selectedVariant || {}),
      ...(selectedFabric ? { fabric: selectedFabric.type } : {}),
      ...(embroideryEnabled ? { embroidery: "Yes", embroidery_demand: embroideryDemand } : {}),
      ...(giftWrapEnabled ? { gift_wrap: "Yes", gift_wrap_demand: giftWrapDemand } : {}),
      ...(artGiftWrapEnabled ? { art_gift_wrap: "Yes" } : {}),
      ...(product?.artworkConfig && selectedArtSize ? { art_size: selectedArtSize.label } : {}),
      ...(product?.artworkConfig && selectedArtMaterial ? { art_material: selectedArtMaterial.label } : {}),
      ...(personalMessage ? { personal_message: personalMessage } : {}),
    };

    const variantKey = getVariantSignature(selectedVariant || {});
    const variantStockValue = Number(
      product?.variants?.stockMap?.[variantKey] ??
      product?.variants?.stockMap?.get?.(variantKey)
    );
    const effectiveStock = Number.isFinite(variantStockValue)
      ? variantStockValue
      : Number(product.stockQuantity || 0);

    if (redirectToCheckout) {
      if (effectiveStock <= 0) {
        toast.error("Selected variant is out of stock");
        return;
      }
      if (quantity > effectiveStock) {
        toast.error(`Only ${effectiveStock} item(s) available for selected variant`);
        return;
      }
    }

    const addedToCart = addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: quantity,
      variant: cartVariant,
      stockQuantity: effectiveStock,
      vendorId: product.vendorId,
      vendorName: vendor?.storeName || vendor?.name || product.vendorName,
      unit: isTurbanProduct ? 'Piece' : product.unit,
    }, !redirectToCheckout);
    if (!addedToCart) return;
    if (redirectToCheckout === true) {
      navigate('/checkout');
    } else {
      triggerCartAnimation();
      toast.success("Added to cart!");
    }
  };

  const handleRemoveFromCart = () => {
    if (!product) return;
    removeItem(product.id, selectedVariant || {});
    toast.success("Removed from cart!");
  };

  const handleFavorite = () => {
    if (!product) return;
    if (isFavorite) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      const addedToWishlist = addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      if (addedToWishlist) {
        toast.success("Added to wishlist");
      }
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = parseFloat((Number(quantity) + Number(change)).toFixed(2));
    const effectiveMax = 999;

    if (newQuantity >= minQuantity && newQuantity <= effectiveMax) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityInput = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val >= minQuantity) {
      setQuantity(val);
    }
  };

  const productImages = useMemo(() => {
    if (!product) return [];

    const selectedVariantKey = getVariantSignature(selectedVariant || {});
    const colorKey = selectedVariant?.color ? `color=${String(selectedVariant.color).trim().toLowerCase()}` : "";
    const selectedVariantImg = String(
      product?.variants?.imageMap?.[selectedVariantKey] ||
      product?.variants?.imageMap?.get?.(selectedVariantKey) ||
      product?.variants?.imageMap?.[colorKey] ||
      product?.variants?.imageMap?.get?.(colorKey) ||
      ""
    ).trim();

    const baseImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images.filter(Boolean)
        : product.image
          ? [product.image]
          : [];

    const allVariantImages = [];
    if (product?.variants?.imageMap) {
      const mapValues = product.variants.imageMap instanceof Map
        ? Array.from(product.variants.imageMap.values())
        : Object.values(product.variants.imageMap);
      mapValues.forEach(val => {
        if (typeof val === "string" && val.trim() && !allVariantImages.includes(val.trim())) {
          allVariantImages.push(val.trim());
        }
      });
    }

    const combined = [];
    if (selectedVariantImg) {
      combined.push(selectedVariantImg);
    }

    baseImages.forEach(img => {
      if (!combined.includes(img)) {
        combined.push(img);
      }
    });

    allVariantImages.forEach(img => {
      if (!combined.includes(img)) {
        combined.push(img);
      }
    });

    return combined;
  }, [product, selectedVariant]);

  const currentPrice = useMemo(() => {
    return resolveVariantPrice(product, selectedVariant);
  }, [product, selectedVariant]);

  const selectedAvailableStock = useMemo(() => {
    return 999;
  }, []);

  const productFaqs = useMemo(() => {
    if (!Array.isArray(product?.faqs)) return [];
    return product.faqs
      .map((faq) => ({
        question: String(faq?.question || "").trim(),
        answer: String(faq?.answer || "").trim(),
      }))
      .filter((faq) => faq.question && faq.answer);
  }, [product?.faqs]);

  const eligibleDeliveredOrderId = useMemo(() => {
    if (!isAuthenticated || !user?.id || !isMongoId(product?.id)) return null;
    const userOrders = getAllOrders(user.id) || [];
    const eligibleOrder = userOrders.find((order) => {
      if (String(order?.status || "").toLowerCase() !== "delivered") return false;
      const items = Array.isArray(order?.items) ? order.items : [];
      return items.some(
        (item) => String(item?.productId || item?.id || "") === String(product.id)
      );
    });
    return eligibleOrder?.id || eligibleOrder?._id || null;
  }, [isAuthenticated, user?.id, product?.id, orders]);

  const handleSubmitReview = async (reviewData) => {
    if (!eligibleDeliveredOrderId) {
      toast.error("You can review only after this product is delivered");
      return false;
    }

    const ok = await addReview(product.id, {
      ...reviewData,
      orderId: eligibleDeliveredOrderId,
    });
    if (!ok) {
      toast.error("Unable to submit review");
      return false;
    }

    await fetchReviews(product.id, { sort: "newest", limit: 50 });
    return true;
  };

  let baseRate = product ? resolveVariantPrice(product, selectedVariant || {}) : 0;
  if (product?.artworkConfig && selectedArtSize && selectedArtMaterial) {
    baseRate = selectedArtSize.basePrice * selectedArtMaterial.priceMultiplier;
  }
  const fabricRate = selectedFabric ? Number(selectedFabric.price) : 0;
  const ratePerMeter = isTurbanProduct && fabricRate > 0 ? fabricRate : baseRate;

  // Turban-specific fees
  const embroideryFee = (isTurbanProduct && embroideryEnabled && product?.turbanConfig?.embroidery?.price) ? Number(product.turbanConfig.embroidery.price) : 0;
  const giftWrapFee = (isTurbanProduct && giftWrapEnabled && product?.turbanConfig?.giftWrap?.price) ? Number(product.turbanConfig.giftWrap.price) : 0;

  // Art-specific gift wrap fee — completely separate from turban fees
  const artGiftWrapFee = (isArtProduct && artGiftWrapEnabled && product?.artConfig?.giftWrap?.price) ? Number(product.artConfig.giftWrap.price) : 0;

  const turbanLength = isTurbanProduct ? (parseFloat(selectedVariant?.size) || 1) : 1;
  const unitPrice = ratePerMeter * turbanLength + embroideryFee + giftWrapFee + artGiftWrapFee;
  const finalCalculatedPrice = unitPrice * quantity;

  if (!product) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
              {isLoadingProduct ? (
                <h2 className="text-xl font-bold text-gray-800 mb-4">Loading product...</h2>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Product Not Found
                  </h2>
                  <button
                    onClick={() => navigate("/home")}
                    className="gradient-green text-white px-6 py-3 rounded-xl font-semibold">
                    Go Back Home
                  </button>
                </>
              )}
            </div>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  const reviewsSection = (
    <div id="reviews-section" className="border-t border-gray-200 pt-10">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
        Reviews for this item
      </h3>
      {productReviews && productReviews.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              {product.rating ? product.rating.toFixed(1) : "5.0"}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`text-lg ${i < Math.floor(product.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              ({productReviews.length} reviews)
            </span>
          </div>

          <div className="space-y-6">
            {productReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-sm ${i < Math.floor(review.rating) ? "text-gray-900 fill-gray-900" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(review.createdAt || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed mb-3">{review.comment}</p>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {review.user}
                  </span>
                </div>

                {review.vendorResponse && (
                  <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white">
                        {vendor?.storeName?.charAt(0) || "V"}
                      </div>
                      <span className="text-xs font-bold text-gray-900">
                        {vendor?.storeName || "Vendor"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.vendorResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      )}

      {/* Write Review */}
      {isAuthenticated && isMongoId(product?.id) && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          {eligibleDeliveredOrderId ? (
            <ReviewForm
              productId={product.id}
              onSubmit={handleSubmitReview}
            />
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-600">
              Reviews are available after product delivery.
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={true}>
        <div className="w-full pb-4 lg:pb-8 max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="hidden lg:flex px-6 pt-4 lg:pt-6 lg:px-8 items-center justify-start flex-wrap gap-1.5 text-sm md:text-base text-brand-muted font-sans">
            <Link to="/home" className="hover:text-[#F5A623] hover:underline transition-colors font-medium">
              Homepage
            </Link>
            {breadcrumbs.map((cat) => (
              <div key={cat.id || cat._id} className="flex items-center gap-1.5">
                <span className="text-brand-subtle font-light">›</span>
                <Link to={`/category/${cat.id || cat._id}`} className="hover:text-[#F5A623] hover:underline transition-colors font-medium">
                  {cat.name}
                </Link>
              </div>
            ))}
            <span className="text-brand-subtle font-light">›</span>
            <span className="text-brand-navy font-semibold truncate max-w-[150px] md:max-w-xs">
              {product.name}
            </span>
          </div>

          {/* Back Button */}
          <div className="hidden lg:block px-4 pt-2 lg:pt-4 lg:px-8 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                <FiArrowLeft className="text-xl" />
              </div>
              <span className="font-medium">Back</span>
            </button>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 lg:px-8 lg:items-start max-w-[1400px] mx-auto">
            {/* LEFT COLUMN: Image Gallery + Reviews (Spans 7 columns) */}
            <div className="lg:col-span-7 p-0 lg:p-0">
               {/* Gallery */}
               <div className="mb-8">
                  <ImageGallery images={productImages} productName={product.name} />
               </div>
               
               {/* Report to Etsy placeholder */}
               <div className="flex justify-end mb-12 text-sm text-gray-500 font-medium hover:underline cursor-pointer">
                 <FiFlag className="inline mr-2" /> Report this item to SikhStreet
               </div>

               {/* Reviews Section (Desktop Only) */}
               <div className="hidden lg:block">
                  {reviewsSection}
               </div>
               
               {/* Community Q&A (Desktop Only) */}
               <div className="hidden lg:block mt-12 max-w-4xl border-t border-gray-200 pt-10">
                 <ProductQA productId={product.id} />
               </div>
            </div>

            {/* RIGHT COLUMN: Info + Configuration (Spans 5 columns) */}
            <div className="lg:col-span-5 px-4 py-4 lg:p-0 lg:sticky lg:top-24 flex flex-col gap-5">
                {/* Scarcity */}
                {selectedAvailableStock < 10 && selectedAvailableStock > 0 && (
                   <p className="text-sm font-bold text-red-600">In {selectedAvailableStock + 3} baskets</p>
                )}
                
                {/* Price */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-gray-900">
                      {formatPrice(ratePerMeter)}
                    </span>
                    {isTurbanProduct && <span className="text-sm text-gray-500 font-normal">+ per meter</span>}
                  </div>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through font-medium">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">* Seller GST included (where applicable). Additional GST may be applied at checkout.</p>
                </div>

                {/* Title & Description */}
                <h1 className="text-lg lg:text-xl font-medium text-gray-900 leading-snug">
                  {product.name} - {product.description || "Premium quality Sikh artifact"}
                </h1>
                
                {/* Store Name & Rating */}
                <div className="flex items-center gap-2">
                  {vendor && (
                    <Link
                      to={`/seller/${vendor.id}`}
                      className="text-sm font-medium text-gray-900 hover:underline flex items-center gap-1 group"
                    >
                      <span>{vendor.storeName || vendor.name}</span>
                      {vendor.isVerified && (
                        <FiCheckCircle className="text-blue-500 text-xs" title="Verified Vendor" />
                      )}
                    </Link>
                  )}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 cursor-pointer">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`text-sm ${i < Math.floor(product.rating) ? "text-gray-900 fill-gray-900" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Configuration Dropdowns */}
                <div className="space-y-4 mt-2">
                  
                  {/* Length / Sizes Selector (Turbans Only) */}
                  {isTurbanProduct && (() => {
                    let sizes = product?.variants?.sizes || [];
                    if (sizes.length === 0 && Array.isArray(product?.variants?.attributes)) {
                      const sizeAttr = product.variants.attributes.find(
                        (a) => ["size", "length", "dimension"].includes(String(a.name || "").toLowerCase())
                      );
                      if (sizeAttr && Array.isArray(sizeAttr.values)) {
                        sizes = sizeAttr.values;
                      }
                    }
                    if (sizes.length === 0 && isTurbanProduct) {
                      sizes = ["5m", "5.5m", "6m", "6.5m", "7m", "7.5m", "8m"];
                    }
                    if (sizes.length === 0) return null;
                    return (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Length of Fabric</label>
                        <div className="relative">
                          <select
                            value={selectedVariant?.size || ""}
                            onChange={(e) => setSelectedVariant(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors cursor-pointer"
                          >
                            <option value="" disabled>Select an option</option>
                            {sizes.map((sizeVal) => (
                              <option key={sizeVal} value={sizeVal}>{sizeVal}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <FiChevronDown className="text-gray-600" />
                          </div>
                        </div>

                        {/* Custom Length Input Option */}
                        <div className="mt-2 flex items-center gap-3">
                          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Or Custom Length:</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0.5"
                              max="30"
                              step="0.1"
                              value={(() => {
                                const sizeStr = selectedVariant?.size || "";
                                const match = sizeStr.match(/^([\d.]+)/);
                                return match ? match[1] : "";
                              })()}
                              onChange={(e) => {
                                const valStr = e.target.value;
                                if (valStr === "") {
                                  setSelectedVariant(prev => ({ ...prev, size: "" }));
                                } else {
                                  setSelectedVariant(prev => ({ ...prev, size: `${valStr}m` }));
                                }
                              }}
                              className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                            />
                            <span className="text-xs text-gray-500 font-semibold">meters</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Fabric Selector */}
                  {isTurbanProduct && product?.turbanConfig?.fabric?.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-900">Fabric Type</label>
                      <div className="relative">
                        <select
                          value={selectedFabric?.type || ""}
                          onChange={(e) => {
                            const fabric = product.turbanConfig.fabric.find(f => f.type === e.target.value);
                            if (fabric) setSelectedFabric(fabric);
                          }}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors cursor-pointer"
                        >
                          <option value="" disabled>Select an option</option>
                          {product.turbanConfig.fabric.map((fabric) => (
                            <option key={fabric.type} value={fabric.type}>{fabric.type}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <FiChevronDown className="text-gray-600" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Color Selector (Turbans Only) */}
                  {isTurbanProduct && (() => {
                    let colors = product?.variants?.colors || [];
                    if (colors.length === 0 && Array.isArray(product?.variants?.attributes)) {
                      const colorAttr = product.variants.attributes.find(
                        (a) => String(a.name || "").toLowerCase() === "color"
                      );
                      if (colorAttr && Array.isArray(colorAttr.values)) {
                        colors = colorAttr.values;
                      }
                    }
                    if (colors.length === 0) return null;
                    return (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Color</label>
                        <div className="relative">
                          <select
                            value={selectedVariant?.color || ""}
                            onChange={(e) => setSelectedVariant(prev => ({ ...prev, color: e.target.value }))}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors cursor-pointer"
                          >
                            <option value="" disabled>Select an option</option>
                            {colors.map((colorName) => (
                              <option key={colorName} value={colorName}>{colorName}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <FiChevronDown className="text-gray-600" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                                    {/* Artwork Config UI */}
                  {product?.artworkConfig && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">
                          Size
                        </label>
                        <div className="relative">
                          <select
                            value={selectedArtSize?.label || ""}
                            onChange={(e) => {
                              const sz = product.artworkConfig.sizes.find(s => s.label === e.target.value);
                              setSelectedArtSize(sz);
                            }}
                            className="w-full appearance-none border border-brand-muted/30 rounded-xl px-4 py-3 bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-saffron/20 focus:border-brand-saffron transition-all shadow-sm"
                          >
                            <option value="" disabled>Select an option</option>
                            {product.artworkConfig.sizes.map((s, idx) => (
                              <option key={idx} value={s.label}>{s.label}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-dark">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-dark mb-1">
                          Stretched or Unstretched
                        </label>
                        <div className="relative">
                          <select
                            value={selectedArtMaterial?.label || ""}
                            onChange={(e) => {
                              const mat = product.artworkConfig.materials.find(m => m.label === e.target.value);
                              setSelectedArtMaterial(mat);
                            }}
                            className="w-full appearance-none border border-brand-muted/30 rounded-xl px-4 py-3 bg-white text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-saffron/20 focus:border-brand-saffron transition-all shadow-sm"
                          >
                            <option value="" disabled>Select an option</option>
                            {product.artworkConfig.materials.map((m, idx) => (
                              <option key={idx} value={m.label}>
                                {m.label} ({formatPrice((selectedArtSize?.basePrice || 0) * m.priceMultiplier)})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-dark">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

{/* General Variants Selector for Non-Turban Products */}
                  {!isTurbanProduct && product.variants && (
                    <div className="mb-2">
                      <VariantSelector
                        variants={product.variants}
                        onVariantChange={setSelectedVariant}
                        currentPrice={product.price}
                        isKada={isKada}
                        useDropdowns={true}
                      />
                    </div>
                  )}

                  {/* Quantity Selector Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Quantity</label>
                    <div className="relative">
                      <select
                        value={quantity}
                        onChange={handleQuantityInput}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white appearance-none focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors cursor-pointer"
                      >
                        {Array.from({ length: Math.min(10, selectedAvailableStock || 10) }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <FiChevronDown className="text-gray-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Price breakdown */}
                  {finalCalculatedPrice > 0 && (
                    <div className="py-2 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        Total: {formatPrice(finalCalculatedPrice)}
                      </p>
                    </div>
                  )}

                  {/* Add-ons Configuration */}
                  {isTurbanProduct && (product?.turbanConfig?.embroidery?.enabled || product?.turbanConfig?.giftWrap?.enabled) && (
                    <div className="space-y-2.5 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Add-ons</p>
                      <div className="space-y-3">
                        {product.turbanConfig.embroidery?.enabled && (
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-normal text-gray-700">
                              <input
                                type="checkbox"
                                checked={embroideryEnabled}
                                onChange={(e) => setEmbroideryEnabled(e.target.checked)}
                                className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                              />
                              <span>Embroidery (+{formatPrice(product.turbanConfig.embroidery.price)})</span>
                            </label>
                            {embroideryEnabled && (
                              <input
                                type="text"
                                value={embroideryDemand}
                                onChange={(e) => setEmbroideryDemand(e.target.value)}
                                placeholder="Enter custom embroidery demand"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                              />
                            )}
                          </div>
                        )}
                        {product.turbanConfig.giftWrap?.enabled && (
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-normal text-gray-700">
                              <input
                                type="checkbox"
                                checked={giftWrapEnabled}
                                onChange={(e) => setGiftWrapEnabled(e.target.checked)}
                                className="w-4 h-4 text-gray-900 rounded border-gray-300 focus:ring-gray-900"
                              />
                              <span>Gift Packaging (+{formatPrice(product.turbanConfig.giftWrap.price)})</span>
                            </label>
                            {giftWrapEnabled && (
                              <input
                                type="text"
                                value={giftWrapDemand}
                                onChange={(e) => setGiftWrapDemand(e.target.value)}
                                placeholder="Enter gift note or packaging demand"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Buy Buttons */}
                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(true)}
                      disabled={selectedAvailableStock <= 0}
                      className="w-full py-3.5 rounded-full font-bold text-black bg-white border-2 border-black hover:bg-[#F5A623] hover:text-black hover:border-[#F5A623] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      Buy it now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(false)}
                      disabled={selectedAvailableStock <= 0}
                      className="w-full py-3.5 rounded-full font-bold text-white bg-black hover:bg-[#F5A623] hover:text-black transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to basket
                    </button>
                    <button
                      type="button"
                      onClick={handleFavorite}
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm font-semibold text-black hover:bg-[#F5A623] hover:text-black rounded-full transition-colors mt-2"
                    >
                      <FiHeart className={`text-lg ${isFavorite ? "fill-[#F5A623] text-[#F5A623]" : ""}`} />
                      {isFavorite ? "Remove from collection" : "Add to collection"}
                    </button>
                  </div>

                  {/* Accordions */}
                  <div className="border-t border-gray-200 mt-6 pt-2 divide-y divide-gray-200">
                    <details className="group" open>
                      <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-bold text-gray-900 outline-none">
                        Item details
                        <span className="transition group-open:rotate-180">
                          <FiChevronDown className="text-xl" />
                        </span>
                      </summary>
                      <div className="pb-4 space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-gray-900">Highlights</p>
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {vendor && (
                              <li>Made by <strong>{vendor.storeName || vendor.name}</strong></li>
                            )}
                            {product.specifications?.map((spec, idx) => (
                              <li key={idx}>{spec.name}: {spec.value}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {isBookProduct ? (
                          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex w-max border-r border-t-0">
                              <h3 className="text-teal-700 font-bold tracking-wide italic">SYNOPSIS</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-8">
                              <div className="space-y-5 text-gray-600 text-sm">
                                <p className="leading-relaxed">
                                  {product.bookConfig?.synopsis || product.description || "This book is a comprehensive introduction to the Sikh faith. Ideal for those with little knowledge of the religion, it will give you a clear understanding of what Sikh's believe, and how they practise their faith. Covering all aspects, from the history of Sikhism, to Sikh ethics, to the practicalities of living a Sikh life, learn what it means to be Sikh today."}
                                </p>
                                
                                {product.bookConfig?.sections ? product.bookConfig.sections.map((section, idx) => (
                                  <div key={idx}>
                                    <h4 className="text-gray-500 uppercase tracking-widest text-xs mb-1">{section.title}</h4>
                                    <p className="leading-relaxed">{section.content}</p>
                                  </div>
                                )) : (
                                  <>
                                    <div>
                                      <h4 className="text-gray-500 uppercase tracking-widest text-xs mb-1">NOT GOT MUCH TIME?</h4>
                                      <p className="leading-relaxed">One, five and ten-minute introductions to key principles to get you started.</p>
                                    </div>
                                    <div>
                                      <h4 className="text-gray-500 uppercase tracking-widest text-xs mb-1">AUTHOR INSIGHTS</h4>
                                      <p className="leading-relaxed">Lots of instant help with common problems and quick tips for success, based on the author's many years of experience.</p>
                                    </div>
                                    <div>
                                      <h4 className="text-gray-500 uppercase tracking-widest text-xs mb-1">TEST YOURSELF</h4>
                                      <p className="leading-relaxed">Tests in the book and online to keep track of your progress.</p>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="border-t border-gray-200 pt-6 space-y-4">
                                <h4 className="text-gray-800 font-serif text-lg border-b border-gray-200 pb-2">Publisher information</h4>
                                <ul className="text-sm text-gray-600 space-y-2 italic">
                                  <li>Publisher: {product.bookConfig?.publisher || "John Murray Press"}</li>
                                  <li>ISBN: {product.bookConfig?.isbn || "9781444105100"}</li>
                                  <li>Number of pages: {product.bookConfig?.pages || "272"}</li>
                                  <li>Dimensions: {product.bookConfig?.dimensions || "196 x 128 x 18 mm"}</li>
                                  <li>Weight: {product.bookConfig?.weight || "220 g"}</li>
                                  <li>Language: {product.bookConfig?.language || "English"}</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {product.description}
                        </p>
                        )}

                      </div>
                    </details>
                    
                    {vendor && (vendor.storePolicies || vendor.shippingPolicy || vendor.refundPolicy) && (
                      <details className="group">
                        <summary className="flex items-center justify-between py-4 cursor-pointer list-none font-bold text-gray-900 outline-none">
                          Delivery and return policies
                          <span className="transition group-open:rotate-180">
                            <FiChevronDown className="text-xl" />
                          </span>
                        </summary>
                        <div className="pb-4 space-y-4">
                          {vendor.shippingPolicy && (
                            <div className="text-sm text-gray-700">
                              <p className="font-semibold mb-1">Shipping Information</p>
                              <p className="whitespace-pre-line text-xs text-gray-600">{vendor.shippingPolicy}</p>
                            </div>
                          )}
                          {vendor.refundPolicy && (
                            <div className="text-sm text-gray-700">
                              <p className="font-semibold mb-1">Returns & Exchanges</p>
                              <p className="whitespace-pre-line text-xs text-gray-600">{vendor.refundPolicy}</p>
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>

                  {/* Reviews & QA (Mobile Only) */}
                  <div className="block lg:hidden mt-8 space-y-8">
                    {reviewsSection}
                    <div className="border-t border-gray-200 pt-8">
                      <ProductQA productId={product.id} />
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Similar Products (Outside the grid to span full-width) */}
          {similarProducts.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-10 px-4 lg:px-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                You May Also Like
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {similarProducts.map((similarProduct) => (
                  <ProductCard
                    key={similarProduct.id}
                    product={similarProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </MobileLayout>
    </PageTransition>
  );
};

export default MobileProductDetail;
