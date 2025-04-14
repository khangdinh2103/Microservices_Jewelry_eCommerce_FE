import { Button, Form, Input, message, notification } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from 'config/api';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from 'styles/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';

// Placeholder images (thay thế bằng URL hình ảnh thực tế)
const image1 = '/public/Rectangle 2.png'; // Thay thế bằng hình ảnh thực tế
const image2 = '/public/Rectangle 3.png'; // Thay thế bằng hình ảnh thực tế
const image3 = '/public/Rectangle 4.png'; // Thay thế bằng hình ảnh thực tế

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/';
        }
    }, []);

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user));
            message.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
    };

    return (
        <div className={styles["login-page"]}>
            <header className={styles.header}>
                <img src="/public/logo.png" alt="Tinh Tử Logo" className={styles.logo} />
            </header>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles["split-container"]}>
                        {/* Phần bên trái: Bộ sưu tập hình ảnh */}
                        <div className={styles["image-section"]}>
                            <div className={styles["image-collage"]}>
                                <img src={image1} alt="Jewelry 1" className={styles["main-image"]} />
                                <div className={styles["sub-images"]}>
                                    <img src={image2} alt="Jewelry 2" className={styles["sub-image"]} />
                                    <img src={image3} alt="Jewelry 3" className={styles["sub-image"]} />
                                </div>
                            </div>
                        </div>

                        {/* Phần bên phải: Biểu mẫu đăng nhập */}
                        <section className={styles["form-section"]}>
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Nhập</h2>
                            </div>
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tên Đăng Nhập"
                                    name="username"
                                    rules={[{ required: true, message: 'Tên đăng nhập không được để trống!' }]}
                                >
                                    <Input placeholder="Tên Đăng Nhập" />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mật Khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password placeholder="Mật Khẩu" />
                                </Form.Item>

                                <div className={styles["forgot-password"]}>
                                    <Link to="/forgot-password">Quên Mật Khẩu?</Link>
                                </div>

                                <Form.Item>
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        loading={isSubmit}
                                        className={styles["login-button"]}
                                    >
                                        Đăng Nhập
                                    </Button>
                                </Form.Item>

                                <p className={styles["register-link"]}>
                                    Chưa có tài khoản? <Link to="/register">Đăng Ký</Link>
                                </p>
                            </Form>
                        </section>
                    </div>
                </div>
            </main>
            <footer className={styles.footer}>
                <div className={styles["footer-content"]}>
                    <div className={styles["footer-section"]}>
                        <h4>BỘ SƯU TẬP MỚI</h4>
                        <p>Nhẫn Cũ Kỹ Tương</p>
                        <p>Vòng Cổ Vương</p>
                        <p>Lắc Tay Bọc</p>
                    </div>
                    <div className={styles["footer-section"]}>
                        <h4>HỖ TRỢ</h4>
                        <p>Giới Thiệu</p>
                        <p>Chính Sách Bảo Hành</p>
                        <p>Chính Sách Đổi Kiện</p>
                    </div>
                    <div className={styles["footer-section"]}>
                        <h4>CHĂM SÓC KHÁCH HÀNG</h4>
                        <p>Thời Gian: 6:30AM - 21:30PM (Hằng Ngày)</p>
                        <p>LH KH: +84 999222111</p>
                        <p>Email: tinh.tu@edu.vn</p>
                    </div>
                    <div className={styles["footer-section"]}>
                        <h4>LIÊN HỆ VỚI CHÚNG TÔI</h4>
                        <div className={styles["social-icons"]}>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
                <div className={styles["footer-bottom"]}>
                    <p>Copyright © 2020 - Phát Triển Bởi Sinh Viên Đại Học Công Nghiệp TP. HCM</p>
                </div>
            </footer>
        </div>
    );
};

export default LoginPage;