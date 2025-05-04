import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../config/api";
import styles from 'styles/auth.module.scss';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setMessage("Token không hợp lệ!");
            return;
        }

        try {
            const response = await resetPassword(token, newPassword);
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div className={styles["reset-password-page"]}>
            <AuthHeader />
            <main className={styles.main}>
                <div className="auth-container">
                    <h2 className="auth-title">Đặt Lại Mật Khẩu</h2>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                        <button type="submit" className="auth-button">Xác nhận</button>
                    </form>
                    {message && <p className="auth-message">{message}</p>}
                </div>
            </main>
            <AuthFooter />
            <style>
                {`
                    .auth-container {
                        max-width: 400px;
                        margin: 80px auto;
                        padding: 30px;
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        font-family: Arial, sans-serif;
                    }
                    .auth-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    .auth-form {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    .auth-input {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 16px;
                        outline: none;
                        transition: border-color 0.3s;
                    }
                    .auth-input:focus {
                        border-color: #1677ff;
                    }
                    .auth-button {
                        width: 100%;
                        padding: 12px;
                        font-size: 18px;
                        color: white;
                        background-color: #1677ff;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background 0.3s ease-in-out;
                    }
                    .auth-button:hover {
                        background-color: #125ecc;
                    }
                    .auth-message {
                        margin-top: 15px;
                        font-size: 14px;
                        color: #d9534f;
                    }
                `}
            </style>
        </div>
    );
};

export default ResetPassword;
