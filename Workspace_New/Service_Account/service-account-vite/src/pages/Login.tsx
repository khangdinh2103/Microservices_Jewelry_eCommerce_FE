import {useState, useEffect, useRef} from 'react';
import {useAuth} from '../contexts/AuthContext';
import HeaderLite from '../components/HeaderLite';
import Footer from '../components/Footer';
import loginImage from '../assets/images/login.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const formRef = useRef<HTMLDivElement>(null);

    const {login, loading, isAuthenticated} = useAuth();

    useEffect(() => {
        // Kiểm tra URL có param logout=true không
        const params = new URLSearchParams(window.location.search);
        if (params.get('logout') === 'true') {
            // Nếu có, xóa token và đặt lại trạng thái
            localStorage.removeItem('access_token');
            // Có thể thêm một thông báo "Đã đăng xuất thành công"
            return;
        }
        
        // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang chủ
        if (isAuthenticated) {
            window.location.href = 'http://localhost:8205/';
        }

        // Tự động scroll đến form đăng nhập
        if (formRef.current) {
            formRef.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
            // Sau khi đăng nhập thành công, chuyển hướng về catalog service
            window.location.href = 'http://localhost:8205/';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập');
        }
    };

    return (
        <>
            <HeaderLite />

            {/* Main Content - Thu gọn còn 80% chiều dài */}
            <div className="flex-grow flex bg-[#333333] text-white justify-center">
                <div className="w-4/5 flex">
                    {' '}
                    {/* 80% of screen width */}
                    {/* Left Side - Image */}
                    <div className="hidden md:block md:w-1/2 p-8">
                        <img src={loginImage} alt="Jewelry Collection" className="w-full h-full object-cover" />
                    </div>
                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                        <div ref={formRef} className="w-full max-w-md">
                            <h1 className="text-3xl font-bold mb-8 text-center">Đăng Nhập</h1>

                            {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="password"
                                        placeholder="Mật Khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end text-sm">
                                    <a href="/forgot-password" className="text-gray-300 hover:text-white">
                                        Quên Mật Khẩu?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-[#f8f3ea] text-gray-900 font-medium rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                                </button>

                                <div className="text-center mt-4">
                                    Chưa có tài khoản?{' '}
                                    <a href="/register" className="text-[#f8f3ea] hover:underline">
                                        Đăng ký
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;
