import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartOrder } from 'container/CartOrderContext';
import { useAuth } from 'container/AuthContext';
import cartOrderService from 'container/cartOrderService'; // Thêm import này
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import LocationPicker from '../components/LocationPicker';
import MomoQRPayment from '../components/MomoQRPayment';

// Hàm tính phí vận chuyển dựa trên khoảng cách
const calculateShipping = (distanceKm) => {
  if (!distanceKm || isNaN(distanceKm)) return 30000;
  
  if (distanceKm <= 5) return 30000;
  if (distanceKm <= 10) return 40000;
  if (distanceKm <= 15) return 50000;
  return 50000 + Math.ceil((distanceKm - 15) / 5) * 10000;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    cartSummary, 
    isLoading, 
    shippingInfo, 
    updateShippingInfo, 
    processOrder 
  } = useCartOrder();
  const { isAuthenticated, user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // State cho MOMO QR payment
  const [showMomoQR, setShowMomoQR] = useState(false);
  const [momoQRData, setMomoQRData] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  
  // State cho tính phí vận chuyển
  const [routeInfo, setRouteInfo] = useState(null);
  const [shippingCost, setShippingCost] = useState(30000);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    notes: '',
  });

  // Kiểm tra xác thực và giỏ hàng có sản phẩm
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/account/login', { state: { from: '/cart/checkout' } });
      } else if (cartItems.length === 0) {
        navigate('/cart');
      }
    }
  }, [isAuthenticated, cartItems, isLoading, navigate]);

  // Load shipping info từ context nếu có
  useEffect(() => {
    if (shippingInfo) {
      setFormData({
        fullName: shippingInfo.fullName || user?.name || '',
        phone: shippingInfo.phone || '',
        address: shippingInfo.address || '',
        city: shippingInfo.city || 'Hồ Chí Minh',
        district: shippingInfo.district || 'Quận 1',
        ward: shippingInfo.ward || 'Phường Bến Nghé',
        notes: shippingInfo.notes || '',
      });
      
      if (shippingInfo.routeInfo) {
        setRouteInfo(shippingInfo.routeInfo);
        setShippingCost(calculateShipping(shippingInfo.routeInfo.distance));
      }
    }
  }, [shippingInfo, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    
    // Lưu shipping info vào context
    updateShippingInfo({
      ...formData,
      routeInfo: routeInfo
    });
    
    setActiveStep(2);
  };

  const handlePlaceOrder = async () => {
    setProcessingOrder(true);
    
    try {
      // Nếu chọn MOMO QR, xử lý đơn hàng trước rồi hiển thị QR
      if (paymentMethod === 'MOMO_QR') {
        const order = await processOrder(paymentMethod);
        
        // Tạo mã QR MOMO
        try {
          // SỬA LỖI: Sử dụng cartOrderService trực tiếp thay vì useCartOrder()
          const qrData = await cartOrderService.createMomoQRPayment(
            order.id,
            order.totalAmount || cartSummary.totalAmount,
            `Thanh toán đơn hàng #${order.id}`
          );
          
          setMomoQRData({
            qrImageData: qrData.data.payUrl,
            orderId: qrData.data.orderId,
            orderInfo: `Thanh toán đơn hàng #${order.id}`
          });
          
          // Hiển thị modal QR
          setShowMomoQR(true);
        } catch (qrError) {
          console.error('Error generating QR code:', qrError);
          alert('Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại sau.');
          navigate('/cart/orders');
        }
      } else {
        // Với các phương thức thanh toán khác, đơn giản là xử lý đơn hàng
        const order = await processOrder(paymentMethod);
        navigate(`/cart/confirmation/${order.id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setProcessingOrder(false);
    }
  };

  // Xử lý xác minh thanh toán MOMO QR
  const handleVerifyMomoPayment = async () => {
    if (!momoQRData || !momoQRData.orderId) return;
    
    setVerifyingPayment(true);
    
    try {
      // SỬA LỖI: Sử dụng cartOrderService trực tiếp thay vì useCartOrder()
      const result = await cartOrderService.confirmPaymentTransaction(momoQRData.orderId);
      
      if (result.success && result.data?.resultCode === 0) {
        alert('Thanh toán thành công! Đơn hàng của bạn đang được xử lý.');
        setShowMomoQR(false);
        navigate('/cart/orders');
      } else {
        alert('Chưa nhận được thanh toán. Vui lòng thử lại sau hoặc chọn phương thức thanh toán khác.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Có lỗi xảy ra khi kiểm tra thanh toán. Vui lòng thử lại sau.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Xử lý lựa chọn vị trí
  const handleLocationSelected = (location, address, routeInfo) => {
    setFormData({
      ...formData,
      address: address
    });
    
    setRouteInfo(routeInfo);
    
    // Cập nhật phí vận chuyển dựa trên khoảng cách
    if (routeInfo && routeInfo.distance) {
      setShippingCost(calculateShipping(routeInfo.distance));
    }
  };

  // Format tiền VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
      </div>
    );
  }

  // Tính toán tổng tiền với phí vận chuyển mới
  const subtotal = cartSummary.subtotal;
  const tax = cartSummary.tax;
  const totalAmount = subtotal + tax + shippingCost;

  return (
    <div className="bg-[#faf7f2] min-h-screen py-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex text-sm">
            <Link to="/" className="text-amber-800 hover:text-amber-600 transition">Trang chủ</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/cart" className="text-amber-800 hover:text-amber-600 transition">Giỏ hàng</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-amber-600 font-medium">Thanh toán</span>
          </nav>
        </div>

        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-8 text-center">Thanh toán</h1>

        {/* Checkout steps indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className={`flex items-center ${activeStep >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
              ${activeStep >= 1 ? 'bg-amber-50 border-2 border-amber-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              1
            </div>
            <span>Thông tin giao hàng</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${activeStep >= 2 ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${activeStep >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
              ${activeStep >= 2 ? 'bg-amber-50 border-2 border-amber-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
              2
            </div>
            <span>Phương thức thanh toán</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Step 1: Shipping Information */}
              {activeStep === 1 && (
                <form onSubmit={handleSubmitShipping} className="p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Thông tin giao hàng</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="0901234567"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <div className="flex">
                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Số nhà, đường..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowLocationPicker(true)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-r-md flex items-center"
                        >
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          Chọn địa chỉ
                        </button>
                      </div>
                      
                      {/* Hiển thị thông tin tuyến đường nếu có */}
                      {routeInfo && (
                        <div className="mt-2 text-sm bg-amber-50 p-2 rounded-md border border-amber-200">
                          <div className="flex items-center">
                            <i className="fas fa-route text-amber-600 mr-2"></i>
                            <span>
                              <span className="font-medium">Khoảng cách giao hàng:</span> {routeInfo.distance.toFixed(1)} km
                              <span className="mx-2 text-gray-400">|</span>
                              <span className="font-medium">Thời gian dự kiến:</span> {routeInfo.duration.toFixed(0)} phút
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                      <select
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                      <select
                        name="district"
                        required
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="Quận 1">Quận 1</option>
                        <option value="Quận 2">Quận 2</option>
                        <option value="Quận 3">Quận 3</option>
                        <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                        <option value="Quận Gò Vấp">Quận Gò Vấp</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <select
                        name="ward"
                        required
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                        <option value="Phường Bến Thành">Phường Bến Thành</option>
                        <option value="Phường Đa Kao">Phường Đa Kao</option>
                        <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Thông tin thêm về đơn hàng của bạn..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md"
                    >
                      Tiếp tục
                    </motion.button>
                  </div>
                </form>
              )}
              
              {/* Step 2: Payment Method */}
              {activeStep === 2 && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Phương thức thanh toán</h2>
                    <button 
                      onClick={() => setActiveStep(1)} 
                      className="text-sm text-amber-600 hover:text-amber-800 flex items-center"
                    >
                      <i className="fas fa-arrow-left mr-1"></i> Quay lại
                    </button>
                  </div>
                  
                  {/* Payment Method Selector */}
                  <PaymentMethodSelector 
                    selectedMethod={paymentMethod}
                    onSelect={setPaymentMethod}
                  />
                  
                  <div className="flex justify-end mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={processingOrder}
                      className="px-6 py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 transition-colors shadow-md flex items-center"
                    >
                      {processingOrder ? (
                        <>
                          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          Đặt hàng
                          <i className="fas fa-arrow-right ml-2"></i>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-serif font-medium text-gray-800 mb-4 pb-4 border-b border-gray-200">
                Tóm tắt đơn hàng
              </h2>
              
              {/* Product summary */}
              <div className="max-h-60 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.cartItemId} className="flex py-2 border-b border-gray-100">
                    <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.productName}</h3>
                      <div className="flex justify-between mt-1 text-sm text-gray-600">
                        <span>{item.quantity} x {formatPrice(item.price)}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cost summary with updated shipping cost */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính ({cartSummary.totalItems} sản phẩm)</span>
                  <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  {shippingCost > 0 ? (
                    <span className="font-medium text-gray-800">{formatPrice(shippingCost)}</span>
                  ) : (
                    <span className="font-medium text-green-600">Miễn phí</span>
                  )}
                </div>
                
                {routeInfo && (
                  <div className="text-xs text-gray-500 italic text-right">
                    Dựa trên khoảng cách: {routeInfo.distance.toFixed(1)} km
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuế (10%)</span>
                  <span className="font-medium text-gray-800">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between">
                    <span className="font-serif font-medium text-gray-800">Tổng tiền</span>
                    <span className="font-serif font-semibold text-xl text-amber-800">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LocationPicker Modal */}
      <LocationPicker 
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleLocationSelected}
        initialLocation={{ lat: 10.7769, lng: 106.7009 }}
      />
      
      {/* MOMO QR Payment Modal */}
      <MomoQRPayment
        visible={showMomoQR}
        orderInfo={momoQRData}
        qrImageData={momoQRData?.qrImageData}
        amount={totalAmount}
        onClose={() => {
          setShowMomoQR(false);
          navigate('/cart/orders');
        }}
        onCheckStatus={handleVerifyMomoPayment}
        isVerifying={verifyingPayment}
      />
    </div>
  );
};

export default Checkout;