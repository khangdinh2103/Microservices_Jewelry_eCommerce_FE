import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Cart from "./screens/Cart";
import Order from "./screens/Order";
import Checkout from "./screens/Checkout";
import OrderList from "./screens/OrderList";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Router>
      <div className="p-4">
        <Header/>
        <nav className="mb-4">
          <Link to="/cart" className="mr-4 text-blue-500">Giỏ hàng</Link>
          <Link to="/order" className="text-blue-500">Đơn hàng</Link>
          <Link to="/checkout" className="text-blue-500">Thanh toán</Link>
          <Link to="/order-list" className="text-blue-500">Danh sách đơn hàng</Link>
        </nav>
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-list" element={<OrderList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
