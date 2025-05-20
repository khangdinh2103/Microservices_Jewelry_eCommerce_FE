import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MomoQRPayment = ({ 
  visible, 
  orderInfo, 
  qrImageData, 
  amount, 
  onClose,
  onCheckStatus,
  isVerifying
}) => {
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (!visible) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [visible]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="bg-[#d82d8b] text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="https://static.mservice.io/img/logo-momo.png" 
                alt="MoMo" 
                className="h-8 mr-2"
              />
              <h2 className="text-xl font-medium">Thanh toán MoMo</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-1">Quét mã QR để thanh toán</p>
            <p className="text-gray-800 font-medium text-xl">
              {amount.toLocaleString('vi-VN')} VNĐ
            </p>
            <div className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full inline-flex items-center mt-1">
              <i className="fas fa-clock mr-1"></i>
              <span>Hết hạn sau: {formatTime(countdown)}</span>
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="p-3 border border-gray-200 rounded-lg bg-white">
              {qrImageData ? (
                <img 
                  src={qrImageData.payUrl || qrImageData.shortLink || qrImageData} 
                  alt="Mã QR MoMo" 
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#d82d8b]"></div>
                </div>
              )}
            </div>
          </div>
          
          {orderInfo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <div className="flex items-center">
                  <span className="font-medium">{orderInfo.orderId}</span>
                  <button 
                    className="ml-1 text-gray-500 hover:text-amber-600"
                    onClick={() => copyToClipboard(orderInfo.orderId)}
                  >
                    <i className="far fa-copy"></i>
                    {copied && <span className="ml-1 text-xs text-green-600">Đã sao chép!</span>}
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-medium truncate max-w-[200px]">{orderInfo.orderInfo}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              <i className="fas fa-info-circle text-amber-600 mr-1"></i>
              Sử dụng App MoMo quét mã QR để thanh toán.
            </p>
            
            <button
              onClick={onCheckStatus}
              disabled={isVerifying}
              className={`w-full py-3 ${
                isVerifying 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#d82d8b] hover:bg-[#c12a7c]'
              } text-white rounded-lg flex items-center justify-center`}
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt mr-2"></i>
                  Tôi đã thanh toán
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy thanh toán
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MomoQRPayment;