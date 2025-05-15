import React from 'react';

const HomePage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-10 text-center">
                <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-800 mb-4">
                    Chào mừng đến với <span className="text-amber-700">Tinh Tú Jewelry</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Khám phá bộ sưu tập trang sức tinh xảo với những thiết kế độc đáo, mang đến vẻ đẹp tinh tế và đẳng
                    cấp cho
                    người sở hữu.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="/catalog"
                        className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition font-medium"
                    >
                        Xem Bộ Sưu Tập
                    </a>
                    <a
                        href="/contact"
                        className="px-6 py-3 border border-amber-600 text-amber-700 rounded-md hover:bg-amber-50 transition font-medium"
                    >
                        Liên Hệ Tư Vấn
                    </a>
                </div>
            </div>

            {/* Phần nội dung khác của trang chủ có thể được thêm vào đây */}
        </div>
    );
};

export default HomePage;
