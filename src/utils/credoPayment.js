import React, { useState, useEffect, useContext } from "react";
import { useCredoPayment } from "react-credo";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const PayWithCredoPayment = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(true);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const { paymentRequestDetails, setPaymentRequestDetails } =
    useContext(PaymentRequest);

  const invoiceId = paymentRequestDetails?.invoice.PRN;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const credoApiKey = "0PUB1029udcDDV7iY8uY8qp3XPQ5th9p";

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
      transactionRef: paymentResponse.reference,
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

  const config = {
    key: credoApiKey,
    customerFirstName: invoiceData?.payerName?.split(" ")[0] || "Unknown",
    customerLastName: invoiceData?.payerName?.split(" ")[1] || "Payer",
    email: invoiceData?.payerEmail || "default@example.com",
    amount: invoiceData?.amount || 20000,
    currency: "NGN",
    reference: Date.now().toString(),
    callbackUrl: "https://your-callback-url.com/success",
    customerPhoneNumber: invoiceData?.payerPhone || "0000000000",
    onClose: () => console.log("Payment widget closed"),
    callBack: (response) => {
      console.log("Payment Response:", response);
      if (response.status === "successful") {
        setPaymentResponse(response);
        submitPaymentInfo(response);
      } else {
        console.log("Payment failed.");
      }
    },
  };

  const initializePayment = useCredoPayment(config);

  return (
    <button
      className="text-pumpkin !important font-bold p-2 rounded disabled:opacity-50"
      onClick={initializePayment}
      disabled={!isPaymentReady}
    >
      {isPaymentReady ? "Pay with Credo" : "Loading..."}
    </button>
  );
};

export default PayWithCredoPayment;
