"use client";
import React, { createContext, useState, useEffect } from "react";

export const PaymentRequest = createContext();

const PaymentRequestDetails = ({ children }) => {
  const [paymentRequestDetails, setPaymentRequestDetails] = useState({});
  const [paymentPRN, setPaymentPRN] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "paymentDetails",
      JSON.stringify(paymentRequestDetails)
    );
  }, [paymentRequestDetails]);

  useEffect(() => {
    localStorage.setItem("paymentPRN", paymentPRN);
  }, [paymentPRN]);

  const contextValue = {
    paymentRequestDetails,
    setPaymentRequestDetails,
    paymentPRN,
    setPaymentPRN,
  };

  return (
    <PaymentRequest.Provider value={contextValue}>
      {children}
    </PaymentRequest.Provider>
  );
};

export default PaymentRequestDetails;
