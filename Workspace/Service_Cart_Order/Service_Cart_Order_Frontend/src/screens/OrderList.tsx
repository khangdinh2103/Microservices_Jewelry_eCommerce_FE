import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useLocation } from "react-router-dom";


interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageURL: string;
}

interface Order {
  orderID: number;
  createAt: string;
  address: string;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "CANCELED";
  items: OrderItem[];
  total: number;
}

const OrderList: React.FC = () => {
  const location = useLocation();
  const shippingCost = location.state?.shippingCost || 0; // Nếu không có, mặc định là 0

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderID, setExpandedOrderID] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/orders/user/1");
        if (!response.ok) {
          throw new Error("Lỗi khi lấy danh sách đơn hàng");
        }
        const data = await response.json();

        const formattedOrders = data.map((order: any) => ({
          orderID: order.orderID,
          createAt: order.createAt,
          address: order.address,
          status: order.status as Order["status"],
          paymentStatus: order.paymentStatus as Order["paymentStatus"],
          items: order.orderDetails.map((detail: any) => ({
            name: detail.product.name,
            quantity: detail.quantity,
            price: detail.price,
            imageURL: detail.product.imageSet?.length
              ? detail.product.imageSet[0].imageURL
              : "https://via.placeholder.com/100",
          })),
          total: order.orderDetails.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity ,
            0
          )+ shippingCost,
        }));

        setOrders(formattedOrders);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColors: Record<Order["status"], string> = {
    PENDING: "bg-yellow-600",
    PROCESSING: "bg-blue-600",
    DELIVERED: "bg-green-600",
    CANCELLED: "bg-red-600",
  };

  const statusText: Record<Order["status"], string> = {
    PENDING: "Chờ Xử Lý",
    PROCESSING: "Đang Xử Lý",
    DELIVERED: "Đã Giao",
    CANCELLED: "Đã Hủy",
  };

  const paymentStatusColors: Record<Order["paymentStatus"], string> = {
    PENDING: "bg-yellow-500",
    PAID: "bg-green-500",
    CANCELED: "bg-red-500",
  };
  
  const paymentStatusText: Record<Order["paymentStatus"], string> = {
    PENDING: "Chưa Thanh Toán",
    PAID: "Đã Thanh Toán",
    CANCELED: "Đã Hủy",
  };
  
  if (loading) return <p className="text-gray-300 text-center text-lg">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center text-lg">Lỗi: {error}</p>;

  return (
    <div className="min-h-screen bg-[#1D1917] text-gray-100 p-6 md:p-10 font-['Mulish']">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Danh Sách Đơn Hàng</h1>

        <div className="bg-[#312F30] p-6 rounded-lg shadow-lg">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-gray-600 text-gray-300">
                <th className="px-6 py-4 text-left">Mã Đơn Hàng</th>
                <th className="px-6 py-4 text-left">Ngày Đặt</th>
                <th className="px-6 py-4 text-left">Tổng Giá</th>
                <th className="px-6 py-4 text-left">Trạng Thái</th>
                <th className="px-6 py-4 text-left">Thanh Toán</th>
                <th className="px-6 py-4 text-left">Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.orderID}>
                  <tr className="border-b border-gray-600 hover:bg-gray-700 transition">
                    <td className="px-6 py-4">{order.orderID}</td>
                    <td className="px-6 py-4">
                      {format(new Date(order.createAt), "dd/MM/yyyy", { locale: vi })}
                    </td>
                    <td className="px-6 py-4">{order.total.toLocaleString()}₫</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${statusColors[order.status]} px-4 py-2 rounded-full text-white`}>
                        {statusText[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"> 
                      <span className={`${paymentStatusColors[order.paymentStatus]} px-4 py-2 rounded-full text-white`}>
                        {paymentStatusText[order.paymentStatus]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        onClick={() =>
                          setExpandedOrderID(expandedOrderID === order.orderID ? null : order.orderID)
                        }
                      >
                        {expandedOrderID === order.orderID ? "Ẩn" : "Xem Chi Tiết"}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderID === order.orderID && (
                    <tr className="bg-gray-700">
                      <td colSpan={5} className="px-6 py-4">
                        <p className="font-semibold text-xl mb-3">Chi Tiết Đơn Hàng</p>

                        <table className="w-full border border-gray-600">
                          <thead>
                            <tr className="border-b border-gray-600 text-gray-300">
                              <th className="px-4 py-3 text-left">Ảnh</th>
                              <th className="px-4 py-3 text-left">Tên Sản Phẩm</th>
                              <th className="px-4 py-3 text-left">Số Lượng</th>
                              <th className="px-4 py-3 text-left">Giá</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index} className="border-b border-gray-600">
                                <td className="px-4 py-3">
                                  <img
                                    src={item.imageURL}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-500"
                                  />
                                </td>
                                <td className="px-4 py-3">{item.name}</td>
                                <td className="px-4 py-3">{item.quantity}</td>
                                <td className="px-4 py-3">{item.price.toLocaleString()}₫</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
