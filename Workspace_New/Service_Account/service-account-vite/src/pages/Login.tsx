import { useState, useEffect } from 'react'
import loginImage from '../assets/images/login.png'

const Login = () => {
  const [headerHtml, setHeaderHtml] = useState('')
  const [footerHtml, setFooterHtml] = useState('')

  useEffect(() => {
    // Tải fragment header-lite
    fetch('/fragments/header-lite.html')
      .then(response => response.text())
      .then(html => {
        // Chỉ giữ lại phần nội dung header, loại bỏ html, head, body tags
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
        // Chỉ giữ lại phần nội dung footer, loại bỏ html, head, body tags
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const footerContent = doc.querySelector('footer')?.outerHTML || ''
        setFooterHtml(footerContent)
      })
      .catch(err => console.error('Error loading footer fragment:', err))
  }, [])

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
            
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Tên Đăng Nhập"
                  className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Mật Khẩu"
                  className="w-full px-4 py-3 bg-[#454545] text-white rounded-md focus:outline-none"
                />
              </div>
              
              <div className="flex justify-end text-sm">
                <a href="#" className="text-gray-300 hover:text-white">
                  Quên Mật Khẩu?
                </a>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-[#f8f3ea] text-gray-900 font-medium rounded-md hover:bg-opacity-90 transition-colors"
              >
                Đăng Nhập
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