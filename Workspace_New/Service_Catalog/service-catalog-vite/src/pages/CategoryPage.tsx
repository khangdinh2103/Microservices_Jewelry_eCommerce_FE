import {useState, useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import {useProduct} from '../contexts/ProductContext';
import {Product} from '../types';
import CategoryFilter from '../components/CategoryFilter';

const CategoryPage = () => {
    const {id} = useParams<{id: string}>();
    const {
        getCategoryById,
        getProductsByCategory,
        getProductsBelowPrice,
        getProductsBetweenPrices,
        getProductsAbovePrice,
        loading,
    } = useProduct();
    const [searchParams, setSearchParams] = useSearchParams();

    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [priceFilteredProducts, setPriceFilteredProducts] = useState<Product[]>([]);
    const [isPriceFiltered, setIsPriceFiltered] = useState(false);

    // Filter states
    const [brands, setBrands] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [goldKarats, setGoldKarats] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);

    // Active filters
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [selectedGoldKarats, setSelectedGoldKarats] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
    const [sortBy, setSortBy] = useState<string>('default');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        window.scrollTo(0, 0);

        // Load filters from URL params
        const brandParam = searchParams.get('brands')?.split(',') || [];
        const materialParam = searchParams.get('materials')?.split(',') || [];
        const karatParam = searchParams.get('karats')?.split(',') || [];
        const sizeParam = searchParams.get('sizes')?.split(',') || [];
        const colorParam = searchParams.get('colors')?.split(',') || [];
        const minPrice = Number(searchParams.get('minPrice') || 0);
        const maxPrice = Number(searchParams.get('maxPrice') || 100000000);
        const sort = searchParams.get('sort') || 'default';
        const page = Number(searchParams.get('page') || 1);

        setSelectedBrands(brandParam.filter(Boolean));
        setSelectedMaterials(materialParam.filter(Boolean));
        setSelectedGoldKarats(karatParam.filter(Boolean));
        setSelectedSizes(sizeParam.filter(Boolean));
        setSelectedColors(colorParam.filter(Boolean));
        setPriceRange([minPrice, maxPrice]);
        setSortBy(sort);
        setCurrentPage(page);

        const fetchData = async () => {
            if (id) {
                const categoryData = await getCategoryById(parseInt(id));
                // console.log(categoryData);
                setCategory(categoryData);

                // Fetch products based on price filter if active
                let productsData: Product[] = [];

                if (minPrice > 0 && maxPrice < 100000000) {
                    // Between price range
                    productsData = await getProductsBetweenPrices(minPrice, maxPrice);
                    setIsPriceFiltered(true);
                } else if (minPrice > 0) {
                    // Above minimum price
                    productsData = await getProductsAbovePrice(minPrice);
                    setIsPriceFiltered(true);
                } else if (maxPrice < 100000000) {
                    // Below maximum price
                    productsData = await getProductsBelowPrice(maxPrice);
                    setIsPriceFiltered(true);
                } else {
                    // No price filter
                    productsData = await getProductsByCategory(parseInt(id));
                    setIsPriceFiltered(false);
                }

                setProducts(productsData);
                setPriceFilteredProducts(productsData);

                // Extract unique filter values
                const uniqueBrands = Array.from(new Set(productsData.map((p) => p.brand).filter(Boolean)));
                const uniqueMaterials = Array.from(new Set(productsData.map((p) => p.material).filter(Boolean)));
                const uniqueGoldKarats = Array.from(new Set(productsData.map((p) => p.goldKarat?.toString()).filter(Boolean)));
                const uniqueSizes = Array.from(new Set(productsData.map((p) => p.size).filter(Boolean)));
                const uniqueColors = Array.from(new Set(productsData.map((p) => p.color).filter(Boolean)));

                setBrands(uniqueBrands as string[]);
                setMaterials(uniqueMaterials as string[]);
                setGoldKarats(uniqueGoldKarats as string[]);
                setSizes(uniqueSizes as string[]);
                setColors(uniqueColors as string[]);
            }
        };

        fetchData();
    }, [
        id,
        getCategoryById,
        getProductsByCategory,
        getProductsBelowPrice,
        getProductsBetweenPrices,
        getProductsAbovePrice,
        searchParams,
    ]);

    // Apply filters when dependency values change
    useEffect(() => {
        let filtered = [...products];

        // Apply brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter((product) => product.brand && selectedBrands.includes(product.brand));
        }

        // Apply material filter
        if (selectedMaterials.length > 0) {
            filtered = filtered.filter((product) => product.material && selectedMaterials.includes(product.material));
        }

        // Apply gold karat filter
        if (selectedGoldKarats.length > 0) {
            filtered = filtered.filter(
                (product) => product.goldKarat && selectedGoldKarats.includes(product.goldKarat.toString())
            );
        }

        // Apply size filter
        if (selectedSizes.length > 0) {
            filtered = filtered.filter((product) => product.size && selectedSizes.includes(product.size));
        }

        // Apply color filter
        if (selectedColors.length > 0) {
            filtered = filtered.filter((product) => product.color && selectedColors.includes(product.color));
        }

        // Apply price range filter
        filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

        // Apply sorting
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name-desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when applying new filters
    }, [products, selectedBrands, selectedMaterials, selectedGoldKarats, selectedSizes, selectedColors, priceRange, sortBy]);

    // Update URL params when filters change
    useEffect(() => {
        const params: {[key: string]: string} = {};

        if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
        if (selectedMaterials.length > 0) params.materials = selectedMaterials.join(',');
        if (selectedGoldKarats.length > 0) params.karats = selectedGoldKarats.join(',');
        if (selectedSizes.length > 0) params.sizes = selectedSizes.join(',');
        if (selectedColors.length > 0) params.colors = selectedColors.join(',');
        if (priceRange[0] > 0) params.minPrice = priceRange[0].toString();
        if (priceRange[1] < 100000000) params.maxPrice = priceRange[1].toString();
        if (sortBy !== 'default') params.sort = sortBy;
        if (currentPage > 1) params.page = currentPage.toString();

        setSearchParams(params);
    }, [
        selectedBrands,
        selectedMaterials,
        selectedGoldKarats,
        selectedSizes,
        selectedColors,
        priceRange,
        sortBy,
        currentPage,
        setSearchParams,
    ]);

    const handlePriceRangeChange = async (newPriceRange: [number, number]) => {
      if (!id) return;
      
      let newProducts: Product[] = [];
      
      if (newPriceRange[0] > 0 && newPriceRange[1] < 100000000) {
        // Between price range
        newProducts = await getProductsBetweenPrices(newPriceRange[0], newPriceRange[1]);
        setIsPriceFiltered(true);
      } else if (newPriceRange[0] > 0) {
        // Above minimum price
        newProducts = await getProductsAbovePrice(newPriceRange[0]);
        setIsPriceFiltered(true);
      } else if (newPriceRange[1] < 100000000) {
        // Below maximum price
        newProducts = await getProductsBelowPrice(newPriceRange[1]);
        setIsPriceFiltered(true);
      } else {
        // Reset price filter
        newProducts = await getProductsByCategory(parseInt(id));
        setIsPriceFiltered(false);
      }
      
      setPriceRange(newPriceRange);
      setPriceFilteredProducts(newProducts);
      setProducts(newProducts);
    };
    
    // Update the filter change handler for price
    const handleFilterChange = (filterType: string, value: string | string[] | [number, number]) => {
      switch (filterType) {
        case 'brands':
          setSelectedBrands(value as string[]);
          break;
        case 'materials':
          setSelectedMaterials(value as string[]);
          break;
        case 'goldKarats':
          setSelectedGoldKarats(value as string[]);
          break;
        case 'sizes':
          setSelectedSizes(value as string[]);
          break;
        case 'colors':
          setSelectedColors(value as string[]);
          break;
        case 'priceRange':
          handlePriceRangeChange(value as [number, number]);
          break;
        case 'sortBy':
          setSortBy(value as string);
          break;
        default:
          break;
      }
    };

    // Reset all filters
    const resetFilters = async () => {
      setSelectedBrands([]);
      setSelectedMaterials([]);
      setSelectedGoldKarats([]);
      setSelectedSizes([]);
      setSelectedColors([]);
      setPriceRange([0, 100000000]);
      setSortBy('default');
      setCurrentPage(1);
      setSearchParams({});
      
      // Reset products to original category list
      if (id) {
        const productsData = await getProductsByCategory(parseInt(id));
        setProducts(productsData);
        setIsPriceFiltered(false);
      }
    };

    useEffect(() => {
      let filtered = [...products];
      
      // Apply brand filter
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => product.brand && selectedBrands.includes(product.brand));
      }
      
      // Apply material filter
      if (selectedMaterials.length > 0) {
        filtered = filtered.filter(product => product.material && selectedMaterials.includes(product.material));
      }
      
      // Apply gold karat filter
      if (selectedGoldKarats.length > 0) {
        filtered = filtered.filter(product => 
          product.goldKarat && selectedGoldKarats.includes(product.goldKarat.toString())
        );
      }
      
      // Apply size filter
      if (selectedSizes.length > 0) {
        filtered = filtered.filter(product => product.size && selectedSizes.includes(product.size));
      }
      
      // Apply color filter
      if (selectedColors.length > 0) {
        filtered = filtered.filter(product => product.color && selectedColors.includes(product.color));
      }
      
      // No need to filter by price again as we're already using the backend endpoints
      
      // Apply sorting
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'name-desc') {
        filtered.sort((a, b) => b.name.localeCompare(a.name));
      }
      
      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page when applying new filters
    }, [
      products, 
      selectedBrands,
      selectedMaterials,
      selectedGoldKarats,
      selectedSizes,
      selectedColors,
      sortBy
    ]);

    

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow bg-white">
                {/* Category Banner */}
                <section
                    className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1576723417715-89046481ddbe?q=80&w=1000&auto=format&fit=crop')",
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="container relative z-10 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">{category?.name || 'Danh Mục Sản Phẩm'}</h1>
                        <p className="text-white text-lg max-w-2xl mx-auto">
                            {category?.description || 'Khám phá bộ sưu tập trang sức tinh tế của chúng tôi'}
                        </p>
                    </div>
                </section>

                <section className="container mx-auto py-8 px-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Filter Sidebar */}
                        <div className="w-full md:w-1/4 lg:w-1/5">
                            <CategoryFilter
                                brands={brands}
                                materials={materials}
                                goldKarats={goldKarats}
                                sizes={sizes}
                                colors={colors}
                                selectedBrands={selectedBrands}
                                selectedMaterials={selectedMaterials}
                                selectedGoldKarats={selectedGoldKarats}
                                selectedSizes={selectedSizes}
                                selectedColors={selectedColors}
                                priceRange={priceRange}
                                sortBy={sortBy}
                                onFilterChange={handleFilterChange}
                                onResetFilters={resetFilters}
                            />
                        </div>

                        {/* Product Grid */}
                        <div className="w-full md:w-3/4 lg:w-4/5">
                            {/* Sort and Result Count */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                <p className="text-gray-700 mb-4 sm:mb-0">Hiển thị {filteredProducts.length} sản phẩm</p>

                                <div className="flex items-center">
                                    <label htmlFor="sort" className="mr-2 text-gray-700">
                                        Sắp xếp:
                                    </label>
                                    <select
                                        id="sort"
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    >
                                        <option value="default">Mặc định</option>
                                        <option value="price-asc">Giá: Thấp đến cao</option>
                                        <option value="price-desc">Giá: Cao đến thấp</option>
                                        <option value="name-asc">Tên: A-Z</option>
                                        <option value="name-desc">Tên: Z-A</option>
                                    </select>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                                </div>
                            ) : currentProducts.length > 0 ? (
                                <>
                                    {/* Products Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {currentProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-12">
                                            <nav className="flex items-center">
                                                <button
                                                    onClick={() => paginate(Math.max(currentPage - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-2 rounded-l-md border ${
                                                        currentPage === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    Trước
                                                </button>

                                                {/* Page numbers */}
                                                {Array.from({length: totalPages}, (_, i) => i + 1)
                                                    .filter(
                                                        (number) =>
                                                            number === 1 ||
                                                            number === totalPages ||
                                                            Math.abs(number - currentPage) <= 1
                                                    )
                                                    .map((number, index, array) => {
                                                        // Add ellipsis
                                                        if (index > 0 && array[index - 1] !== number - 1) {
                                                            return (
                                                                <span
                                                                    key={`ellipsis-${number}`}
                                                                    className="px-3 py-2 border-t border-b"
                                                                >
                                                                    ...
                                                                </span>
                                                            );
                                                        }

                                                        return (
                                                            <button
                                                                key={number}
                                                                onClick={() => paginate(number)}
                                                                className={`px-3 py-2 border-t border-b ${
                                                                    currentPage === number
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                {number}
                                                            </button>
                                                        );
                                                    })}

                                                <button
                                                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-2 rounded-r-md border ${
                                                        currentPage === totalPages
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    Sau
                                                </button>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-xl text-gray-600">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CategoryPage;
