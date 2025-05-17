import {useState, useRef, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import HeaderLite from '../components/HeaderLite';
import Footer from '../components/Footer';
import registerImage from '../assets/images/register.png';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        gender: 'MALE',
        age: 18,
        address: '',
    });

    useEffect(() => {
        // Tự động scroll đến form đăng ký
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: name === 'age' ? parseInt(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email không hợp lệ');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8101/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    gender: formData.gender,
                    age: formData.age,
                    address: formData.address,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Đăng ký thất bại');
            }

            // Registration successful
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Đã xảy ra lỗi khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderLite />

            {/* Main Content - Thu gọn còn 80% chiều dài */}
            <div className="flex-grow flex bg-[#333333] text-white justify-center">
                <div className="w-4/5 flex"> {/* 80% of screen width */}
                    {/* Left Side - Image */}
                    <div className="hidden md:block md:w-1/2 p-8">
                        <img
                            src={registerImage || '/default-avatar.png'}
                            alt="Jewelry Collection"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                        <div ref={formRef} className="w-full max-w-md">
                            <h1 className="text-3xl font-bold mb-8 text-center">Đăng Ký Tài Khoản</h1>

                            {error && <div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>}

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                                        Mật khẩu
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Mật khẩu"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Xác nhận mật khẩu"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Họ và tên
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Họ và tên"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium mb-1">
                                            Giới tính
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                            required
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="age" className="block text-sm font-medium mb-1">
                                            Tuổi
                                        </label>
                                        <input
                                            id="age"
                                            type="number"
                                            name="age"
                                            placeholder="Tuổi"
                                            min="18"
                                            max="100"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                                        Địa chỉ
                                    </label>
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        placeholder="Địa chỉ"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-[#f8f3ea] text-gray-900 font-medium rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                                    </button>
                                </div>

                                <div className="text-center mt-4">
                                    Đã có tài khoản?{' '}
                                    <a href="/login" className="text-[#f8f3ea] hover:underline">
                                        Đăng nhập
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

export default Register;