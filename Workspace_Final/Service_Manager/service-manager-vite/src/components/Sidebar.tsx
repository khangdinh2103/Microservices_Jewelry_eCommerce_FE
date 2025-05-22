import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Sản phẩm', path: '/manager', icon: 'fas fa-box-open' },
    { name: 'Dashboard', path: '/manager/dashboard', icon: 'fas fa-chart-line' },
    { name: 'Danh mục', path: '/manager/categories', icon: 'fas fa-folder-open' },
    { name: 'Đơn hàng', path: '/manager/orders', icon: 'fas fa-shopping-cart' },
    { name: 'Khách hàng', path: '/manager/customers', icon: 'fas fa-users' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 px-2 fixed top-0 left-0 h-full overflow-y-auto mt-[90px] z-10 transform md:translate-x-0 transition duration-200 ease-in-out">      
      <nav>
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded-lg transition-colors mb-1 ${
                isActive 
                  ? 'bg-gray-700 text-amber-400' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-amber-300'
              }`
            }
            end={item.path === '/'}
          >
            <i className={`${item.icon} w-5 mr-3`}></i>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="border-t border-gray-700 pt-4 mt-6">
        <a href="/" className="flex items-center py-2 px-4 text-gray-300 hover:text-amber-300">
          <i className="fas fa-home mr-3 w-5"></i>
          <span>Về trang chủ</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;