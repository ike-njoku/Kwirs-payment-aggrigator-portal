"use client";
import React, { useState, useEffect, useContext } from "react";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const PayWithInterswitchRedirect = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState(null);
  const [error, setError] = useState(null);

  const { paymentRequestDetails } = useContext(PaymentRequest);
  const invoiceId = paymentRequestDetails?.invoice?.PRN;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Constants for Interswitch configuration
  const MERCHANT_CODE = "6405"; // Replace with your actual merchant code
  const PAYMENT_ITEM_ID = "PAYE"; // Replace with your actual payment item ID
  const SITE_REDIRECT_URL =
    "https://notifications.fctirs.gov.ng/api/payment/confirmation";

  // Fetch invoice data
  useEffect(() => {
    if (!invoiceId) return;

    const fetchInvoiceData = async () => {
      try {
        console.log("Fetching invoice with ID:", invoiceId);
        const response = await fetch(
          `${API_BASE_URL}/api/invoice/GetSingleInvoice/${invoiceId}`
        );
        if (!response.ok) throw new Error("Failed to fetch invoice");

        const data = await response.json();
        console.log("Invoice API response:", data);

        if (data.StatusCode === 200 && data.Data.length > 0) {
          const invoice = data.Data[0];
          console.log("Setting invoice data:", invoice);
          setInvoiceData(invoice);
          prepareFormData(invoice);
          setIsPaymentReady(true);
        } else {
          throw new Error("Invalid invoice data structure");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error.message);
      }
    };

    fetchInvoiceData();
  }, [invoiceId, API_BASE_URL]);

  const prepareFormData = (invoice) => {
    try {
      if (!invoice) {
        throw new Error("Invoice data is missing");
      }

      // Create a unique transaction reference
      const txnRef = `${invoice.PRN || "INV"}_${Date.now()}`;

      // Make sure amount is a valid number
      const amount = parseFloat(invoice.amount);
      if (isNaN(amount)) {
        throw new Error("Invalid invoice amount");
      }

      // Format as kobo (multiply by 100)
      const amountInKobo = Math.floor(amount * 100);

      const formData = {
        merchant_code: MERCHANT_CODE,
        pay_item_id: PAYMENT_ITEM_ID,
        site_redirect_url: SITE_REDIRECT_URL,
        txn_ref: txnRef,
        amount: amountInKobo,
        currency: "566", // NGN currency code
        cust_name: invoice.payerName || "Unknown",
        cust_email: invoice.payerEmail || "default@example.com",
        cust_id: invoice.PRN || "Unknown",
      };

      console.log("Prepared payment form data:", formData);
      setPaymentFormData(formData);
    } catch (error) {
      console.error("Error preparing form data:", error);
      setError(error.message);
    }
  };

  const handlePayment = () => {
    // Create a form element
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://newwebpay.qa.interswitchng.com/collections/w/pay";
    form.target = "_blank"; // Open in new tab/window

    // Add all the form fields
    Object.entries(paymentFormData).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    // Add to body and submit
    document.body.appendChild(form);

    console.log("Submitting form to Interswitch:", paymentFormData);
    form.submit();

    // Clean up
    document.body.removeChild(form);
  };

  // Display any errors to the user
  if (error) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <button
          className="text-pumpkin !important font-bold p-2 rounded"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <button
      className="text-pumpkin !important font-bold p-2 rounded disabled:opacity-50"
      onClick={handlePayment}
      disabled={!isPaymentReady}
    >
      {isPaymentReady ? "Pay with Interswitch" : "Loading..."}
    </button>
  );
};

export default PayWithInterswitchRedirect;
