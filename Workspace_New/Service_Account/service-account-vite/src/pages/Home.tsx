import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomeContent from '../components/HomeContent';

const Home = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Nếu đang tải hoặc chưa xác thực thì không làm gì
    if (loading) return;

    // Nếu không xác thực thì chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  }

  return (
    <>
      <Header />
      <HomeContent />
      <Footer />
    </>
  );
};

export default Home;