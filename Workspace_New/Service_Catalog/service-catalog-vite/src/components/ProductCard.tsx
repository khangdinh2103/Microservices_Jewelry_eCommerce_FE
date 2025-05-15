import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const mainImage = product.productImages?.find(img => img.isPrimary)?.imageUrl || 
                   (product.productImages?.[0]?.imageUrl || 'https://via.placeholder.com/300');

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
    >
      <div className="h-64 overflow-hidden relative">
        <img 
          src={mainImage} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {product.brand && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-2 py-1 text-xs font-medium rounded">
            {product.brand}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          {product.material && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {product.material}
            </span>
          )}
          {product.goldKarat && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {product.goldKarat}K
            </span>
          )}
          {product.color && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {product.color}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-lg text-gray-900">{product.price.toLocaleString('vi-VN')}₫</span>
          <button className="bg-[#333333] text-white px-3 py-1 rounded-md hover:bg-opacity-90 transition-colors">
            Chi tiết
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;