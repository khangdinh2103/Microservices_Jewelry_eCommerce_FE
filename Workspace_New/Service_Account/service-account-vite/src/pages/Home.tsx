// src/pages/Home.tsx
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const [headerHtml, setHeaderHtml] = useState('')
  const [footerHtml, setFooterHtml] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const { user, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Nếu đang tải hoặc chưa xác thực thì không làm gì
    if (loading) return;

    // Nếu không xác thực thì chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }

    // Tải fragments
    const loadFragments = async () => {
      try {
        // Tải header-auth fragment
        const headerResponse = await fetch('/fragments/header-auth.html')
        let headerText = await headerResponse.text()
        
        // Tải footer fragment
        const footerResponse = await fetch('/fragments/footer.html')
        const footerText = await footerResponse.text()
        
        // Tải nội dung trang chủ
        const contentResponse = await fetch('/fragments/home-content.html')
        let contentText = await contentResponse.text()
        
        // Thay thế placeholder trong header bằng tên người dùng thực tế
        if (user?.name) {
          headerText = headerText.replace('{{userName}}', user.name)
          contentText = contentText.replace('{{userName}}', user.name)
        }
        
        setHeaderHtml(headerText)
        setFooterHtml(footerText)
        setContentHtml(contentText)
      } catch (err) {
        console.error('Lỗi khi tải fragments:', err)
      }
    }
    
    loadFragments()
  }, [isAuthenticated, loading, user])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>
  }

  return (
    <>
      {/* Header */}
      <div dangerouslySetInnerHTML={{ __html: headerHtml }}></div>
      
      {/* Main Content */}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
      
      {/* Footer */}
      <div dangerouslySetInnerHTML={{ __html: footerHtml }}></div>
    </>
  )
}

export default Home