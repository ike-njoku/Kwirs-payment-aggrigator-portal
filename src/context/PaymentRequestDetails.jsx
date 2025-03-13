"use client";
import React, { createContext, useState, useEffect } from "react";

export const PaymentRequest = createContext();

const PaymentRequestDetails = ({ children }) => {
  const [paymentRequestDetails, setPaymentRequestDetails] = useState({});

  useEffect(() => {
    localStorage.setItem(
      "paymentDetails",
      JSON.stringify(paymentRequestDetails)
    );
  }, [paymentRequestDetails]);

  const contextValue = {
    paymentRequestDetails,
    setPaymentRequestDetails,
  };

  return (
    <PaymentRequest.Provider value={contextValue}>
      {children}
    </PaymentRequest.Provider>
  );
};

export default PaymentRequestDetails;
