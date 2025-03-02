import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Cart from "./screens/Cart";
import Order from "./screens/Order";

const App: React.FC = () => {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4">
          <Link to="/cart" className="mr-4 text-blue-500">Giỏ hàng</Link>
          <Link to="/order" className="text-blue-500">Đơn hàng</Link>
        </nav>
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
