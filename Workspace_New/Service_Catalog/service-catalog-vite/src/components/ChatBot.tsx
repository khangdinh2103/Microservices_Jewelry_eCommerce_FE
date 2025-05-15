import { useState } from 'react';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

interface ChatBotProps {
  onClose: () => void;
}

interface ChatResponse {
  response: string;
  redirect?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      isBot: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    // Thêm tin nhắn của người dùng
    setMessages([...messages, { text: inputText, isBot: false }]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Gọi API endpoint
      const response = await fetch('http://localhost:8109/api/v1/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputText }),
      });
      
      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi kết nối với chatbot');
      }
      
      const data: ChatResponse = await response.json();
      
      // Thêm phản hồi từ bot
      setMessages(prev => [...prev, { 
        text: data.response, 
        isBot: true 
      }]);
  
      // Kiểm tra và xử lý redirect nếu có
      if (data.redirect) {
        // Thông báo cho người dùng biết sẽ chuyển hướng
        setMessages(prev => [...prev, { 
          text: `Đang chuyển hướng đến trang sản phẩm...`, 
          isBot: true 
        }]);
        
        // Chờ một chút để người dùng có thể đọc thông báo
        setTimeout(() => {
          window.location.href = data.redirect as string;
        }, 1500);
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      // Hiển thị thông báo lỗi trong chat
      setMessages(prev => [...prev, { 
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
    
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-modal fixed bottom-0 left-0 flex flex-col w-100 bg-white shadow-lg z-50 h-[calc(100vh-96px)]">
      {/* Header */}
      <div className="bg-[#333333] text-white p-3 flex justify-between items-center">
        <h3 className="font-medium">Chat Bot</h3>
        <button onClick={onClose} className="hover:text-gray-300">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {/* Chat content */}
      <div className="flex-grow p-3 overflow-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-3 ${msg.isBot ? '' : 'text-right'}`}>
            <div className={`p-2 rounded-lg inline-block ${msg.isBot ? 'bg-[#333333] text-white' : 'bg-blue-500 text-white'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-3">
            <div className="p-2 rounded-lg inline-block bg-[#333333] text-white">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t">
        <div className="flex">
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            className="flex-grow p-2 border rounded-l-md focus:outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button 
            className={`bg-[#333333] text-white px-4 py-2 rounded-r-md ${isLoading ? 'opacity-50' : 'hover:bg-opacity-90'}`}
            onClick={sendMessage}
            disabled={isLoading}
          >
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;