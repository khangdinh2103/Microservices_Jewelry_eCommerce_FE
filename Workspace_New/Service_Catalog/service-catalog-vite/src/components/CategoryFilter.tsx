import { useState } from 'react';

interface CategoryFilterProps {
  brands: string[];
  materials: string[];
  goldKarats: string[];
  sizes: string[];
  colors: string[];
  selectedBrands: string[];
  selectedMaterials: string[];
  selectedGoldKarats: string[];
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  sortBy: string;
  onFilterChange: (filterType: string, value: string | string[] | [number, number]) => void;
  onResetFilters: () => void;
}

const CategoryFilter = ({
  brands,
  materials,
  goldKarats,
  sizes,
  colors,
  selectedBrands,
  selectedMaterials,
  selectedGoldKarats,
  selectedSizes,
  selectedColors,
  priceRange,
  onFilterChange,
  onResetFilters
}: CategoryFilterProps) => {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    material: true,
    goldKarat: true,
    size: brands.length > 0,
    color: colors.length > 0,
    price: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'brand':
        onFilterChange('brands', selectedBrands.includes(value)
          ? selectedBrands.filter(b => b !== value)
          : [...selectedBrands, value]
        );
        break;
      case 'material':
        onFilterChange('materials', selectedMaterials.includes(value)
          ? selectedMaterials.filter(m => m !== value)
          : [...selectedMaterials, value]
        );
        break;
      case 'goldKarat':
        onFilterChange('goldKarats', selectedGoldKarats.includes(value)
          ? selectedGoldKarats.filter(k => k !== value)
          : [...selectedGoldKarats, value]
        );
        break;
      case 'size':
        onFilterChange('sizes', selectedSizes.includes(value)
          ? selectedSizes.filter(s => s !== value)
          : [...selectedSizes, value]
        );
        break;
      case 'color':
        onFilterChange('colors', selectedColors.includes(value)
          ? selectedColors.filter(c => c !== value)
          : [...selectedColors, value]
        );
        break;
    }
  };

  const handlePriceChange = (min: string, max: string) => {
    onFilterChange('priceRange', [parseInt(min), parseInt(max)]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Bộ lọc</h3>
        <button 
          onClick={onResetFilters}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="border-t pt-3 pb-2">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('brand')}
          >
            <h4 className="font-medium">Thương hiệu</h4>
            <span>{expandedSections.brand ? '−' : '+'}</span>
          </div>
          
          {expandedSections.brand && (
            <div className="space-y-2 max-h-48 overflow-y-auto pl-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleCheckboxChange('brand', brand)}
                  />
                  <span className="text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Material Filter */}
      {materials.length > 0 && (
        <div className="border-t pt-3 pb-2">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('material')}
          >
            <h4 className="font-medium">Chất liệu</h4>
            <span>{expandedSections.material ? '−' : '+'}</span>
          </div>
          
          {expandedSections.material && (
            <div className="space-y-2 max-h-48 overflow-y-auto pl-2">
              {materials.map((material) => (
                <label key={material} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    checked={selectedMaterials.includes(material)}
                    onChange={() => handleCheckboxChange('material', material)}
                  />
                  <span className="text-gray-700">{material}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Gold Karat Filter */}
      {goldKarats.length > 0 && (
        <div className="border-t pt-3 pb-2">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('goldKarat')}
          >
            <h4 className="font-medium">Carat vàng</h4>
            <span>{expandedSections.goldKarat ? '−' : '+'}</span>
          </div>
          
          {expandedSections.goldKarat && (
            <div className="space-y-2 max-h-48 overflow-y-auto pl-2">
              {goldKarats.sort((a, b) => parseInt(a) - parseInt(b)).map((karat) => (
                <label key={karat} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    checked={selectedGoldKarats.includes(karat)}
                    onChange={() => handleCheckboxChange('goldKarat', karat)}
                  />
                  <span className="text-gray-700">{karat}K</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Size Filter */}
      {sizes.length > 0 && (
        <div className="border-t pt-3 pb-2">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('size')}
          >
            <h4 className="font-medium">Kích thước</h4>
            <span>{expandedSections.size ? '−' : '+'}</span>
          </div>
          
          {expandedSections.size && (
            <div className="space-y-2 max-h-48 overflow-y-auto pl-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleCheckboxChange('size', size)}
                  />
                  <span className="text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color Filter */}
      {colors.length > 0 && (
        <div className="border-t pt-3 pb-2">
          <div 
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => toggleSection('color')}
          >
            <h4 className="font-medium">Màu sắc</h4>
            <span>{expandedSections.color ? '−' : '+'}</span>
          </div>
          
          {expandedSections.color && (
            <div className="space-y-2 max-h-48 overflow-y-auto pl-2">
              {colors.map((color) => (
                <label key={color} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    checked={selectedColors.includes(color)}
                    onChange={() => handleCheckboxChange('color', color)}
                  />
                  <span className="text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range Filter */}
      <div className="border-t pt-3 pb-2">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection('price')}
        >
          <h4 className="font-medium">Giá (VNĐ)</h4>
          <span>{expandedSections.price ? '−' : '+'}</span>
        </div>
        
        {expandedSections.price && (
          <div className="pl-2">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                placeholder="Từ"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceRange[0] > 0 ? priceRange[0] : ''}
                onChange={(e) => handlePriceChange(e.target.value || '0', priceRange[1].toString())}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Đến"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceRange[1] < 100000000 ? priceRange[1] : ''}
                onChange={(e) => handlePriceChange(priceRange[0].toString(), e.target.value || '100000000')}
              />
            </div>
            
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>{priceRange[0].toLocaleString('vi-VN')}</span>
              <span>{priceRange[1] === 100000000 ? 'Không giới hạn' : priceRange[1].toLocaleString('vi-VN')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;