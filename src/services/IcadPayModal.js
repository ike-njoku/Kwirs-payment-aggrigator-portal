"use client";
import React, { useEffect } from "react";
import Script from "next/script";

const IcadPayModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Load the script dynamically when the modal is open
      const script = document.createElement("script");
      script.src = "https://pay-service.icadpay.com/host/new-inline-stage-pay.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script); // Cleanup script when modal closes
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const iCadPay = () => {
    const form = document.getElementById("payment-form");

    const handler = IcadPay.setup({
      key: "test_YzA1MmNmYzE0OTc1Y2QyM2ViNWUwNTIxOGMzZjA2MjI5N2M4ZDU3YmY5ZDg1ZmU1OWIwNWE1NDU0YjkzYTZkOQ", // Demo key
      email: document.getElementById("email").value,
      amount: document.getElementById("amount").value,
      currency: "NGN",
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
      phone_number: document.getElementById("phone").value,
      customerId: document.getElementById("email").value,
      ref: `${Math.floor(Math.random() * 1000000000) + 1}`,
      narration: document.getElementById("narration").value,
      callback_url: "http://localhost:3000/",
      meta: {
        consumer_id: "data.customer_id",
        item_ref: "payment.res",
      },
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

    // Close the modal after opening the payment
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="absolute top-3 right-3 text-black text-xl" onClick={onClose}>
            &times;
          </button>

          <h2 className="text-lg font-bold mb-4">Complete Payment</h2>

          <form className="flex flex-col gap-3" id="payment-form">
            <input type="text" className="border p-3 rounded-md" id="firstName" placeholder="Enter First Name" name="firstName" />
            <input type="text" className="border p-3 rounded-md" id="lastName" placeholder="Enter Last Name" name="lastName" />
            <input type="text" className="border p-3 rounded-md" id="email" placeholder="Enter Email" name="email" />
            <input type="text" className="border p-3 rounded-md" id="phone" placeholder="Enter Phone" name="phone" />
            <input type="text" className="border p-3 rounded-md" id="narration" placeholder="Enter Narration" name="narration" />
            <input type="text" className="border p-3 rounded-md" id="amount" placeholder="Enter Amount" name="amount" />

            <button type="button" className="bg-blue-600 text-white p-3 rounded-md" onClick={iCadPay}>
              Submit Payment
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default IcadPayModal;
