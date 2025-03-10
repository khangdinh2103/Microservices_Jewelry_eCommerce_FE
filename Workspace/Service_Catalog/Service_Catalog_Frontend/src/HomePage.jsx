import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-10">
      {/* Menu giữ nguyên */}
      <nav className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Trang Sức</h1>
        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">Trang Chủ</Link>
          <Link to="/collection" className="text-gray-300 hover:text-white">Bộ Sưu Tập</Link>
          <Link to="/product/:categoryId" className="text-gray-300 hover:text-white">Nhẫn</Link>
        </div>
      </nav>
      
      {/* Phần tìm kiếm */}
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold">Tìm Kiếm</h2>
        <p className="text-gray-400">Tìm Kiếm Trang Sức Theo Mong Muốn Của Bạn</p>
      </div>
      
      {/* Danh mục sản phẩm */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        {[
          { name: "Nhẫn", img: "https://picsum.photos/200" },
          { name: "Khuyên Tai", img: "https://picsum.photos/201" },
          { name: "Vòng Cổ", img: "https://picsum.photos/202" },
          { name: "Lắc Tay", img: "https://picsum.photos/203" }
        ].map((category, index) => (
          <div key={index} className="relative text-center">
            <img src={category.img} alt={category.name} className="w-full rounded-lg" />
            <p className="absolute bottom-2 left-0 right-0 text-white font-bold">{category.name}</p>
          </div>
        ))}
      </div>
      
      {/* Trang sức bán chạy */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center">Trang Sức Bán Chạy</h2>
        <div className="grid grid-cols-4 gap-6 mt-6">
          {[
            { id: 1, name: "Nhẫn Vàng", price: "2.200.000 đ", img: "https://picsum.photos/204" },
            { id: 2, name: "Khuyên Tai Kim Cương", price: "2.200.000 đ", img: "https://picsum.photos/205" },
            { id: 3, name: "Vòng Tay Trái Tim", price: "2.200.000 đ", img: "https://picsum.photos/206" },
            { id: 4, name: "Khuyên Tai Hoa Hồng", price: "2.200.000 đ", img: "https://picsum.photos/207" }
          ].map((product) => (
            <Link key={product.id} to={`/product/productDetail/${product.id}`} className="block bg-gray-800 p-4 rounded text-center">
              <img src={product.img} alt={product.name} className="w-full rounded" />
              <p className="mt-2 font-semibold">{product.name}</p>
              <p className="text-red-500 font-bold">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
