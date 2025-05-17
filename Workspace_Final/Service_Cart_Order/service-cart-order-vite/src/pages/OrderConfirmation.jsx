import {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {useCartOrder} from 'container/CartOrderContext';

const OrderConfirmation = () => {
    const {orderId} = useParams();
    const {getOrderById} = useCartOrder();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await getOrderById(parseInt(orderId));
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, getOrderById]);

    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf7f2] min-h-screen py-16">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-3xl text-green-600"></i>
                        </div>
                        <h1 className="text-3xl font-serif font-medium text-gray-800 mb-2">Cảm ơn bạn đã đặt hàng!</h1>
                        <p className="text-gray-600">
                            Đơn hàng #{orderId} của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn ngay khi đơn hàng được
                            giao cho đơn vị vận chuyển.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-medium text-gray-800 mb-4 pb-3 border-b border-gray-200">
                            Chi tiết đơn hàng
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Thông tin đơn hàng:</h3>
                                <ul className="text-gray-800 space-y-1">
                                    <li>
                                        <span className="font-medium">Mã đơn hàng:</span> #{orderId}
                                    </li>
                                    <li>
                                        <span className="font-medium">Ngày đặt:</span>{' '}
                                        {formatDate(order?.createdAt || new Date())}
                                    </li>
                                    <li>
                                        <span className="font-medium">Trạng thái:</span>{' '}
                                        <span className="text-green-600">Đã xác nhận</span>
                                    </li>
                                    <li>
                                        <span className="font-medium">Thanh toán:</span>{' '}
                                        {order?.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Địa chỉ giao hàng:</h3>
                                <p className="text-gray-800">{order?.address}</p>
                            </div>
                        </div>

                        <h3 className="text-sm font-medium text-gray-600 mb-2">Sản phẩm:</h3>
                        <div className="space-y-3 mb-6">
                            {order?.orderDetails?.map((item) => (
                                <div key={item.id} className="flex items-center border-b border-gray-100 pb-3">
                                    <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                                        {item.product?.imageSet?.[0]?.image_url ? (
                                            <img
                                                src={item.product.imageSet[0].image_url}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <i className="fas fa-image"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h4 className="text-gray-800">{item.product?.name || 'Sản phẩm'}</h4>
                                        <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                                    </div>
                                    <span className="font-medium text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Tạm tính:</span>
                                <span className="text-gray-800">
                                    {formatPrice(
                                        order?.orderDetails?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Phí vận chuyển:</span>
                                <span className="text-gray-800">{formatPrice(30000)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-100">
                                <span className="text-gray-800">Tổng cộng:</span>
                                <span className="text-amber-800">
                                    {formatPrice(
                                        (order?.orderDetails?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0) +
                                            30000
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                            <Link
                                to="/cart/orders"
                                className="px-6 py-3 bg-amber-600 text-white font-medium rounded-md inline-block text-center hover:bg-amber-700 transition-colors shadow-md"
                            >
                                Xem đơn hàng của tôi
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                            <Link
                                to="/catalog"
                                className="px-6 py-3 border border-amber-600 text-amber-600 font-medium rounded-md inline-block text-center hover:bg-amber-50 transition-colors"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
