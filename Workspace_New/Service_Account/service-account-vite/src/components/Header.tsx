import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatBot from './ChatBot';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Đã chuyển hướng trong hàm logout
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <header className="bg-[#333333] py-3 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Chatbot */}
        <div className="w-1/3 flex justify-start">
          <button 
            className="text-white hover:text-gray-300 transition-colors" 
            title="Chat Bot"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            <i className="fas fa-comment text-xl"></i>
            <span className="ml-2 hidden md:inline">Chat Bot</span>
          </button>
        </div>

        {/* Center - Logo */}
        <div className="w-1/3 flex justify-center">
          <a href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 border-2 border-white flex items-center justify-center relative">
              {/* Diamond shaped logo with T letter */}
              <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#000000]">
                <polygon points="50,0 100,50 50,100 0,50" />
                <text x="50" y="65" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">T</text>
              </svg>
            </div>
            <div className="text-white text-xl font-bold tracking-widest">TINH TÚ</div>
          </a>
        </div>

        {/* Right Side - Navigation */}
        <div className="w-1/3 flex justify-end items-center space-x-6">
          <a href="/contact" className="text-white hover:text-gray-300 transition-colors hidden md:flex items-center">
            <i className="fas fa-phone-alt"></i>
            <span className="ml-2">Liên Hệ</span>
          </a>
          <a href="/cart" className="text-white hover:text-gray-300 transition-colors flex items-center">
            <i className="fas fa-shopping-cart"></i>
            <span className="ml-2 hidden md:inline">Giỏ Hàng</span>
          </a>
          <div className="nav-item relative">
            <div 
              className="flex items-center cursor-pointer text-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span id="username-display">{user?.name}</span>
              <i className="fa-solid fa-chevron-down ml-2"></i>
            </div>
            {showDropdown && (
              <div className="dropdown-menu block">
                <a href="/profile">Hồ Sơ</a>
                <a href="/settings">Cài Đặt</a>
                <a href="#" onClick={handleLogout}>Đăng Xuất</a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chatbot component */}
      {showChatbot && <ChatBot onClose={() => setShowChatbot(false)} />}
    </header>
  );
};

export default Header;