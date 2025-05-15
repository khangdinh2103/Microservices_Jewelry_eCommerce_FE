import { useAuth } from '../contexts/AuthContext';

const HomeContent = () => {
  const { user } = useAuth();
  
  return (
    <main className="bg-white">
      {/* Banner */}
      <section className="relative h-[500px] bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1588686693350-f2751be963e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chào mừng, {user?.name}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">Khám phá bộ sưu tập trang sức xa xỉ mới nhất của chúng tôi</p>
          <a href="#collections" className="mt-8 px-8 py-3 bg-[#f8f3ea] text-gray-900 hover:bg-opacity-90 transition-colors font-medium rounded-md">
            Khám phá ngay
          </a>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Bộ Sưu Tập Nổi Bật</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collection 1 */}
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="Diamond Collection" 
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bộ Sưu Tập Kim Cương</h3>
              <p className="text-gray-600 mb-4">Khám phá vẻ đẹp vĩnh cửu của kim cương với thiết kế độc quyền.</p>
              <a href="#" className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors">
                Khám phá thêm
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            {/* Collection 2 */}
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80" 
                  alt="Gold Collection" 
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bộ Sưu Tập Vàng</h3>
              <p className="text-gray-600 mb-4">Sự sang trọng tinh tế kết hợp với nghệ thuật chế tác truyền thống.</p>
              <a href="#" className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors">
                Khám phá thêm
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
            
            {/* Collection 3 */}
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1635767798638-3665a293d406?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80" 
                  alt="Pearl Collection" 
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bộ Sưu Tập Ngọc Trai</h3>
              <p className="text-gray-600 mb-4">Vẻ đẹp thuần khiết, thanh lịch với những viên ngọc trai quý giá.</p>
              <a href="#" className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors">
                Khám phá thêm
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeContent;