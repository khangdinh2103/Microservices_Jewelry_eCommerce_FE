import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { cartItems, totalPrice, loading, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [removingItems, setRemovingItems] = useState<number[]>([]);

  const handleQuantityChange = async (cartItemID: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(cartItemID, newQuantity);
  };

  const handleRemoveItem = async (cartItemID: number) => {
    setRemovingItems([...removingItems, cartItemID]);
    await removeFromCart(cartItemID);
    setRemovingItems(removingItems.filter(id => id !== cartItemID));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

          {!isAuthenticated ? (
            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-lg text-center">
              <p className="text-yellow-700 mb-4">
                Vui lòng đăng nhập để xem giỏ hàng của bạn
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-700 mb-4">Giỏ hàng của bạn đang trống</p>
              <Link 
                to="/" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Danh sách sản phẩm */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h2 className="font-semibold text-lg">Sản phẩm</h2>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item.cartItemID} className="flex flex-col sm:flex-row p-4">
                        {/* Ảnh sản phẩm */}
                        <div className="sm:w-24 h-24 rounded-md overflow-hidden mb-4 sm:mb-0">
                          <img 
                            src={item.imageURL || 'https://via.placeholder.com/100'} 
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Thông tin sản phẩm */}
                        <div className="flex-grow sm:ml-4 flex flex-col justify-between">
                          <div>
                            <Link to={`/product/${item.productID}`} className="text-lg font-medium hover:text-blue-600">
                              {item.productName}
                            </Link>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 sm:mt-0">
                            <div className="flex items-center border border-gray-300 rounded w-24 mb-2 sm:mb-0">
                              <button 
                                className="px-2 py-1 text-gray-600"
                                onClick={() => handleQuantityChange(item.cartItemID, item.quantity - 1)}
                              >
                                -
                              </button>
                              <div className="flex-grow text-center border-x border-gray-300 py-1">
                                {item.quantity}
                              </div>
                              <button 
                                className="px-2 py-1 text-gray-600"
                                onClick={() => handleQuantityChange(item.cartItemID, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="font-semibold">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </div>
                          </div>
                        </div>
                        
                        {/* Nút xóa */}
                        <button 
                          className="mt-3 sm:mt-0 sm:ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                          onClick={() => handleRemoveItem(item.cartItemID)}
                          disabled={removingItems.includes(item.cartItemID)}
                        >
                          {removingItems.includes(item.cartItemID) ? (
                            <span className="text-gray-400">Đang xóa...</span>
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tóm tắt giỏ hàng */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-4">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h2 className="font-semibold text-lg">Tóm tắt đơn hàng</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <span>Tổng tiền:</span>
                      <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                    
                    <Link
                      to="/checkout"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-md transition-colors"
                    >
                      Tiến hành thanh toán
                    </Link>
                    
                    <Link
                      to="/"
                      className="block w-full text-blue-600 text-center mt-4 hover:underline"
                    >
                      Tiếp tục mua sắm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;