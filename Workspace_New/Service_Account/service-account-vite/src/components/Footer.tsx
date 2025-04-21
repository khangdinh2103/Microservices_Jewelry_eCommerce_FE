const Footer = () => {
  return (
    <footer className="bg-[#1e1e1e] text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bộ Trang Sức Mới Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Bộ Trang Sức Mới</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nhẫn Kim Cương</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Vòng Cổ Vàng</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Lắc Tay Bạc</a></li>
            </ul>
          </div>

          {/* Hỗ Trợ Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Hỗ Trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Giải Đáp</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Điều Khoản & Điều Kiện</a></li>
            </ul>
          </div>

          {/* Chăm Sóc Khách Hàng Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Chăm Sóc Khách Hàng</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Thời Gian: 6.30AM-21.30PM (Hai-Bảy)</li>
              <li className="text-gray-400">Liên Hệ: +84 999222211</li>
              <li className="text-gray-400">Email: tinhtu@iuh.edu.vn</li>
            </ul>
          </div>
        </div>

        {/* Liên hệ với chúng tôi button */}
        <div className="mt-10 mb-8 text-right">
          <a href="#" className="inline-flex items-center border-b-2 border-white pb-1 hover:text-gray-300 transition-colors group">
            <span className="text-lg">Liên Hệ Với Chúng Tôi</span>
            <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
          </a>
        </div>

        {/* Social Media and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-700">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-pinterest-p"></i>
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
          <div className="text-gray-400 text-sm">
            Copyright © 2020 - Phát Triển Bởi Sinh Viên Đại học Công Nghiệp Tp. HCM
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;