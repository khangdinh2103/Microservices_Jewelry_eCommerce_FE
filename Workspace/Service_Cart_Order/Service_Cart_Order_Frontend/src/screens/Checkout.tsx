import { useState } from "react";
import { useLocation } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const { selectedItems, cartItems } = location.state || { selectedItems: [], cartItems: [] };

  if (!selectedItems.length || !cartItems.length) {
    return <h2 className="text-center text-white">Không có sản phẩm nào để thanh toán!</h2>;
  }

  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, TP. HCM",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const selectedCartItems = cartItems.filter((item: CartItem) => selectedItems.includes(item.id));

  const totalAmount = selectedCartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const taxRate = 0.1;
  const shippingCost = 150000;
  const finalAmount = totalAmount - discount + totalAmount * taxRate + shippingCost;

  const handleVoucherApply = () => {
    if (voucher === "DISCOUNT10") {
      setDiscount(totalAmount * 0.1);
    } else {
      setDiscount(0);
      alert("Voucher không hợp lệ!");
    }
  };

  const handleOrder = () => {
    alert("Đặt hàng thành công!");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Thanh toán</h1>

        {/* Sản phẩm đã chọn */}
        <div className="bg-gray-800 shadow rounded-lg p-4 mb-8">
            {selectedCartItems.map((item: CartItem) => (
                <div key={item.id} className="flex items-center justify-between py-6 border-b border-gray-700 last:border-0">
                <div className="flex-shrink-0 w-24 h-24">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                </div>
                <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between text-white">
                    <h3 className="text-lg font-medium">{item.name} x {item.quantity}</h3>
                    <p className="text-lg font-medium">{item.price.toLocaleString()} VND</p>
                    </div>
                </div>
                </div>
            ))}
            </div>


        {/* Tính toán chi phí */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8">
          <div className="space-y-4 text-white">
            <div className="flex justify-between"><span>Tổng phụ</span><span>{totalAmount.toLocaleString()} VND</span></div>
            <div className="flex justify-between"><span>Thuế (10%)</span><span>{(totalAmount * taxRate).toLocaleString()} VND</span></div>
            <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingCost.toLocaleString()} VND</span></div>
            {discount > 0 && <div className="flex justify-between text-green-400"><span>Giảm giá</span><span>-{discount.toLocaleString()} VND</span></div>}
            <div className="border-t border-gray-600 pt-4 text-xl font-bold flex justify-between">
              <span>Tổng cộng</span>
              <span>{finalAmount.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Thông tin người dùng */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8">
          {isEditing ? (
            <>
              <input name="name" value={userInfo.name} className="w-full p-2 border rounded mb-2 bg-gray-700 text-white" onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })} />
              <input name="email" value={userInfo.email} className="w-full p-2 border rounded mb-2 bg-gray-700 text-white" onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })} />
              <input name="phone" value={userInfo.phone} className="w-full p-2 border rounded mb-2 bg-gray-700 text-white" onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })} />
              <input name="address" value={userInfo.address} className="w-full p-2 border rounded mb-2 bg-gray-700 text-white" onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })} />
              <button onClick={() => setIsEditing(false)} className="w-full bg-green-500 text-white py-2 rounded">Lưu</button>
            </>
          ) : (
            <>
              <p><strong>Họ và tên:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Số điện thoại:</strong> {userInfo.phone}</p>
              <p><strong>Địa chỉ:</strong> {userInfo.address}</p>
              <button onClick={() => setIsEditing(true)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Sửa thông tin</button>
            </>
          )}
        </div>

        {/* Mã giảm giá */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mb-8 flex">
          <input type="text" placeholder="Nhập mã giảm giá" className="w-full p-2 border rounded-l bg-gray-700 text-white" value={voucher} onChange={(e) => setVoucher(e.target.value)} />
          <button onClick={handleVoucherApply} className="bg-blue-500 text-white px-4 rounded-r">Áp dụng</button>
        </div>

        {/* Nút thanh toán */}
        <button onClick={handleOrder} className="w-full bg-red-500 text-white py-3 rounded mt-8 text-lg font-semibold">Thanh toán</button>
      </div>
    </div>
  );
};

export default Checkout;
