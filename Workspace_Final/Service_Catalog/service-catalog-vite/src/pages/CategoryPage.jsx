import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import catalogService from 'container/catalogService';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [filters, setFilters] = useState({
        brands: [],
        materials: [],
        sizes: [],
        goldKarats: [],
        colors: [],
        priceRange: { min: 0, max: 100000000 }
    });
    
    const [selectedFilters, setSelectedFilters] = useState({
        brand: [],
        material: [],
        size: [],
        goldKarat: [],
        color: [],
    });
    
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000000 });
    const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'newest'
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    
    // Mobile filters visibility
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                
                // Fetch category details
                const categoryData = await catalogService.getCategoryById(parseInt(categoryId));
                setCategory(categoryData);
                document.title = `${categoryData.name} - Tinh Tú Jewelry`;
                
                // Fetch products for this category
                const productsData = await catalogService.getProductsByCategory(parseInt(categoryId));
                setProducts(productsData);
                setFilteredProducts(productsData);
                
                // Set price range based on products
                if (productsData.length > 0) {
                    const minPrice = Math.min(...productsData.map(p => p.price));
                    const maxPrice = Math.max(...productsData.map(p => p.price));
                    setPriceRange({ min: minPrice, max: maxPrice });
                    setFilters(prev => ({...prev, priceRange: { min: minPrice, max: maxPrice }}));
                }
                
                // Fetch filter options
                const [brands, materials, sizes, goldKarats, colors] = await Promise.all([
                    catalogService.getBrandListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getMaterialListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getSizeListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getGoldKaratListByCategory(parseInt(categoryId)).catch(() => []),
                    catalogService.getColorListByCategory(parseInt(categoryId)).catch(() => [])
                ]);
                
                setFilters(prev => ({
                    ...prev,
                    brands,
                    materials,
                    sizes, 
                    goldKarats,
                    colors
                }));
            } catch (err) {
                console.error('Error fetching category data:', err);
                setError('Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategoryData();
    }, [categoryId]);
    
    // Apply filters when they change
    useEffect(() => {
        if (!products.length) return;
        
        let result = [...products];
        
        // Apply price range filter
        result = result.filter(product => 
            product.price >= priceRange.min && product.price <= priceRange.max
        );
        
        // Apply brand filter
        if (selectedFilters.brand.length > 0) {
            result = result.filter(product => selectedFilters.brand.includes(product.brand));
        }
        
        // Apply material filter
        if (selectedFilters.material.length > 0) {
            result = result.filter(product => selectedFilters.material.includes(product.material));
        }
        
        // Apply size filter
        if (selectedFilters.size.length > 0) {
            result = result.filter(product => selectedFilters.size.includes(product.size));
        }
        
        // Apply goldKarat filter
        if (selectedFilters.goldKarat.length > 0) {
            result = result.filter(product => 
                selectedFilters.goldKarat.includes(product.goldKarat?.toString())
            );
        }
        
        // Apply color filter
        if (selectedFilters.color.length > 0) {
            result = result.filter(product => selectedFilters.color.includes(product.color));
        }
        
        // Apply sorting
        switch(sortBy) {
            case 'price-low':
                result = result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result = result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result = result.sort((a, b) => 
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );
                break;
            default: // 'featured'
                // Default sorting from API
                break;
        }
        
        setFilteredProducts(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [products, selectedFilters, priceRange, sortBy]);
    
    // Handle checkbox filter change
    const handleFilterChange = (type, value, checked) => {
        setSelectedFilters(prev => {
            if (checked) {
                return { ...prev, [type]: [...prev[type], value] };
            } else {
                return { ...prev, [type]: prev[type].filter(item => item !== value) };
            }
        });
    };
    
    // Price range handlers
    const handleMinPriceChange = (value) => {
        setPriceRange(prev => ({ ...prev, min: Number(value) }));
    };
    
    const handleMaxPriceChange = (value) => {
        setPriceRange(prev => ({ ...prev, max: Number(value) }));
    };
    
    // Reset all filters
    const resetFilters = () => {
        setSelectedFilters({
            brand: [],
            material: [],
            size: [],
            goldKarat: [],
            color: [],
        });
        
        if (products.length > 0) {
            const minPrice = Math.min(...products.map(p => p.price));
            const maxPrice = Math.max(...products.map(p => p.price));
            setPriceRange({ min: minPrice, max: maxPrice });
        } else {
            setPriceRange({ min: 0, max: 100000000 });
        }
        
        setSortBy('featured');
    };
    
    // Get current products for pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Change page
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // Formatted price display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
                <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Đã xảy ra lỗi</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-medium text-gray-800 mb-2">
                    {category?.name || 'Danh mục sản phẩm'}
                </h1>
                {category?.description && (
                    <p className="text-gray-600">{category.description}</p>
                )}
            </div>
            
            {/* Mobile Filter Toggle Button */}
            <div className="md:hidden mb-4">
                <button 
                    className="w-full bg-white border border-gray-300 shadow-sm rounded-md py-2 px-4 flex items-center justify-center space-x-2"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <span>{showMobileFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
                </button>
            </div>
            
            {/* Sort & Filter Results Container */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters - Desktop: always visible, Mobile: togglable */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block md:w-1/4`}>
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-medium text-lg">Lọc sản phẩm</h3>
                            <button 
                                className="text-sm text-amber-600 hover:text-amber-800"
                                onClick={resetFilters}
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                        
                        {/* Price Range Filter */}
                        <div className="mb-6">
                            <h4 className="font-medium mb-3 text-gray-800">Khoảng giá</h4>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="range" 
                                        min={filters.priceRange.min} 
                                        max={filters.priceRange.max} 
                                        value={priceRange.min}
                                        onChange={(e) => handleMinPriceChange(e.target.value)}
                                        className="w-full accent-amber-600"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="range" 
                                        min={filters.priceRange.min} 
                                        max={filters.priceRange.max} 
                                        value={priceRange.max}
                                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                                        className="w-full accent-amber-600"
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">
                                        {formatPrice(priceRange.min)}
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        {formatPrice(priceRange.max)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Brand Filter */}
                        {filters.brands.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-800">Thương hiệu</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {filters.brands.map((brand, index) => (
                                        <div key={index} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id={`brand-${index}`}
                                                checked={selectedFilters.brand.includes(brand)}
                                                onChange={(e) => handleFilterChange('brand', brand, e.target.checked)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <label htmlFor={`brand-${index}`} className="ml-2 text-sm text-gray-700">
                                                {brand}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Material Filter */}
                        {filters.materials.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-800">Chất liệu</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {filters.materials.map((material, index) => (
                                        <div key={index} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id={`material-${index}`}
                                                checked={selectedFilters.material.includes(material)}
                                                onChange={(e) => handleFilterChange('material', material, e.target.checked)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <label htmlFor={`material-${index}`} className="ml-2 text-sm text-gray-700">
                                                {material}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Size Filter */}
                        {filters.sizes.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-800">Kích thước</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filters.sizes.map((size, index) => (
                                        <button
                                            key={index}
                                            className={`px-3 py-1 border text-sm rounded-md ${
                                                selectedFilters.size.includes(size) 
                                                    ? 'bg-amber-600 text-white border-amber-600' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-amber-600'
                                            }`}
                                            onClick={() => {
                                                const isSelected = selectedFilters.size.includes(size);
                                                handleFilterChange('size', size, !isSelected);
                                            }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Gold Karat Filter */}
                        {filters.goldKarats.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-800">Tuổi vàng</h4>
                                <div className="space-y-2">
                                    {filters.goldKarats.map((karat, index) => (
                                        <div key={index} className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id={`karat-${index}`}
                                                checked={selectedFilters.goldKarat.includes(karat)}
                                                onChange={(e) => handleFilterChange('goldKarat', karat, e.target.checked)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <label htmlFor={`karat-${index}`} className="ml-2 text-sm text-gray-700">
                                                {karat}K
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Color Filter */}
                        {filters.colors.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-medium mb-3 text-gray-800">Màu sắc</h4>
                                <div className="flex flex-wrap gap-2">
                                    {filters.colors.map((color, index) => {
                                        // Map color names to actual colors for the UI
                                        const colorMap = {
                                            "Gold": "bg-amber-500",
                                            "White Gold": "bg-gray-300",
                                            "Rose Gold": "bg-rose-300",
                                            "Silver": "bg-gray-400",
                                            "Platinum": "bg-gray-200",
                                            // Add more mappings as needed
                                        };
                                        
                                        const bgColor = colorMap[color] || "bg-gray-500";
                                        
                                        return (
                                            <button
                                                key={index}
                                                className={`w-8 h-8 rounded-full ${bgColor} ${
                                                    selectedFilters.color.includes(color)
                                                        ? 'ring-2 ring-offset-2 ring-amber-600'
                                                        : ''
                                                }`}
                                                title={color}
                                                onClick={() => {
                                                    const isSelected = selectedFilters.color.includes(color);
                                                    handleFilterChange('color', color, !isSelected);
                                                }}
                                            >
                                                <span className="sr-only">{color}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="md:w-3/4">
                    {/* Sort Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <p className="text-gray-600 mb-2 sm:mb-0">
                            Hiển thị {filteredProducts.length} sản phẩm
                        </p>
                        <div className="flex items-center">
                            <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
                                Sắp xếp theo:
                            </label>
                            <select
                                id="sort"
                                className="border-gray-300 rounded-md text-sm focus:ring-amber-500 focus:border-amber-500"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="featured">Nổi bật</option>
                                <option value="price-low">Giá: Thấp đến cao</option>
                                <option value="price-high">Giá: Cao đến thấp</option>
                                <option value="newest">Mới nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                            {currentProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                                    <Link to={`/catalog/product/${product.id}`} className="block relative">
                                        <div className="aspect-square overflow-hidden">
                                            {product.productImages && product.productImages.length > 0 ? (
                                                <img
                                                    src={product.productImages.find(img => img.isPrimary)?.imageUrl || product.productImages[0].imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400">Không có hình ảnh</span>
                                                </div>
                                            )}
                                        </div>
                                        {product.quantity < 1 && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                Hết hàng
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-4">
                                        <Link to={`/catalog/category/${product.categoryId}`} className="text-xs text-gray-500 hover:text-amber-600">
                                            {product.categoryName}
                                        </Link>
                                        <Link to={`/catalog/product/${product.id}`} className="block">
                                            <h3 className="mt-1 text-gray-800 font-medium hover:text-amber-600 transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <div className="mt-2 flex justify-between items-center">
                                            <span className="text-amber-600 font-medium">
                                                {formatPrice(product.price)}
                                            </span>
                                            <button
                                                className="text-amber-600 hover:text-amber-800"
                                                aria-label="Add to cart"
                                                title="Thêm vào giỏ hàng"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                            <p className="text-gray-600">
                                Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với các lựa chọn khác.
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center">
                                <button
                                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-l-md border ${
                                        currentPage === 1 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 hover:bg-amber-50'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                
                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    
                                    // Show limited page numbers with ellipsis
                                    if (
                                        pageNumber === 1 || 
                                        pageNumber === totalPages || 
                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => paginate(pageNumber)}
                                                className={`px-4 py-1 border-t border-b ${
                                                    currentPage === pageNumber
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-amber-50'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    } else if (
                                        (pageNumber === 2 && currentPage > 3) ||
                                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                                    ) {
                                        return (
                                            <button key={index} className="px-4 py-1 border-t border-b bg-white text-gray-400">
                                                ...
                                            </button>
                                        );
                                    }
                                    return null;
                                })}
                                
                                <button
                                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded-r-md border ${
                                        currentPage === totalPages 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 hover:bg-amber-50'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;