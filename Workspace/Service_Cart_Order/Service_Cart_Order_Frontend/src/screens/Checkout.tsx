import { useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
import LocationPicker from "../components/PickerLocation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}


const Checkout: React.FC = () => {

  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);  // Thông tin tuyến đường

  const navigate = useNavigate();
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
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

  // const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  //   useMapEvents({
  //     click: async (e) => {
  //       const lat = e.latlng.lat;
  //       const lng = e.latlng.lng;
  //       onLocationSelect(lat, lng);
  
  //       try {
  //         const response = await fetch(`http://localhost:3000/api/location?lat=${lat}&lng=${lng}`);
  //         const data = await response.json();
  //         if (data.address) {
  //           setUserInfo((prev) => ({ ...prev, address: data.address }));
  //         } else {
  //           alert("Không thể lấy địa chỉ!");
  //         }
  //       } catch (error) {
  //         console.error("Lỗi lấy địa chỉ từ tọa độ:", error);
  //       }
  //     },
  //   });
  
  //   return null;
  // };
  // const LocationPicker = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  //   useMapEvents({
  //     click: async (e) => {
  //       const lat = e.latlng.lat;
  //       const lng = e.latlng.lng;
  //       onLocationSelect(lat, lng);
  
  //       try {
  //         const response = await fetch(`http://localhost:3000/api/location?lat=${lat}&lng=${lng}`);
  //         const data = await response.json();
  //         if (data.address) {
  //           setUserInfo((prev) => ({ ...prev, address: data.address }));
  //         } else {
  //           alert("Không thể lấy địa chỉ!");
  //         }
          
  //         // Lấy tuyến đường từ điểm cố định tới điểm người dùng chọn
  //         const startLat = 10.808131355448648; // Ví dụ: điểm xuất phát cố định
  //         const startLng = 106.70645211764977; // Ví dụ: điểm xuất phát cố định
  //         const responseRoute = await fetch(`http://localhost:3000/api/location/distance?startLat=${startLat}&startLng=${startLng}&endLat=${lat}&endLng=${lng}`);
  //         const routeData = await responseRoute.json();
  
  //         if (routeData.message === "Tính khoảng cách thành công!") {
  //           const routeCoordinates = [
  //             new L.LatLng(parseFloat(routeData.from.lat), parseFloat(routeData.from.lng)),
  //             new L.LatLng(lat, lng),
  //           ];
  //           setRoute(routeCoordinates);  // Lưu tuyến đường vào state
  
  //           // Cập nhật thông tin về khoảng cách và thời gian
  //           setRouteInfo({
  //             distance: parseFloat(routeData.distance_km), // Chuyển đổi chuỗi thành số
  //             duration: parseFloat(routeData.duration_minutes), // Chuyển đổi chuỗi thành số
  //           });
  //         } else {
  //           alert("Không thể lấy tuyến đường!");
  //         }
  //       } catch (error) {
  //         console.error("Lỗi lấy địa chỉ hoặc tuyến đường:", error);
  //       }
  //     },
  //   });
  
  //   return null;
  // };
  
  const [isEditing, setIsEditing] = useState(false);

  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const selectedCartItems = cartItems.filter((item: CartItem) => selectedItems.includes(item.id));

  const totalAmount = selectedCartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const shippingCost = 150000;
  const finalAmount = totalAmount - discount + shippingCost;

  const handleVoucherApply = () => {
    if (voucher === "DISCOUNT10") {
      setDiscount(totalAmount * 0.1);
    } else {
      setDiscount(0);
      alert("Voucher không hợp lệ!");
    }
  };

  const handleOrder = async () => {
    const paymentStatus = paymentMethod === "cod" ? "PENDING" : "PAID";
  
    const orderData = {
      userID: 1, 
      address: userInfo.address,
      status: "PENDING",
      paymentStatus,
      orderDetails: selectedCartItems.map((item: CartItem) => ({
        productID: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingCost, 
      totalAmount: finalAmount, 
    };
  
    try {
      const orderResponse = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!orderResponse.ok) {
        throw new Error("Đặt hàng thất bại!");
      }
  
      const orderResult = await orderResponse.json();
  
      if (paymentMethod === "cod") {
        alert("Đặt hàng thành công! Đơn hàng của bạn đang chờ xử lý.");
        navigate("/order-list", { state: { shippingCost } });
        return;
      }
  
      if (paymentMethod !== "momo") {
        alert("Hiện tại chỉ hỗ trợ thanh toán bằng Momo hoặc COD.");
        return;
      }
  
      const paymentData = {
        items: selectedCartItems.map((item: CartItem) => ({
          image: item.image,
          name: item.name,
          quantity: item.quantity,
          amount: item.price * item.quantity,
        })),
        userInfo: {
          phoneNumber: userInfo.phone,
          email: userInfo.email,
          name: userInfo.name,
        },
        amount: finalAmount,
        orderID: orderResult.orderID, 
      };
  
      const paymentResponse = await fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
  
      if (!paymentResponse.ok) {
        throw new Error("Thanh toán thất bại!");
      }
  
      const paymentResult = await paymentResponse.json();
  
      if (paymentResult.success && paymentResult.data?.payUrl) {
        window.open(paymentResult.data.payUrl, "_blank");
        navigate("/order-list", { state: { shippingCost } });
      } else {
        throw new Error("Không nhận được URL thanh toán!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đặt hàng hoặc thanh toán!");
      console.error(error);
    }
  };
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapLocation({ lat, lng });

        try {
          const response = await fetch(`http://localhost:3000/api/location?lat=${lat}&lng=${lng}`);
          const data = await response.json();
          if (data.address) {
            setUserInfo((prev) => ({ ...prev, address: data.address }));
          } else {
            alert("Không thể lấy địa chỉ!");
          }
        } catch (error) {
          console.error("Lỗi lấy vị trí:", error);
        }
      }, (error) => {
        alert("Không thể truy cập vị trí! Vui lòng kiểm tra cài đặt trình duyệt.");
      });
    } else {
      alert("Trình duyệt không hỗ trợ lấy vị trí!");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#312F30] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 font-mulish">Thanh toán</h1>

        <div className="bg-[#1D1917] shadow rounded-lg p-6 mb-8">

          <div className="mb-6">
            {selectedCartItems.map((item: CartItem) => (
              <div key={item.id} className="flex items-center justify-between py-6 border-b border-gray-700 last:border-0">
                <div className="flex-shrink-0 w-24 h-24">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="text-white">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-400">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-white">{item.price.toLocaleString()} VND</p>
                </div>
              </div>
            ))}
          </div>


                <div className="flex mt-15 mb-20">
                <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="w-full p-5 border rounded-l bg-gray-700 text-white"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                />
                <button
                    onClick={handleVoucherApply}
                    className="bg-[#E8B08A] text-white px-4 rounded-r"
                >
                    Áp dụng
                </button>
                </div>


   
          <div className="mb-20 ml-5 mr-5 space-y-4 text-white font-bold font-mulish">
            <div className="flex justify-between"><span>Tổng phụ</span><span>{totalAmount.toLocaleString()} VND</span></div>
            <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingCost.toLocaleString()} VND</span></div>
            {discount > 0 && <div className="flex justify-between text-green-400"><span>Giảm giá</span><span>-{discount.toLocaleString()} VND</span></div>}
            <div className="border-t border-gray-600 pt-4 text-xl font-bold flex justify-between">
              <span>Tổng cộng</span>
              <span>{finalAmount.toLocaleString()} VND</span>
            </div>
          </div>

   
            <div className="mb-6 bg-[#2E2A27] p-6 rounded-lg shadow-md">
            {isEditing ? (
                <>
                <input
                    name="name"
                    value={userInfo.name}
                    className="w-full p-3 border border-gray-600 rounded mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="Nhập họ và tên"
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <input
                    name="email"
                    value={userInfo.email}
                    className="w-full p-3 border border-gray-600 rounded mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="Nhập email"
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
                <input
                    name="phone"
                    value={userInfo.phone}
                    className="w-full p-3 border border-gray-600 rounded mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="Nhập số điện thoại"
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
                {/* <input
                    name="address"
                    value={userInfo.address}
                    className="w-full p-3 border border-gray-600 rounded mb-4 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    placeholder="Nhập địa chỉ"
                    onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                /> */}
                <input
              name="address"
              value={userInfo.address}
              className="w-full p-3 border border-gray-600 rounded mb-4 bg-gray-700 text-white"
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
            />
             
            <div className="flex items-center space-x-4">
            <button
                onClick={handleGetCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Vị trí hiện tại
              </button>
              <button
                onClick={() => setShowMap(!showMap)}

                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                {showMap ? "Ẩn bản đồ" : "Hiện bản đồ"}
              </button>
            </div>


            {showMap && (
              <MapContainer
                center={mapLocation || { lat: 10.7769, lng: 106.7009 }}
                zoom={13}
                style={{ height: "400px", width: "100%", borderRadius: "10px", margin: "20px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapLocation && (
                  <Marker position={[mapLocation.lat, mapLocation.lng]} icon={customIcon}>
                    <Popup>Vị trí giao hàng</Popup>
                  </Marker>
                )}
                {/* <LocationPicker onLocationSelect={(lat, lng) => setMapLocation({ lat, lng })} /> */}
               
                <LocationPicker
                    onLocationSelect={(lat, lng) => setMapLocation({ lat, lng })}
                    setUserInfo={setUserInfo}
                    setRoute={setRoute}
                    setRouteInfo={setRouteInfo}
                  />
              </MapContainer>
            )}

                <button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-green-500 text-white py-3 rounded mt-4 hover:bg-green-600 transition"
                >
                    Lưu
                </button>
                </>
            ) : (
                <>
                <p className="text-white mb-2 text-xl"><strong>Họ và tên:</strong> {userInfo.name}</p>
                <p className="text-white mb-2 text-xl"><strong>Email:</strong> {userInfo.email}</p>
                <p className="text-white mb-2 text-xl"><strong>Số điện thoại:</strong> {userInfo.phone}</p>
                <p className="text-white mb-2 text-xl"><strong>Địa chỉ:</strong> {userInfo.address}</p>
                <div className="text-white mb-2">
                  <p> <strong>Độ dài tuyến đường:</strong> {routeInfo?.distance?.toFixed(2)} km</p>
                  <p><strong>Thời gian ước tính:</strong> {routeInfo?.duration?.toFixed(2)} phút</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 bg-[#E8B08A] text-white px-4 py-2 rounded hover:bg-[#D68B66] transition"
                >
                    Sửa thông tin
                </button>
                </>
            )}
            </div>
             <PaymentMethodSelector selectedMethod={paymentMethod} onSelect={setPaymentMethod} />


          

        </div>

        {/* Nút thanh toán */}
        <button onClick={handleOrder} className="w-full bg-red-500 text-white py-3 rounded mt-8 text-lg font-semibold font-mulish">Thanh toán</button>
      </div>
    </div>
  );
};

export default Checkout;
