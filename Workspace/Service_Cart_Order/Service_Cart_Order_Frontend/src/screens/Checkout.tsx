import { useState, useEffect } from "react";
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

  // Kiểm tra nếu không có sản phẩm nào trong giỏ, trả thông báo
  if (!selectedItems.length || !cartItems.length) {
    return <h2 className="text-center text-white">Không có sản phẩm nào để thanh toán!</h2>;
  }

  // Thông tin người dùng
  const [userInfo, setUserInfo] = useState({
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    address: "123 Đường ABC, TP. HCM",
  });

  // Chế độ sửa thông tin người dùng
  const [isEditing, setIsEditing] = useState(false);

  // Mã giảm giá
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  // Lọc sản phẩm đã chọn trong giỏ hàng
  const selectedCartItems = cartItems.filter((item: CartItem) => selectedItems.includes(item.id));

  // Tính toán tổng tiền
  const totalAmount = selectedCartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const taxRate = 0.1;
  const shippingCost = 150000;
  const finalAmount = totalAmount - discount + totalAmount * taxRate + shippingCost;

  // Áp dụng mã giảm giá
  const handleVoucherApply = () => {
    if (voucher === "DISCOUNT10") {
      setDiscount(totalAmount * 0.1);
    } else {
      setDiscount(0);
      alert("Voucher không hợp lệ!");
    }
  };

  // Đặt hàng
  const handleOrder = () => {
    alert("Đặt hàng thành công!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6">Thanh toán</h2>
      
      {/* Hiển thị sản phẩm đã chọn */}
      <div className="mb-4 bg-gray-800 p-4 rounded-lg">
        {selectedCartItems.map((item: CartItem) => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
              <span>{item.name} x {item.quantity}</span>
            </div>
            <span>{item.price.toLocaleString()} VND</span>
          </div>
        ))}
      </div>

      {/* Tính toán chi phí */}
      <div className="space-y-2 text-lg">
        <div className="flex justify-between"><span>Tổng phụ</span><span>{totalAmount.toLocaleString()} VND</span></div>
        <div className="flex justify-between"><span>Thuế (10%)</span><span>{(totalAmount * taxRate).toLocaleString()} VND</span></div>
        <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingCost.toLocaleString()} VND</span></div>
        {discount > 0 && <div className="flex justify-between text-green-400"><span>Giảm giá</span><span>-{discount.toLocaleString()} VND</span></div>}
        <div className="border-t border-gray-600 pt-4 text-xl font-bold flex justify-between">
          <span>Tổng cộng</span>
          <span>{finalAmount.toLocaleString()} VND</span>
        </div>
      </div>

      {/* Thông tin người dùng */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
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

      {/* Nhập mã giảm giá */}
      <div className="mt-4 flex">
        <input type="text" placeholder="Nhập mã giảm giá" className="w-full p-2 border rounded-l bg-gray-700 text-white" value={voucher} onChange={(e) => setVoucher(e.target.value)} />
        <button onClick={handleVoucherApply} className="bg-blue-500 text-white px-4 rounded-r">Áp dụng</button>
      </div>

      {/* Nút thanh toán */}
      <button onClick={handleOrder} className="w-full bg-red-500 text-white py-3 rounded mt-6 text-lg font-semibold">Thanh toán</button>
    </div>
  );
};

export default Checkout;
