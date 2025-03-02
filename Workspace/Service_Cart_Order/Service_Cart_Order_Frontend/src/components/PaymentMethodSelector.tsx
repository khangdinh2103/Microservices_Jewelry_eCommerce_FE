import React, { useState } from "react";

// Define a type for the payment option, using a string for the icon URL
interface PaymentOption {
  value: string;
  label: string;
  icon: string; // The icon is now a string URL
}

const PaymentMethodSelector = () => {
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);

  const paymentOptions: PaymentOption[] = [
    { value: "cod", label: "Thanh toán tiền mặt khi nhận hàng (COD)", icon: "https://www.pnj.com.vn/site/assets/images/cod.svg" },
    { value: "bankTransfer", label: "Thanh toán chuyển khoản", icon: "https://www.pnj.com.vn/site/assets/images/cash.svg" },
    { value: "creditCard", label: "Thanh toán thẻ quốc tế (VISA, Master, JCB)", icon: "https://www.pnj.com.vn/site/assets/images/payoo.svg" },
    { value: "installment", label: "Trả góp thẻ tín dụng 0%", icon: "https://www.pnj.com.vn/site/assets/images/payoo.svg" },
    { value: "vnpay", label: "Thanh toán VNPAY", icon: "https://www.pnj.com.vn/site/assets/images/vnpay.svg" },
    { value: "momo", label: "Thanh toán bằng ví MoMo", icon: "https://www.pnj.com.vn/site/assets/images/momo.png" },
    { value: "qr", label: "Quét mã QR", icon: "https://www.pnj.com.vn/site/assets/images/payoo.svg" },
    { value: "zalopay", label: "Thanh toán Zalopay - QR đa năng", icon: "https://www.pnj.com.vn/site/assets/images/zalopay.png" },
  ];

  const handlePaymentSelect = (paymentOption: PaymentOption) => {
    setSelectedOption(paymentOption);
  };

  return (
    <div className="payment-method bg-[#312F30] p-6 rounded-lg shadow-md">
      <h2 className="text-white mb-4">Chọn phương thức thanh toán</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {paymentOptions.map(({ value, label, icon }) => (
          <div
            key={value}
            className="flex items-center gap-3 bg-[#1D1917] p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition"
            onClick={() => handlePaymentSelect({ value, label, icon })}
          >
            <img
              src={icon}
              alt={label}
              width="24"
              height="24"
              loading="lazy"
              style={{ color: "transparent" }} // Removed border-radius class
            />
            <span className="text-white">{label}</span>
          </div>
        ))}
      </div>
      {selectedOption && (
        <p className="text-white mt-4">
          Bạn đã chọn phương thức: <strong>{selectedOption.label}</strong>
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
