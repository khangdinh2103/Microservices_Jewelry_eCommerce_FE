import { useState, useEffect } from 'react'
import loginImage from '../assets/images/login.png'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [headerHtml, setHeaderHtml] = useState('')
  const [footerHtml, setFooterHtml] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { login, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang chủ
    if (isAuthenticated) {
      window.location.href = '/'
      return
    }
    
    // Tải fragment header và footer
    const loadFragments = async () => {
      try {
        const [headerResponse, footerResponse] = await Promise.all([
          fetch('/fragments/header-lite.html'),
          fetch('/fragments/footer.html')
        ])
        
        const headerText = await headerResponse.text()
        const footerText = await footerResponse.text()
        
        const headerParser = new DOMParser()
        const footerParser = new DOMParser()
        
        const headerDoc = headerParser.parseFromString(headerText, 'text/html')
        const footerDoc = footerParser.parseFromString(footerText, 'text/html')
        
        const headerContent = headerDoc.querySelector('header')?.outerHTML || ''
        const footerContent = footerDoc.querySelector('footer')?.outerHTML || ''
        
        setHeaderHtml(headerContent)
        setFooterHtml(footerContent)
      } catch (err) {
        console.error('Lỗi khi tải fragments:', err)
      }
    }
    
    loadFragments()
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await login(username, password)
      // Sau khi đăng nhập thành công, chuyển hướng về trang chủ
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập')
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