import {useState, useEffect} from 'react';
import {useAuth} from '../contexts/AuthContext';
import ChatBot from './ChatBot';
import './Header.css';

const Header = () => {
    const {user, logout} = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);

    useEffect(() => {
        console.log('User data in header:', user);
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const handleImageError = (e: any) => {
        e.target.src = '/default-avatar.png';
    };

    return (
        <header className="bg-[#333333] py-3 px-6">
            <div className="container mx-auto flex justify-between items-center">
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

                <div className="w-1/3 flex justify-center">
                    <a href="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 border-2 border-white flex items-center justify-center relative">
                            <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#000000]">
                                <polygon points="50,0 100,50 50,100 0,50" />
                                <text x="50" y="65" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">
                                    T
                                </text>
                            </svg>
                        </div>
                        <div className="text-white text-xl font-bold tracking-widest">TINH TÚ</div>
                    </a>
                </div>

                <div className="w-1/3 flex justify-end items-center space-x-6">
                    <a href="/contact" className="text-white hover:text-gray-300 transition-colors hidden md:flex items-center">
                        <i className="fas fa-phone-alt"></i>
                        <span className="ml-2">Liên Hệ</span>
                    </a>
                    <a href="/cart" className="text-white hover:text-gray-300 transition-colors flex items-center">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="ml-2 hidden md:inline">Giỏ Hàng</span>
                    </a>

                    {user ? (
                        <div className="nav-item relative">
                            <div
                                className="flex items-center cursor-pointer text-white"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white mr-2">
                                    <img
                                        src={user.avatarUrl || '/default-avatar.png'}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                </div>
                                <span id="username-display">{user.name}</span>
                                <i className="fa-solid fa-chevron-down ml-2"></i>
                            </div>
                            {showDropdown && (
                                <div className="dropdown-menu absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20">
                                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Hồ Sơ
                                    </a>
                                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Cài Đặt
                                    </a>
                                    <a
                                        href="#"
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Đăng Xuất
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <a href="/login" className="text-white hover:text-gray-300 transition-colors">
                                Đăng Nhập
                            </a>
                            <a href="/register" className="text-white hover:text-gray-300 transition-colors">
                                Đăng Ký
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {showChatbot && <ChatBot onClose={() => setShowChatbot(false)} />}
        </header>
    );
};

export default Header;
