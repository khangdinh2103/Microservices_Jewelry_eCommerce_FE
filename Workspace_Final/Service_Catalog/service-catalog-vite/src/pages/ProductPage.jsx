import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
    const { productId } = useParams();
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-serif">Chi tiết sản phẩm {productId}</h1>
            <p>Trang này đang được phát triển...</p>
        </div>
    );
};

export default ProductPage;