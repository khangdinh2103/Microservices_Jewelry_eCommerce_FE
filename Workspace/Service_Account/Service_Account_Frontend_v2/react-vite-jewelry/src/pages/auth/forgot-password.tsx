import { useState } from "react";
import { forgotPassword } from "../../config/api";
import { useNavigate } from "react-router-dom";
import styles from 'styles/auth.module.scss';
import { Button, Form, Input, message, notification } from 'antd';


// Đường dẫn hình ảnh (giống LoginPage)
const image1 = '/public/Rectangle 2.png'; // Hình ảnh lớn
const image2 = '/public/Rectangle 3.png'; // Hình ảnh nhỏ 1
const image3 = '/public/Rectangle 4.png'; // Hình ảnh nhỏ 2


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: { email: string }) => {
        const { email } = values;
        setIsSubmit(true);
        try {
            const response = await forgotPassword(email);
            message.success(response.data.message);
            // Chuyển hướng sau khi gửi thành công (tùy thuộc vào logic của bạn)
            // navigate('/reset-password');
        } catch (error: any) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: error.response?.data?.message || "Có lỗi xảy ra!",
                duration: 5,
            });
        } finally {
            setIsSubmit(false);
        }
    };

    return (
        <div className={styles["forgot-password-page"]}>
            {/* Thêm logo vào header giống LoginPage */}
            <header className={styles.header}>
                <img src="/public/logo.png" alt="Tinh Tử Logo" className={styles.logo} />
            </header>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles["split-container"]}>
                        {/* Phần bên trái: Bộ sưu tập hình ảnh (giống LoginPage) */}
                        <div className={styles["image-section"]}>
                            <div className={styles["image-collage"]}>
                                <img src={image1} alt="Jewelry 1" className={styles["main-image"]} />
                                <div className={styles["sub-images"]}>
                                    <img src={image2} alt="Jewelry 2" className={styles["sub-image"]} />
                                    <img src={image3} alt="Jewelry 3" className={styles["sub-image"]} />
                                </div>
                            </div>
                        </div>

                        {/* Phần bên phải: Biểu mẫu quên mật khẩu */}
                        <section className={styles["form-section"]}>
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>
                                    Quên Mật Khẩu
                                </h2>
                            </div>
                            <Form
                                name="forgot-password"
                                onFinish={onFinish}
                                autoComplete="off"
                                className={styles["login-form"]}
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                                >
                                    <Input placeholder="Nhập email của bạn" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        loading={isSubmit}
                                        className={styles["login-button"]}
                                    >
                                        Gửi mã xác nhận
                                    </Button>
                                </Form.Item>
                            </Form>
                        </section>
                    </div>
                </div>
            </main>
            {/* Chân trang giống LoginPage */}
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

export default ForgotPassword;