import { useState } from 'react';
import './ChatBot.css';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot = ({ onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Xin chào! Tôi có thể giúp gì cho bạn?', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Thêm tin nhắn của người dùng
    setMessages([...messages, { text: inputText, isBot: false }]);
    
    // Giả lập phản hồi từ bot sau 1 giây
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Cảm ơn bạn đã liên hệ. Nhân viên của chúng tôi sẽ phản hồi sớm nhất!', 
        isBot: true 
      }]);
    }, 1000);
    
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-modal">
      {/* Header */}
      <div className="bg-[#333333] text-white p-3 rounded-t-lg flex justify-between items-center">
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
          />
          <button 
            className="bg-[#333333] text-white px-4 py-2 rounded-r-md hover:bg-opacity-90"
            onClick={sendMessage}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;