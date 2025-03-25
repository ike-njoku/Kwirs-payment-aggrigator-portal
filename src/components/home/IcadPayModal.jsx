"use client";
import React, { useEffect } from "react";

const IcadPayModal = ({ isOpen, onClose, invoiceData }) => {
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.src =
        "https://pay-service.icadpay.com/host/new-inline-stage-pay.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen || !invoiceData) return null; // Ensure data is available

  // Function to trigger IcadPay
  const iCadPay = () => {
    const handler = IcadPay.setup({
      key: "test_YzA1MmNmYzE0OTc1Y2QyM2ViNWUwNTIxOGMzZjA2MjI5N2M4ZDU3YmY5ZDg1ZmU1OWIwNWE1NDU0YjkzYTZkOQ",
      email: invoiceData.payerEmail,
      amount: invoiceData.amount,
      currency: "NGN",
      first_name: invoiceData.payerName,
      last_name: "",
      phone_number: invoiceData.payerPhone,
      customerId: invoiceData.payerEmail,
      ref: ` ${Math.floor(Math.random() * 1000000000 + 1)}`,
      narration: invoiceData.narration,
      callback_url: "",
      callback: (response) => {
        console.log("Payment Response:", response);
      },
      onSuccess: (response) => {
        console.log("Success:", response);
        alert(`Success! Transaction ref: ${response.paymentReference}`);

        // Send the notification after successful payment
        sendPaymentNotification(response);
      },
      onError: (response) => {
        console.log("Error:", response);
        alert("Payment Failed");
      },
      onClose: () => {
        console.log("Payment window closed");
      },
    });
  };

  const sendPaymentNotification = async (paymentResponse) => {
    if (!paymentResponse || !paymentResponse.requestSuccessful) {
      console.error("Invalid payment response:", paymentResponse);
      return;
    }

    const responseData = paymentResponse.responseData;

    // Determine payment status ID
    let paymentStatusId;
    switch (paymentResponse.responseCode) {
      case "00":
        paymentStatusId = 1; // Successful
        break;
      case "RR": // Pending payment (adjust based on iCade response codes)
      case "PR":
        paymentStatusId = 2; // Pending
        break;
      default:
        paymentStatusId = 3; // Failed
        break;
    }

    const notificationPayload = {
      PRN: invoiceData.PRN,
      currency: "NGN",
      transactionRef:
        responseData.transactionRef || responseData.merchantTransactionRef,
      amount: responseData.amount,
      transactionId: responseData.paymentId,
      flw_ref: responseData.flw_ref || "",
      paymentStatusId, // Dynamic status ID
      paymentMethodId: 1, // Assuming '1' refers to CARD
      channel: "CARD",
      transactionDate: new Date().toISOString(),
    };

    // Log the payload before sending
    console.log("Notification Payload:", notificationPayload);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/Notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationPayload),
        }
      );

      const result = await res.json();
      if (res.ok) {
        console.log("Payment notification sent successfully:", result);
      } else {
        console.error("Failed to send payment notification:", result);
      }
    } catch (error) {
      console.error("Error sending payment notification:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4"> Payment Details</h2>

        <form className="flex flex-col gap-3" id="payment-form">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payer Name
            </label>
            <input
              type="text"
              className="border p-3 rounded-md w-full"
              value={invoiceData.payerName}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payer Email
            </label>
            <input
              type="text"
              className="border p-3 rounded-md w-full"
              value={invoiceData.payerEmail}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payer Phone
            </label>
            <input
              type="text"
              className="border p-3 rounded-md w-full"
              value={invoiceData.payerPhone}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Narration
            </label>
            <input
              type="text"
              className="border p-3 rounded-md w-full"
              value={invoiceData.narration}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              className="border p-3 rounded-md w-full"
              value={invoiceData.amount}
              readOnly
            />
          </div>

          <button
            type="button"
            className="bg-orange-600 text-white p-3 rounded-md mt-4"
            onClick={() => {
              iCadPay();
              onClose();
            }}
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default IcadPayModal;
