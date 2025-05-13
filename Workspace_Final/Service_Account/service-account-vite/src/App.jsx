import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from 'container/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;