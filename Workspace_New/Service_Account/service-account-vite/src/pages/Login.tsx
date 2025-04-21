import { useState, useEffect } from 'react'
import loginImage from '../assets/images/login.png'

const Login = () => {
  const [headerHtml, setHeaderHtml] = useState('')
  const [footerHtml, setFooterHtml] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập
    fetch('http://localhost:8101/api/v1/auth/refresh', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        // Đã đăng nhập, chuyển hướng về trang chủ
        window.location.href = '/'
        return
      }
    })
    .catch(err => {
      console.error('Error checking auth status:', err)
    })
    
    // Tải fragment header-lite
    fetch('/fragments/header-lite.html')
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const headerContent = doc.querySelector('header')?.outerHTML || ''
        setHeaderHtml(headerContent)
      })
      .catch(err => console.error('Error loading header fragment:', err))

    // Tải fragment footer
    fetch('/fragments/footer.html')
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const footerContent = doc.querySelector('footer')?.outerHTML || ''
        setFooterHtml(footerContent)
      })
      .catch(err => console.error('Error loading footer fragment:', err))
  }, [])

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Dựa vào Service_Account_Frontend_v2 để xác định định dạng đăng nhập
      const response = await fetch('http://localhost:8101/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Quan trọng để nhận cookie từ backend
        body: JSON.stringify({
          username, // Backend sử dụng 'username' để nhận email/username
          password
        })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Đăng nhập thất bại')
      }
      
      const data = await response.json()
      
      // Lưu thông tin người dùng vào localStorage
      if (data.data && data.data.user) {
        localStorage.setItem('userName', data.data.user.name || data.data.user.email)
        localStorage.setItem('userEmail', data.data.user.email)
      }
      
      setIsLoading(false)
      
      // Chuyển hướng về trang chủ
      window.location.href = '/'
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi đăng nhập')
      console.error('Login error:', err)
    }
  }

  return (
    <>
      {/* Header */}
      <div dangerouslySetInnerHTML={{ __html: headerHtml }}></div>
      
      {/* Main Content */}
      <div className="flex-grow flex bg-[#333333] text-white">
        {/* Left Side - Image */}
        <div className="hidden md:block md:w-1/2 p-8">
          <img
            src={loginImage}
            alt="Jewelry Collection"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-8 text-center">Đăng Nhập</h1>
            
            {error && (
              <div className="bg-red-500 text-white p-3 rounded mb-4">
                {error}
              </div>
            )}
            
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
                <a href="#" className="text-gray-300 hover:text-white">
                  Quên Mật Khẩu?
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#f8f3ea] text-gray-900 font-medium rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div dangerouslySetInnerHTML={{ __html: footerHtml }}></div>
    </>
  )
}

export default Login