import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const {totalItems} = {totalItems: 0};
    const {user, isAuthenticated, loading, logout} = {
        user: {
            name: 'Nguyễn Văn A',
            avatarUrl: 'https://example.com/avatar.jpg',
        },
        isAuthenticated: true,
        loading: false,
        logout: async () => {},
    };

    const authHref = '/auth';
    const userHref = '/user';

    // Xử lý hiệu ứng cuộn trang
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async (e: any) => {
        e.preventDefault();
        try {
            await logout();
            console.log('Đăng xuất thành công');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    const handleImageError = (e) => {
        e.currentTarget.src = 'images/default.png';
    };

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (showDropdown && !event.target.closest('.nav-item')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
            ${scrolled ? 'bg-[#222222] shadow-lg py-2' : 'bg-[#333333] py-4'}`}
        >
            <div className="container mx-auto px-4 lg:px-6 flex justify-between items-center">
                <div className="w-1/3 flex justify-start">
                    <button
                        className="text-white hover:text-yellow-300 transition-colors flex items-center"
                        title="Chat Bot"
                        onClick={() => setShowChatbot(!showChatbot)}
                    >
                        <i className="fas fa-comment text-xl"></i>
                        <span className="ml-2 hidden md:inline font-medium">Chat Bot</span>
                    </button>
                </div>

                <div className="w-1/3 flex justify-center">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 border-2 border-white flex items-center justify-center relative group-hover:border-yellow-300 transition-colors">
                            <svg viewBox="0 0 100 100" className="w-10 h-10 fill-[#000000]">
                                <polygon points="50,0 100,50 50,100 0,50" />
                                <text x="50" y="65" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">
                                    T
                                </text>
                            </svg>
                        </div>
                        <div className="text-white text-xl font-bold tracking-widest group-hover:text-yellow-300 transition-colors">
                            TINH TÚ
                        </div>
                    </Link>
                </div>

                <div className="w-1/3 flex justify-end items-center space-x-6">
                    <Link
                        to="/contact"
                        className="text-white hover:text-yellow-300 transition-colors hidden md:flex items-center"
                    >
                        <i className="fas fa-phone-alt"></i>
                        <span className="ml-2 font-medium">Liên Hệ</span>
                    </Link>

                    {/* Giỏ Hàng với số lượng sản phẩm */}
                    <Link to="/cart" className="text-white hover:text-yellow-300 transition-colors flex items-center relative">
                        <i className="fas fa-shopping-cart text-lg"></i>
                        <span className="ml-2 hidden md:inline font-medium">Giỏ Hàng</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {loading ? (
                        <div className="text-white">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : isAuthenticated && user ? (
                        <div className="nav-item relative">
                            <div
                                className="flex items-center cursor-pointer text-white hover:text-yellow-300 transition-colors"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white hover:border-yellow-300 transition-colors mr-2">
                                    <img
                                        src={user.avatarUrl || '/default-avatar.png'}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                </div>
                                <span id="username-display" className="font-medium">
                                    {user.name}
                                </span>
                                <i
                                    className={`fa-solid ${
                                        showDropdown ? 'fa-chevron-up' : 'fa-chevron-down'
                                    } ml-2 transition-transform`}
                                ></i>
                            </div>
                            {showDropdown && (
                                <div className="dropdown-menu absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20 animate-fadeIn">
                                    <a
                                        href={`${userHref}/profile`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                                    >
                                        <i className="fas fa-user mr-2"></i>Hồ Sơ
                                    </a>
                                    <a
                                        href={`${userHref}/settings`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                                    >
                                        <i className="fas fa-cog mr-2"></i>Cài Đặt
                                    </a>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <a
                                        href="#"
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <i className="fas fa-sign-out-alt mr-2"></i>Đăng Xuất
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <a
                                href={`${authHref}/login`}
                                className="text-white hover:text-yellow-300 transition-colors font-medium"
                            >
                                <i className="fas fa-sign-in-alt mr-1"></i> Đăng Nhập
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
