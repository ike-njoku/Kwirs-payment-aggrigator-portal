import React, { useState, useEffect, useContext } from "react";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const PayWithRemita = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const { paymentRequestDetails } = useContext(PaymentRequest);

  const invoiceId = paymentRequestDetails?.invoice.PRN;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const remitaPublicKey = process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY;

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://remitademo.net/payment/v1/remita-pay-inline.bundle.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const submitPaymentInfo = async (paymentResponse) => {
    if (!invoiceData) return;

    const paymentData = {
      PRN: invoiceData.PRN,
      transactionRef: paymentResponse.paymentReference,
      amount: invoiceData.amount || 0,
      currency: "NGN",
      status: paymentResponse.paymentReference ? "success" : "pending",
      channel: "1",
      transactionDate: new Date().toISOString(),
      invoiceId: invoiceData.PRN,
    };

    console.log("Payment data ready:", paymentData);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payment/NotificationREMITA`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Payment successfully submitted.");
    } catch (error) {
      console.error("Error submitting payment info:", error);
    }
  };

  const generateRRR = async () => {
    try {
      const res = await fetch("/api/remita/generateRRR", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: "4420731",
          amount: invoiceData?.amount.toString() || "2000",
          orderId: invoiceData?.PRN || "INVOICE-0001",
          payerName: invoiceData?.payerName || "John Doe",
          payerEmail: invoiceData?.payerEmail || "doe@gmail.com",
          payerPhone: invoiceData?.payerPhone || "09062067384",
          description: "Payment for invoice",
        }),
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      console.log("RRR response from server:", json);
      return json?.RRR || null;
    } catch (error) {
      console.error("Error generating RRR:", error);
      return null;
    }
  };

  const initiateRemitaPayment = async () => {
    if (!invoiceData || typeof window.RmPaymentEngine === "undefined") return;

    // const rrr = await generateRRR();
    // if (!rrr) return;

    const paymentEngine = window.RmPaymentEngine.init({
      key: "QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=",
      customerId: invoiceData?.payerId || "UnknownCustomer",
      firstName: invoiceData?.payerName?.split(" ")[0] || "John",
      lastName: invoiceData?.payerName?.split(" ")[1] || "Doe",
      email: invoiceData?.payerEmail || "default@example.com",
      amount: invoiceData?.amount || 2000,
      narration: "Invoice Payment",
      // rrr: rrr, // Optional: Use if you have a pre-generated RRR
      transactionId: invoiceData?.PRN,

      onSuccess: function (response) {
        console.log("Payment Success Response:", response);
        setPaymentResponse(response);
        submitPaymentInfo(response);
      },

      onError: function (response) {
        console.log("Payment Error Response:", response);
        setPaymentResponse(response);
        submitPaymentInfo(response);
      },

      onClose: function () {
        console.log("Payment window closed.");
        const noResponse = {
          paymentReference: "",
          status: "",
        };
        setPaymentResponse(noResponse);
        submitPaymentInfo(noResponse);
      },
    });


    paymentEngine.showPaymentWidget();
  };

  return (
    <button
      className="text-pumpkin font-bold p-2 rounded disabled:opacity-50"
      onClick={initiateRemitaPayment}
      disabled={!isPaymentReady}
    >
      {isPaymentReady ? "Pay with Remita" : "Loading..."}

      {/* 5399830000000008
          05/30
          111 
          123456  
          1707-9904-1273
          170799041273
*/}
    </button>
  );
};

export default PayWithRemita;
