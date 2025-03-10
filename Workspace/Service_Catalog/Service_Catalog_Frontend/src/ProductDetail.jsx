import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const products = [
  { id: "1", name: "Nhẫn Kim cương Vàng trắng", price: "15.000.000 đ", image: "https://picsum.photos/id/1/400" },
  { id: "2", name: "Nhẫn Vàng", price: "2.200.000 đ", oldPrice: "4.000.000 đ", image: "https://picsum.photos/id/2/400" },
  { id: "3", name: "Khuyên Tai Kim Cương", price: "2.200.000 đ", oldPrice: "4.000.000 đ", image: "https://picsum.photos/id/3/400" },
  { id: "4", name: "Vòng Tay Trái Tim", price: "2.200.000 đ", oldPrice: "4.000.000 đ", image: "https://picsum.photos/id/4/400" },
  { id: "5", name: "Khuyên Tai Hoa Hồng", price: "2.200.000 đ", oldPrice: "4.000.000 đ", image: "https://picsum.photos/id/5/400" },
  { id: "6", name: "Dây Chuyền Kim Cương", price: "3.500.000 đ", oldPrice: "6.000.000 đ", image: "https://picsum.photos/id/6/400" }
];

const ProductDetail = () => {
  const { productId } = useParams();
  const currentProduct = products.find((p) => p.id === productId);
  const similarProducts = products.filter((p) => p.id !== productId).slice(0, 5);
  const [selectedImage, setSelectedImage] = useState(currentProduct?.image);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10">
        {/* Ảnh sản phẩm */}
        <div className="flex">
          <div className="flex flex-col gap-2 mr-4">
            {[currentProduct?.image, "https://picsum.photos/id/10/400", "https://picsum.photos/id/11/400"].map((img, index) => (
              <button key={index} className="w-16 h-16 bg-gray-700 rounded" onClick={() => setSelectedImage(img)}>
                <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded" />
              </button>
            ))}
          </div>
          <img src={selectedImage} alt={currentProduct?.name} className="w-full rounded-lg" />
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-200">{currentProduct?.name}</h1>
          <p className="italic text-gray-400 mb-2">Mã: GNDDDDW013481</p>
          <p className="text-2xl font-semibold text-white mb-4">{currentProduct?.price}</p>
          
          <div className="flex items-center gap-2 mb-6">
            <span>Số lượng:</span>
            <div className="flex border border-gray-500 rounded px-2 py-1">
              <button className="px-2">-</button>
              <span className="px-2">1</span>
              <button className="px-2">+</button>
            </div>
          </div>
          
          {/* Nút mua và giỏ hàng */}
          <div className="flex gap-4">
            <button className="bg-red-500 w-full py-3 rounded text-white font-bold text-lg">Mua ngay</button>
          </div>
          <div className="flex gap-4 mt-2">
            <button className="bg-blue-500 w-1/2 py-3 rounded text-white font-bold text-lg">Thêm vào giỏ hàng</button>
            <button className="bg-blue-500 w-1/2 py-3 rounded text-white font-bold text-lg">Gọi tư vấn</button>
          </div>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="mt-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Thông Tin Sản Phẩm</h2>
        <div className="text-gray-300">
          <p>Trọng lượng tham khảo: 4.45991 phân</p>
          <p>Hàm lượng chất liệu: 5850</p>
          <p>Loại đá chính: Xoàn mỹ</p>
          <p>Kích thước đá chính: 3 × 3</p>
          <p>Hình dạng đá: Trái tim</p>
          <p>Loại đá phụ: Xoàn mỹ</p>
          <p>Số viên đá chính: 1</p>
          <p>Số viên đá phụ: 35</p>
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">Sản phẩm tương tự</h2>
        <div className="grid grid-cols-5 gap-6 justify-center">
          {similarProducts.map((item) => (
            <Link key={item.id} to={`/product/productDetail/${item.id}`} className="block bg-gray-800 p-4 rounded text-center">
              <img src={item.image} alt={item.name} className="w-full rounded" />
              <p className="mt-2 font-semibold">{item.name}</p>
              <p className="text-red-500 font-bold">{item.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
