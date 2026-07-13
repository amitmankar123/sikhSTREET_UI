import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiMapPin, FiCreditCard, FiRotateCw, FiArrowLeft, FiShoppingBag, FiX, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MobileLayout from "../components/Layout/MobileLayout";
import { useOrderStore } from '../../../shared/store/orderStore';
import { useChatStore } from '../../../shared/store/chatStore';
import { useCartStore } from '../../../shared/store/useStore';
import { formatPrice } from '../../../shared/utils/helpers';
import { formatVariantLabel, getVariantSignature } from '../../../shared/utils/variant';
import toast from 'react-hot-toast';
import PageTransition from '../../../shared/components/PageTransition';
import Badge from '../../../shared/components/Badge';
import LazyImage from '../../../shared/components/LazyImage';

const MobileOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { cancelOrder, fetchOrderById, requestReturn } = useOrderStore();
  const { addItem } = useCartStore();
  const { getOrCreateThread } = useChatStore();
  const order = useOrderStore((state) =>
    state.orders.find((o) => String(o.id) === String(orderId))
  );
  const [isResolving, setIsResolving] = useState(!order);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Product issue');
  const [returnVendorId, setReturnVendorId] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  const handleChatWithSeller = async (vendorId, vendorName) => {
    try {
      toast.loading("Opening conversation...", { id: "chat-loading" });
      await getOrCreateThread(order.id, vendorId);
      toast.success(`Connected with ${vendorName}`, { id: "chat-loading" });
      navigate("/chat");
    } catch (err) {
      toast.error(err?.message || "Failed to start chat with seller.", { id: "chat-loading" });
    }
  };
  const shippingAddress = order?.shippingAddress || {};
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  const vendorOptions = Array.isArray(order?.vendorItems)
    ? order.vendorItems
      .map((group) => ({
        id: String(group?.vendorId || ''),
        name: group?.vendorName || 'Vendor',
      }))
      .filter((group) => group.id)
    : [];

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (orderId) {
        await fetchOrderById(orderId, true);
      }
      if (mounted) setIsResolving(false);
    })();
    return () => {
      mounted = false;
    };
  }, [orderId, fetchOrderById]);

  useEffect(() => {
    if (!isResolving && !order) {
      navigate('/orders');
    }
  }, [isResolving, order, navigate]);

  if (isResolving) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <p className="text-gray-600">Loading order...</p>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition>
        <MobileLayout showBottomNav={false} showCartBar={false}>
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Not Found</h2>
              <button
                onClick={() => navigate('/orders')}
                className="gradient-green text-white px-6 py-3 rounded-xl font-semibold"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </MobileLayout>
      </PageTransition>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        variant: item.variant || undefined,
      });
    });
    toast.success('Items added to cart!');
    navigate('/checkout');
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      if (['pending', 'processing'].includes(order.status)) {
        try {
          await cancelOrder(order.id);
          toast.success('Order cancelled successfully');
          navigate('/orders');
        } catch (error) {
          toast.error(error?.message || 'Failed to cancel order');
        }
      } else {
        toast.error('This order cannot be cancelled');
      }
    }
  };

  const openReturnModal = () => {
    if (order.status !== 'delivered') {
      toast.error('Return can only be requested for delivered orders');
      return;
    }
    if (vendorOptions.length === 1) {
      setReturnVendorId(vendorOptions[0].id);
    } else if (!vendorOptions.find((v) => v.id === returnVendorId)) {
      setReturnVendorId(vendorOptions[0]?.id || '');
    }
    setShowReturnModal(true);
  };

  const handleRequestReturn = async () => {
    if (isSubmittingReturn) return;

    const reason = String(returnReason || '').trim();
    if (reason.length < 5) {
      toast.error('Please enter a valid return reason');
      return;
    }

    if (vendorOptions.length > 1 && !returnVendorId) {
      toast.error('Please select a vendor for return request');
      return;
    }

    try {
      setIsSubmittingReturn(true);
      await requestReturn(order.id, {
        reason,
        ...(returnVendorId ? { vendorId: returnVendorId } : {}),
      });
      toast.success('Return request submitted successfully');
      setShowReturnModal(false);
      setReturnReason('Product issue');
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to submit return request');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={true}>
          <div className="w-full pb-24 min-h-screen" style={{ background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF3E4 60%, #FBEBD8 100%)' }}>
            {/* Header */}
            <div className="px-4 py-4 bg-[#fff8f5] border-b border-[#e9d7cb] sticky top-0 z-30" style={{ boxShadow: '0 1px 8px rgba(44,26,14,0.06)' }}>
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-[#fdeade] rounded-full transition-colors"
                >
                  <FiArrowLeft className="text-xl text-[#231a13]" />
                </button>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-[#231a13]" style={{ fontFamily: "'Lora', Georgia, serif" }}>Order Details</h1>
                  <p className="text-sm text-[#554336]">Order #{order.id}</p>
                </div>
                <Badge variant={order.status}>{order.status.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="px-4 py-4 space-y-4">
              {/* Order Items */}
              <div className="bg-[#fff8f5] border border-[#e9d7cb] rounded-2xl p-4 shadow-sm">
                <h2 className="text-base font-bold text-[#231a13] mb-4" style={{ fontFamily: "'Lora', Georgia, serif" }}>Order Items</h2>
                {order.vendorItems && order.vendorItems.length > 0 ? (
                  <div className="space-y-4">
                    {order.vendorItems.map((vendorGroup) => (
                      <div key={vendorGroup.vendorId} className="space-y-2">
                        {/* Vendor Header */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#fdeade] to-[#fff8f5] rounded-lg border border-[#e9d7cb]/60">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#8d4b00] to-[#733c00] flex items-center justify-center flex-shrink-0">
                            <FiShoppingBag className="text-white text-[10px]" />
                          </div>
                          <span className="text-sm font-bold text-[#8d4b00] flex-1">
                            {vendorGroup.vendorName}
                          </span>
                          {vendorGroup.status && (
                            <Badge variant={vendorGroup.status} className="text-[10px] py-0.5 px-2 font-bold capitalize">
                              {vendorGroup.status}
                            </Badge>
                          )}
                          <button
                            onClick={() => handleChatWithSeller(vendorGroup.vendorId, vendorGroup.vendorName)}
                            className="p-1 px-2.5 bg-white text-[#8d4b00] hover:text-[#733c00] hover:bg-[#fdeade]/50 rounded-md border border-[#e9d7cb]/80 flex items-center gap-1.5 transition-colors text-[11px] font-bold mr-1 shadow-sm"
                          >
                            <FiMessageSquare className="text-xs" />
                            <span>Chat</span>
                          </button>
                          <span className="text-xs font-semibold text-[#8d4b00] bg-white px-2 py-0.5 rounded-md border border-[#e9d7cb]/40">
                            {formatPrice(vendorGroup.subtotal)}
                          </span>
                        </div>
                        {/* Vendor Items */}
                        <div className="space-y-2 pl-2">
                          {vendorGroup.items.map((item, itemIndex) => (
                            <div key={`${item.id}-${itemIndex}-${getVariantSignature(item?.variant || {})}`} className="flex items-center gap-3">
                              <Link to={`/product/${item.productId || item.id}`} className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#e9d7cb]/40 flex-shrink-0 hover:opacity-85 transition-opacity">
                                <LazyImage
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link to={`/product/${item.productId || item.id}`} className="font-semibold text-[#231a13] text-sm mb-1 hover:text-[#8d4b00] transition-colors block truncate">
                                  {item.name}
                                </Link>
                                <p className="text-xs text-[#554336]/85">
                                  {formatPrice(item.price)} x {item.quantity}
                                </p>
                                {formatVariantLabel(item?.variant) && (
                                  <p className="text-[11px] text-[#554336]/60">
                                    {formatVariantLabel(item?.variant)}
                                  </p>
                                )}
                                {order.status === 'delivered' && (
                                  <Link
                                    to={`/product/${item.productId || item.id}?write-review=true#reviews-section`}
                                    className="inline-block mt-1 text-xs font-bold text-[#8d4b00] hover:text-[#733c00] hover:underline"
                                  >
                                    Write a Review
                                  </Link>
                                )}
                              </div>
                              <p className="font-bold text-[#231a13] text-sm">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderItems.map((item, itemIndex) => (
                      <div key={`${item.id}-${itemIndex}-${getVariantSignature(item?.variant || {})}`} className="flex items-center gap-3">
                        <Link to={`/product/${item.productId || item.id}`} className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#e9d7cb]/40 flex-shrink-0 hover:opacity-85 transition-opacity">
                          <LazyImage
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.productId || item.id}`} className="font-semibold text-[#231a13] text-sm mb-1 hover:text-[#8d4b00] transition-colors block truncate">
                            {item.name}
                          </Link>
                          <p className="text-xs text-[#554336]/85">
                            {formatPrice(item.price)} x {item.quantity}
                          </p>
                          {formatVariantLabel(item?.variant) && (
                            <p className="text-[11px] text-[#554336]/60">
                              {formatVariantLabel(item?.variant)}
                            </p>
                          )}
                          {order.status === 'delivered' && (
                            <Link
                              to={`/product/${item.productId || item.id}?write-review=true#reviews-section`}
                              className="inline-block mt-1 text-xs font-bold text-[#8d4b00] hover:text-[#733c00] hover:underline"
                            >
                              Write a Review
                            </Link>
                          )}
                        </div>
                        <p className="font-bold text-[#231a13] text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-[#fff8f5] border border-[#e9d7cb] rounded-2xl p-4 shadow-sm">
                <h2 className="text-base font-bold text-[#231a13] mb-3 flex items-center gap-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                  <FiMapPin className="text-[#8d4b00]" />
                  Shipping Address
                </h2>
                <div className="text-sm text-[#554336] space-y-1">
                  <p className="font-semibold text-[#231a13]">{shippingAddress.name || 'N/A'}</p>
                  <p>{shippingAddress.address || 'N/A'}</p>
                  <p>
                    {shippingAddress.city || 'N/A'}, {shippingAddress.state || 'N/A'}{' '}
                    {shippingAddress.zipCode || 'N/A'}
                  </p>
                  <p>{shippingAddress.country || 'N/A'}</p>
                  <p className="mt-2">Phone: {shippingAddress.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-[#fff8f5] border border-[#e9d7cb] rounded-2xl p-4 shadow-sm">
                <h2 className="text-base font-bold text-[#231a13] mb-3 flex items-center gap-2" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                  <FiCreditCard className="text-[#8d4b00]" />
                  Payment Information
                </h2>
                <div className="text-sm text-[#554336] space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-[#231a13] capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span>Tracking Number:</span>
                      <span className="font-semibold text-[#231a13]">{order.trackingNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Order Date:</span>
                    <span className="font-semibold text-[#231a13]">{formatDate(order.date)}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#fff8f5] border border-[#e9d7cb] rounded-2xl p-4 shadow-sm">
                <h2 className="text-base font-bold text-[#231a13] mb-3" style={{ fontFamily: "'Lora', Georgia, serif" }}>Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#554336]/90">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-[#8d4b00] font-semibold">
                      <span>Discount</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#554336]/90">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-[#554336]/90">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#231a13] pt-2 border-t border-[#e9d7cb]">
                    <span>Total</span>
                    <span className="text-[#8d4b00]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {['pending', 'processing'].includes(order.status) && (
                  <button
                    onClick={handleCancel}
                    className="w-full py-3.5 bg-[#fce8e6] text-[#c5221f] rounded-xl font-bold hover:bg-[#f9d4d0] border border-[#c5221f]/20 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={handleReorder}
                  className="w-full py-3.5 bg-[#8d4b00] text-white rounded-xl font-bold text-base hover:bg-[#733c00] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <FiRotateCw className="text-lg" />
                  Reorder
                </button>
                {order.status === 'delivered' && (
                  <button
                    onClick={openReturnModal}
                    className="w-full py-3.5 bg-[#fff3e4] text-[#8d4b00] border border-[#e9d7cb]/60 rounded-xl font-bold hover:bg-[#fbebd8] transition-colors flex items-center justify-center gap-2"
                  >
                    <FiPackage className="text-lg" />
                    Request Return
                  </button>
                )}
                <button
                  onClick={() => navigate(`/track-order/${order.id}`)}
                  className="w-full py-3.5 bg-[#fff8f5] text-[#231a13] hover:bg-[#fdeade] rounded-xl font-bold border border-[#e9d7cb]/80 transition-colors flex items-center justify-center gap-2"
                >
                  <FiTruck className="text-lg" />
                  Track Order
                </button>
              </div>
            </div>
          </div>

          {showReturnModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center sm:justify-center"
              onClick={() => setShowReturnModal(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-md bg-[#fff8f5] border border-[#e9d7cb] rounded-t-2xl sm:rounded-2xl p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#231a13]" style={{ fontFamily: "'Lora', Georgia, serif" }}>Request Return</h3>
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className="p-2 rounded-full hover:bg-[#fdeade]"
                  >
                    <FiX className="text-gray-600" />
                  </button>
                </div>

                {vendorOptions.length > 1 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#554336] mb-2">
                      Select Vendor
                    </label>
                    <select
                      value={returnVendorId}
                      onChange={(e) => setReturnVendorId(e.target.value)}
                      className="w-full px-3 py-2.5 border-2 border-[#e9d7cb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8d4b00]/40 focus:border-[#8d4b00] text-base text-[#231a13] bg-[#fff8f5]"
                    >
                      <option value="">Choose vendor</option>
                      {vendorOptions.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#554336] mb-2">
                    Reason
                  </label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border-2 border-[#e9d7cb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8d4b00]/40 focus:border-[#8d4b00] text-base text-[#231a13] bg-[#fff8f5]"
                    placeholder="Describe the issue briefly"
                  />
                </div>

                <button
                  onClick={handleRequestReturn}
                  disabled={isSubmittingReturn}
                  className="w-full py-3.5 bg-[#8d4b00] text-white rounded-xl font-bold text-base hover:bg-[#733c00] transition-colors shadow-md disabled:opacity-70"
                >
                  {isSubmittingReturn ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </motion.div>
            </motion.div>
          )}
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileOrderDetail;




