import React from 'react';
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const fillerProduct = [
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
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [gender, setGender] = useState("");
    const [price, setPrice] = useState("");
    const [material, setMaterial] = useState("");
    const [brand, setBrand] = useState("");
    const [onSale, setOnSale] = useState(false);

    const handleSearchTextBox = () => {
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
        draggable: false,
        swipe: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    const { categoryId } = useParams();
    const [categoryDetail, setCategoryDetail] = useState({});
    useEffect(() => {
        const fetchCategoryDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/category/detailCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategoryDetail(data);
            } catch (error) {
                console.error('Failed to fetch category details:', error);
            }
        };

        fetchCategoryDetail();
    }, [categoryId]);

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listProductByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);

            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        if (categoryId) {
            fetchProducts();
            console.log(filteredProducts)
        }
    }, [categoryId]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/category/listCategory');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const [brands, setBrands] = useState([]);
    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listBrandByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBrands(data);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            }
        };

        const fetchMaterials = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/listMaterialByCategory/${categoryId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            }
        }

        if (categoryId) {
            fetchBrands();
            fetchMaterials();
        }
    }, [categoryId]);

    const getFilterDisplayName = (type, value) => {
        switch (type) {
            case 'gender':
                const genderMap = {
                    '0': 'Nam',
                    '1': 'Nữ',
                    '2': 'Unisex'
                };
                return genderMap[value] || value;
            case 'price':
                const priceRanges = {
                    '0-1000000': 'Dưới 1 triệu',
                    '1000000-5000000': '1 - 5 triệu',
                    '5000000-10000000': '5 - 10 triệu',
                    '10000000': 'Trên 10 triệu'
                };
                return priceRanges[value];
            case 'material':
                return value.toUpperCase();
            case 'brand':
                return value.toUpperCase();
            default:
                return value;
        }
    };

    const removeFilter = (filterType) => {
        switch (filterType) {
            case 'gender':
                setGender('');
                break;
            case 'price':
                setPrice('');
                break;
            case 'material':
                setMaterial('');
                break;
            case 'brand':
                setBrand('');
                break;
            case 'onSale':
                setOnSale(false);
                break;
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        if (searchTerm.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
        }

        if (gender) {
            filtered = filtered.filter(product =>
                product.gender.toString() === gender
            );
        }

        if (price) {
            filtered = filtered.filter(product => {
                if (!product.price) return false;

                const productPrice = typeof product.price === 'string'
                    ? parseFloat(product.price.replace(/[^\d]/g, ''))
                    : product.price;

                if (price === '10000000') {
                    return productPrice >= 10000000;
                }

                const [min, max] = price.split('-').map(Number);
                return productPrice >= min && productPrice <= max;
            });
        }

        if (material) {
            filtered = filtered.filter(product => product.material === material);
        }

        if (brand) {
            filtered = filtered.filter(product => product.brand === brand);
        }

        if (onSale) {
            filtered = filtered.filter(product => product.oldPrice);
        }

        setFilteredProducts(filtered);
    };

    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'gender':
                setGender(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'material':
                setMaterial(value);
                break;
            case 'brand':
                setBrand(value);
                break;
            case 'onSale':
                setOnSale(value);
                break;
        }
    };

    useEffect(() => {
        applyFilters();
    }, [gender, price, material, brand, onSale, searchTerm, products]);

    const handleSearch = () => {
        applyFilters();
    };

    return (
        <div className="min-h-screen bg-bgOuter px-10 py-6">
            <div className="text-white mb-4 flex justify-center">
                <Link to="/" className="text-gray-400">Trang chủ </Link> / {categoryDetail.name}
            </div>
            {/*Banner*/}
            <div className="mb-4 flex items-center justify-center px-4">
                <img src="https://cdn.pnj.io/images/promo/235/1200x450-nhan-t01-25.jpg" alt="Banner" className="w-full max-w-4xl rounded-md" />
            </div>
            {/*Category*/}
            <div className="relative py-4 px-10" >
                <Slider {...settings} className="flex px-10 justify-between align-center">
                    {categories.map((category) => (
                        <Link to={`/product/${category.id}`} key={category.id} className="flex justify-between align-center">
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
                        onKeyDown={(e) => e.key === "Enter" && handleSearchTextBox()}
                    />
                    <button
                        onClick={handleSearchTextBox}
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
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                >
                    <option value="">Giới tính</option>
                    <option value="0">Nam</option>
                    <option value="1">Nữ</option>
                    <option value="2">Unisex</option>
                </select>

                {/* Lọc theo giá */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
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
                    onChange={(e) => handleFilterChange('material', e.target.value)}
                >
                    <option value="">Chất liệu</option>
                    {materials.map((materialName) => (
                        <option key={materialName} value={materialName}>
                            {materialName}
                        </option>
                    ))}
                </select>

                {/* Lọc theo thương hiệu */}
                <select
                    className="px-4 py-2 border border-white bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                    <option value="">Thương hiệu</option>
                    {brands.map((brandName) => (
                        <option key={brandName} value={brandName}>
                            {brandName}
                        </option>
                    ))}
                </select>
                {/* Lọc theo khuyến mãi */}
                <label className="flex items-center text-white">
                    <input
                        type="checkbox"
                        className="mr-1 size-4"
                        checked={onSale}
                        onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                    />
                    Đang khuyến mãi
                </label>
            </div>
            {/* Danh sách các thuộc tính lọc đã chọn */}
            <div className="flex flex-wrap gap-2 px-10 my-4">
                {gender && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('gender', gender)}</span>
                        <button onClick={() => removeFilter('gender')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {price && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('price', price)}</span>
                        <button onClick={() => removeFilter('price')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {material && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('material', material)}</span>
                        <button onClick={() => removeFilter('material')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {brand && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>{getFilterDisplayName('brand', brand)}</span>
                        <button onClick={() => removeFilter('brand')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
                {onSale && (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full">
                        <span>Đang khuyến mãi</span>
                        <button onClick={() => removeFilter('onSale')} className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            {/* List product */}
            <div className="grid grid-cols-4 gap-8 px-10">
                {filteredProducts.map((item) => {
                    const thumbnail = item.productImages.find(image => image.isThumbnail);
                    const imageUrl = thumbnail ? thumbnail.imageUrl : ' ';
                    return (
                        <a key={item.id} href={`/product/productDetail/${item.id}`} className="block">
                            <div className="bg-bgProduct rounded-lg shadow-md">
                                <img src={imageUrl} alt={item.name} className="w-full h-40 object-cover" />
                                {/* {imageUrl && (
                                    <img src={imageUrl} alt={item.name} className="w-full h-40 object-cover" />
                                )} */}
                                <div className="bg-black/80 p-2">
                                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <span className="text-price text-base font-bold">{item.price}</span>
                                        <span className="text-gray-400 text-sm line-through ml-2">{item.oldPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
            {/*FillerProduct*/}
            <div className="grid grid-cols-4 gap-8 px-10">
                {fillerProduct.map((item) => (
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