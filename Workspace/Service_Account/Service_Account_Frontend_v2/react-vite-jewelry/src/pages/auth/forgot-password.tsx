import { useState } from "react";
import { forgotPassword } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await forgotPassword(email);
            setMessage(response.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <div style={styles.authContainer}>
            <h2 style={styles.title}>Quên Mật Khẩu</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Gửi mã xác nhận</button>
            </form>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

export default ForgotPassword;

const styles: { [key: string]: CSSProperties } = {
    authContainer: {
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",  // ✅ Được TypeScript nhận diện đúng
    },
    title: {
        marginBottom: "20px",
        fontSize: "24px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        fontSize: "16px",
        outline: "none",
    },
    button: {
        width: "100%",
        padding: "12px",
        fontSize: "18px",
        color: "white",
        backgroundColor: "#1677ff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background 0.3s ease-in-out",
    },
    message: {
        marginTop: "15px",
        fontSize: "14px",
        color: "#333",
    },
};
