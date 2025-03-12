import React, { useState, useEffect } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

const PayWithFlutterWave = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const invoiceId = "6318-2159-9048"; // Replace with dynamic ID if needed
  const publicKey = "FLWPUBK_TEST-1c4502bfb6f511ca669c5246ffec899a-X"; // Use env variables in production
  const API_BASE_URL = "http://nofifications.fctirs.gov.ng";

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/invoice/GetSingleInvoice/${invoiceId}`
        );
        if (!response.ok) throw new Error("Failed to fetch invoice");

        const data = await response.json();
        if (data.StatusCode === 200 && data.Data.length > 0) {
          setInvoiceData(data.Data[0]);
          setIsPaymentReady(true);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoiceData();
  }, [invoiceId]);

  const submitPaymentInfo = async (paymentResponse) => {
    if (!invoiceData) return;

    const paymentData = {
      PRN: invoiceData.PRN,
      transactionRef: paymentResponse.flw_ref,
      amount: invoiceData.amount || 0,
      currency: "NGN",
      status: paymentResponse.status,
      channel: "1",
      transactionDate: new Date().toISOString(),
      invoiceId: paymentResponse.transaction_id || "Unknown Invoice",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/Notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      console.log(paymentData);

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Payment successfully submitted.");
    } catch (error) {
      console.error("Error submitting payment info:", error);
    }
  };

  const handleFlutterPayment = useFlutterwave({
    public_key: publicKey,
    tx_ref: Date.now().toString(),
    amount: invoiceData?.amount || 2000,
    currency: "NGN",
    payment_options: "card",
    customer: {
      email: invoiceData?.payerEmail || "default@example.com",
      phone_number: invoiceData?.payerPhone || "0000000000",
      name: invoiceData?.payerName || "Unknown Payer",
    },
    customizations: {
      title: "Invoice Payment",
      description: "Invoice Payment",
      logo: "https://media.istockphoto.com/id/1465234647/vector/bank-with-dollar-sign-icon.jpg",
    },
  });

  const initiatePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log("Payment Response:", response);
        if (response.status === "successful") {
          setPaymentResponse(response);
          submitPaymentInfo(response);
        } else {
          console.log("Payment failed.");
        }
        closePaymentModal();
      },
      onClose: () => console.log("Payment canceled."),
    });
  };

  return (
    <button
      className=" text-pumpkin !important font-bold p-2 rounded disabled:opacity-50"
      onClick={initiatePayment}
      disabled={!isPaymentReady}
    >
      {isPaymentReady ? "Pay Flutterwave" : "Loading..."}
    </button>
  );
};

export default PayWithFlutterWave;
