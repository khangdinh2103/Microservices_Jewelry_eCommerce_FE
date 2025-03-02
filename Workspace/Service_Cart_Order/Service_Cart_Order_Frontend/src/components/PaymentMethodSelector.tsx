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
    <div className="payment-method">
      <h2 className="text-black mb-4">Chọn phương thức thanh toán</h2>
      <div className="flex flex-col gap-4">
        {paymentOptions.map(({ value, label, icon }) => (
          <div
            key={value}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-md cursor-pointer hover:bg-[#F5F5F5] transition ${selectedOption?.value === value ? "bg-[#E0E0E0]" : "bg-[#FAFAFA]"}`}
            onClick={() => handlePaymentSelect({ value, label, icon })}
          >
            <img
              src={icon}
              alt={label}
              width="24"
              height="24"
              loading="lazy"
              style={{ color: "transparent" }}
            />
            <span className="text-black">{label}</span>
          </div>
        ))}
      </div>
      {selectedOption && (
        <p className="text-black mt-4">
          Bạn đã chọn phương thức: <strong>{selectedOption.label}</strong>
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
