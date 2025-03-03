import React from 'react';
import { useState } from "react";
import {useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categories = [
    { id: "1", name: "Trang sức Đính Kim Cương1" },
    { id: "2", name: "Trang sức Đính ECZ2" },
    { id: "3", name: "Trang sức Đính Ngọc Trai3" },
    { id: "4", name: "Trang sức Không Đính Đá4" },
    { id: "5", name: "Nhẫn cặp5" },
    { id: "6", name: "Trang sức Không Đính Đá6" },
    { id: "7", name: "Nhẫn cặp7" },
    { id: "8", name: "Trang sức Không Đính Đá8" },
    { id: "9", name: "Nhẫn cặp9" },
    { id: "10", name: "Trang sức Không Đính Đá10" },
    { id: "11", name: "Nhẫn cặp11" }
];

const products = [
    { id: "1", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "2", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "3", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "4", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "5", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "6", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "7", name: "Dây Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "8", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "9", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "10", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "11", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
    { id: "12", name: "Nhẫn Vàng Trắng", price: "3.800.000đ", oldPrice: "6.000.000đ", image: "https://picsum.photos/id/1/200" },
];


const Product = () => {
    const { categoryId } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [gender, setGender] = useState("");
    const [price, setPrice] = useState("");
    const [material, setMaterial] = useState("");
    const [brand, setBrand] = useState("");
    const [onSale, setOnSale] = useState(false);

    const handleSearch = () => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        draggable:false,
        swipe: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    return (
        <div className="min-h-screen bg-bgOuter px-10 py-6">
            <div className="text-white mb-4 flex justify-center">
                <Link to="/" className="text-gray-400">Trang chủ </Link> / Category {categoryId}
            </div>
            {/*Banner*/}
            <div className="mb-4 flex items-center justify-center px-4">
                <img src="https://cdn.pnj.io/images/promo/235/1200x450-nhan-t01-25.jpg" alt="Banner" className="w-full max-w-4xl rounded-md" />
            </div>
            {/*Category*/}
            <div className="relative py-4 px-10" >
                <Slider {...settings} className="flex px-10 justify-between align-center">
                    {categories.map((category) => (
                        <Link to={`/product/${category.id}`} key={category.id}  className="flex justify-between align-center">
                            <button className="px-2 py-2 border border-white text-white rounded-lg w-[155px] h-[70px]">
                                {category.name}
                            </button>
                        </Link>
                    ))}
                </Slider>
            </div>
            {/*Search*/}
            <div className="mb-4 flex items-center justify-center px-4 py-4 mb-2">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm tại đây"
                        className="pl-4 pr-12 py-2 w-full border border-white rounded-md bg-gray-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-md bg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Dropdown bộ lọc */}
            <div className="flex flex-wrap gap-2 px-10 mb-4">
                {/* Lọc theo giới tính */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="unisex">Unisex</option>
                </select>

                {/* Lọc theo giá */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                >
                    <option value="">Khoảng giá</option>
                    <option value="0-1000000">Dưới 1 triệu</option>
                    <option value="1000000-5000000">1 - 5 triệu</option>
                    <option value="5000000-10000000">5 - 10 triệu</option>
                    <option value="10000000">Trên 10 triệu</option>
                </select>

                {/* Lọc theo chất liệu */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                >
                    <option value="">Chất liệu</option>
                    <option value="gold">Vàng</option>
                    <option value="silver">Bạc</option>
                    <option value="platinum">Bạch kim</option>
                    <option value="diamond">Kim cương</option>
                </select>

                {/* Lọc theo thương hiệu */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                >
                    <option value="">Thương hiệu</option>
                    <option value="pnj">PNJ</option>
                    <option value="sjc">SJC</option>
                    <option value="doji">DOJI</option>
                    <option value="cartier">Cartier</option>
                </select>
                {/* Lọc theo khuyến mãi */}
                <label className="flex items-center text-white">
                    <input
                        type="checkbox"
                        className="mr-1 size-4"
                        checked={onSale}
                        onChange={(e) => setOnSale(e.target.checked)}
                    />
                    Đang khuyến mãi
                </label>
            </div>
            {/*List product*/}
            <div className="grid grid-cols-4 gap-8 px-10">
                {filteredProducts.map((item) => (
                    <a key={item.id} href={`/product/productDetail/${item.id}`} className="block">
                        <div className="bg-bgProduct rounded-lg shadow-md">
                            <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                            <div className="bg-black/80 p-2">
                                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                <div className="flex items-center mt-1">
                                    <span className="text-price text-base font-bold">{item.price}</span>
                                    <span className="text-gray-400 text-sm line-through ml-2">{item.oldPrice}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};


export default Product;