import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useCartOrder} from 'container/CartOrderContext';
import {useAuth} from 'container/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const {cartItems, cartSummary, isLoading, shippingInfo, updateShippingInfo, processOrder} = useCartOrder();
    const {isAuthenticated, user} = useAuth();

    const [activeStep, setActiveStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [processingOrder, setProcessingOrder] = useState(false);

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
                navigate('/account/login', {state: {from: '/cart/checkout'}});
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
        }
    }, [shippingInfo, user]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmitShipping = (e) => {
        e.preventDefault();
        updateShippingInfo(formData);
        setActiveStep(2);
    };

    const handlePlaceOrder = async () => {
        setProcessingOrder(true);
        try {
            const order = await processOrder(paymentMethod);
            navigate(`/cart/confirmation/${order.id}`);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        } finally {
            setProcessingOrder(false);
        }
    };

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

    return (
        <div className="bg-[#faf7f2] min-h-screen py-16">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <nav className="flex text-sm">
                        <Link to="/" className="text-amber-800 hover:text-amber-600 transition">
                            Trang chủ
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link to="/cart" className="text-amber-800 hover:text-amber-600 transition">
                            Giỏ hàng
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-amber-600 font-medium">Thanh toán</span>
                    </nav>
                </div>

                <h1 className="text-3xl font-serif font-medium text-gray-800 mb-8 text-center">Thanh toán</h1>

                {/* Checkout steps indicator */}
                <div className="flex items-center justify-center mb-10">
                    <div className={`flex items-center ${activeStep >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
              ${activeStep >= 1 ? 'bg-amber-50 border-2 border-amber-600' : 'bg-gray-100 border-2 border-gray-300'}`}
                        >
                            1
                        </div>
                        <span>Thông tin giao hàng</span>
                    </div>
                    <div className={`w-16 h-0.5 mx-2 ${activeStep >= 2 ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center ${activeStep >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
              ${activeStep >= 2 ? 'bg-amber-50 border-2 border-amber-600' : 'bg-gray-100 border-2 border-gray-300'}`}
                        >
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Số điện thoại
                                            </label>
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
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                placeholder="Số nhà, đường..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tỉnh/Thành phố
                                            </label>
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
                                                <option value="Quận 4">Quận 4</option>
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
                                                <option value="Phường Cầu Kho">Phường Cầu Kho</option>
                                                <option value="Phường Cầu Ông Lãnh">Phường Cầu Ông Lãnh</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ghi chú (tùy chọn)
                                            </label>
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
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
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

                                    <div className="space-y-4 mb-6">
                                        {/* COD Option */}
                                        <div
                                            className={`border rounded-md p-4 cursor-pointer ${
                                                paymentMethod === 'COD'
                                                    ? 'border-amber-500 bg-amber-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => setPaymentMethod('COD')}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                        paymentMethod === 'COD' ? 'border-amber-600' : 'border-gray-400'
                                                    }`}
                                                >
                                                    {paymentMethod === 'COD' && (
                                                        <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                                                </div>
                                            </div>
                                            {paymentMethod === 'COD' && (
                                                <p className="text-sm text-gray-600 mt-2 ml-8">
                                                    Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.
                                                </p>
                                            )}
                                        </div>

                                        {/* MoMo Option */}
                                        <div
                                            className={`border rounded-md p-4 cursor-pointer ${
                                                paymentMethod === 'MOMO'
                                                    ? 'border-amber-500 bg-amber-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => setPaymentMethod('MOMO')}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                        paymentMethod === 'MOMO' ? 'border-amber-600' : 'border-gray-400'
                                                    }`}
                                                >
                                                    {paymentMethod === 'MOMO' && (
                                                        <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex items-center">
                                                    <span className="font-medium">Thanh toán bằng MoMo</span>
                                                    <img src="/images/momo-logo.png" alt="MoMo" className="h-6 ml-2" />
                                                </div>
                                            </div>
                                            {paymentMethod === 'MOMO' && (
                                                <p className="text-sm text-gray-600 mt-2 ml-8">
                                                    Thanh toán trực tuyến qua ví MoMo. Bạn sẽ được chuyển đến trang thanh toán
                                                    của MoMo sau khi đặt hàng.
                                                </p>
                                            )}
                                        </div>

                                        {/* Bank Transfer Option */}
                                        <div
                                            className={`border rounded-md p-4 cursor-pointer ${
                                                paymentMethod === 'BANK'
                                                    ? 'border-amber-500 bg-amber-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => setPaymentMethod('BANK')}
                                        >
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                        paymentMethod === 'BANK' ? 'border-amber-600' : 'border-gray-400'
                                                    }`}
                                                >
                                                    {paymentMethod === 'BANK' && (
                                                        <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <span className="font-medium">Chuyển khoản ngân hàng</span>
                                                </div>
                                            </div>
                                            {paymentMethod === 'BANK' && (
                                                <div className="text-sm text-gray-600 mt-2 ml-8">
                                                    <p>Vui lòng sử dụng thông tin sau để chuyển khoản:</p>
                                                    <ul className="mt-2 space-y-1">
                                                        <li>Ngân hàng: Vietcombank</li>
                                                        <li>Số tài khoản: 1234567890</li>
                                                        <li>Chủ tài khoản: CÔNG TY TRANG SỨC TINH TÚ</li>
                                                        <li>Nội dung: [Mã đơn hàng] - [Tên của bạn]</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <motion.button
                                            whileHover={{scale: 1.02}}
                                            whileTap={{scale: 0.98}}
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
                                {cartItems.map((item) => (
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
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                                {item.productName}
                                            </h3>
                                            <div className="flex justify-between mt-1 text-sm text-gray-600">
                                                <span>
                                                    {item.quantity} x {formatPrice(item.price)}
                                                </span>
                                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cost summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính ({cartSummary.totalItems} sản phẩm)</span>
                                    <span className="font-medium text-gray-800">{formatPrice(cartSummary.subtotal)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    {cartSummary.shippingFee > 0 ? (
                                        <span className="font-medium text-gray-800">
                                            {formatPrice(cartSummary.shippingFee)}
                                        </span>
                                    ) : (
                                        <span className="font-medium text-green-600">Miễn phí</span>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thuế (10%)</span>
                                    <span className="font-medium text-gray-800">{formatPrice(cartSummary.tax)}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-3 mt-4">
                                    <div className="flex justify-between">
                                        <span className="font-serif font-medium text-gray-800">Tổng tiền</span>
                                        <span className="font-serif font-semibold text-xl text-amber-800">
                                            {formatPrice(cartSummary.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
