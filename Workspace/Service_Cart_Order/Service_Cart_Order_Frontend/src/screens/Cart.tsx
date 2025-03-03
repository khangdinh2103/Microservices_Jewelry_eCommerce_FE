import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [subtotal, setSubtotal] = useState<number>(0);
  const taxRate: number = 0.1;
  const shippingCost: number = 150000;

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateSubtotal();
  }, [cartItems, selectedItems]);

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cart/1");
      if (!response.ok) throw new Error("Failed to fetch cart data");
      const data = await response.json();
      console.log(data);

      const formattedItems: CartItem[] = data.items.map((item: any) => ({
        id: item.productID,
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        image: item.imageURL,
      }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const calculateSubtotal = (): void => {
    const total = cartItems 
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  const updateQuantity = (id: number, newQuantity: number): void => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const removeItem = (id: number): void => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const toggleSelectItem = (id: number): void => {
    setSelectedItems(selectedItems.includes(id)
      ? selectedItems.filter(itemId => itemId !== id)
      : [...selectedItems, id]);
  };

  const toggleSelectAll = (): void => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    navigate("/checkout", { state: { selectedItems: [...selectedItems], cartItems } });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#312F30' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 font-mulish">Giỏ hàng</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg shadow">
            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium text-white font-mulish">Giỏ hàng của bạn đang trống</h2>
            <button className="mt-6 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md">Tiếp tục mua sắm</button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[#1D1917] shadow rounded-lg overflow-hidden p-4">
              <label className="flex items-center text-white font-mulish">
                <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="mr-6 w-5 h-5" /> Chọn tất cả
              </label>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-6 border-b border-gray-700 last:border-0 bg-[#1D1917]">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="mr-6 w-5 h-5"
                  />
                  <div className="flex-shrink-0 w-24 h-24">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" loading="lazy" />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white font-mulish">{item.name}</h3>
                      <p className="text-lg font-medium text-white font-mulish">{item.price.toLocaleString()} VND</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-600 rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-700">
                          <FiMinus className="h-4 w-4 text-white font-mulish" />
                        </button>
                        <input type="number" min="1" value={item.quantity} className="w-16 text-center border-x border-gray-600 bg-gray-800 text-white p-2" readOnly />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-700">
                          <FiPlus className="h-4 w-4 text-white font-mulish" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600 flex items-center">
                        <FiTrash2 className="h-5 w-5 mr-1" /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1D1917] shadow rounded-lg p-6">
              <div className="space-y-4 text-white font-mulish">
                <div className="flex justify-between"><span>Tổng phụ</span><span>{subtotal.toLocaleString()} VND</span></div>
                <div className="flex justify-between"><span>Thuế</span><span>{(subtotal * taxRate).toLocaleString()} VND</span></div>
                <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingCost.toLocaleString()} VND</span></div>
                <div className="border-t border-gray-600 pt-4 text-lg font-medium flex justify-between">
                  <span>Tổng cộng</span>
                  <span className="font-bold font-mulish">{(subtotal + subtotal * taxRate + shippingCost).toLocaleString()} VND</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="mt-6 w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 font-mulish">
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
