"use client";
import React, { useEffect } from "react";

const IcadPayModal = ({ isOpen, onClose, invoiceData }) => {
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.src = "https://pay-service.icadpay.com/host/new-inline-stage-pay.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen || !invoiceData) return null; // Ensure data is available

  const iCadPay = () => {
    const handler = IcadPay.setup({
      key: "test_YzA1MmNmYzE0OTc1Y2QyM2ViNWUwNTIxOGMzZjA2MjI5N2M4ZDU3YmY5ZDg1ZmU1OWIwNWE1NDU0YjkzYTZkOQ",
      email: invoiceData.payerEmail,
      amount: invoiceData.amount,
      currency: "NGN",
      first_name: invoiceData.payerName,
      last_name: "", // Not available in API
      phone_number: invoiceData.payerPhone,
      customerId: invoiceData.payerEmail,
      ref: invoiceData.PRN,
      narration: invoiceData.narration,
      callback_url: "https://icadpay.com",
      callback: (response) => {
        console.log("Payment Response:", response);
      },
      onSuccess: (response) => {
        console.log("Success:", response);
        alert(`Success! Transaction ref: ${response.paymentReference}`);
      },
      onError: (response) => {
        console.log("Error:", response);
        alert("Payment Failed");
      },
      onClose: () => {
        console.log("Payment window closed");
      },
    });

    handler.openIframe();
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
  <div className="bg-white rounded-lg p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
    <button className="absolute top-3 right-3 text-black text-xl" onClick={onClose}>
      &times;
    </button>

    <h2 className="text-lg font-bold mb-4">Complete Payment</h2>

    <form className="flex flex-col gap-3" id="payment-form">
      <div>
        <label className="block text-sm font-medium text-gray-700">Payer Name</label>
        <input type="text" className="border p-3 rounded-md w-full" value={invoiceData.payerName} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Payer Email</label>
        <input type="text" className="border p-3 rounded-md w-full" value={invoiceData.payerEmail} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Payer Phone</label>
        <input type="text" className="border p-3 rounded-md w-full" value={invoiceData.payerPhone} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Narration</label>
        <input type="text" className="border p-3 rounded-md w-full" value={invoiceData.narration} readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input type="text" className="border p-3 rounded-md w-full" value={invoiceData.amount} readOnly />
      </div>

      <button type="button" className="bg-blue-600 text-white p-3 rounded-md mt-4" onClick={iCadPay}>
        Submit Payment
      </button>
    </form>
  </div>
</div>

  );
};

export default IcadPayModal;
