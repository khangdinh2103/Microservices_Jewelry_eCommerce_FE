import { useState, useEffect } from 'react'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [headerHtml, setHeaderHtml] = useState('')
  
  useEffect(() => {
    // Kiểm tra đăng nhập
    const checkAuth = async () => {
      try {
        // Kiểm tra từ localStorage
        const storedName = localStorage.getItem('userName')
        
        if (!storedName) {
          // Nếu không có trong localStorage, gọi API để kiểm tra
          const response = await fetch('http://localhost:8101/api/v1/auth/refresh', {
            method: 'GET',
            credentials: 'include',
          })
          
          if (!response.ok) {
            // Chưa đăng nhập, chuyển về trang đăng nhập
            window.location.href = '/login'
            return
          }
          
          const data = await response.json()
          if (data.data && data.data.user) {
            const name = data.data.user.name || data.data.user.email
            localStorage.setItem('userName', name)
            localStorage.setItem('userEmail', data.data.user.email || '')
          } else {
            window.location.href = '/login'
            return
          }
        }
        
        // Tải header-auth với script đã được chuẩn bị
        const response = await fetch('/fragments/header-auth.html')
        const html = await response.text()
        setHeaderHtml(html)
        setIsLoading(false)
      } catch (error) {
        console.error('Error verifying authentication:', error)
        window.location.href = '/login'
      }
    }
    
    checkAuth()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>
  }

  return (
    <div>
      {/* Sử dụng iframe để đảm bảo tất cả styles và scripts từ fragment hoạt động đúng */}
      <iframe
        srcDoc={headerHtml}
        title="Header"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      ></iframe>
    </div>
  )
}

export default Home