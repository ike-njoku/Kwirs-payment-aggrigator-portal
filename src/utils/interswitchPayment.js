// "use client";
import React, { useState, useEffect, useContext } from "react";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const PayWithInterswitch = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [formData, setFormData] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState(null);

  const { paymentRequestDetails } = useContext(PaymentRequest);
  const invoiceId = paymentRequestDetails?.invoice?.PRN;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Constants for Interswitch configuration - hard code these for debugging
  const MERCHANT_CODE = "6405"; // Replace with your merchant code
  const PAYMENT_ITEM_ID = "PAYE"; // Replace with your payment item ID
  const SITE_REDIRECT_URL =
    "https://notifications.fctirs.gov.ng/api/payment/confirmation";

  // Check if Interswitch script is loaded
  useEffect(() => {
    const checkScriptLoaded = () => {
      if (typeof window !== "undefined" && window.webpayCheckout) {
        setScriptLoaded(true);
        console.log("Interswitch script is available");
      } else {
        console.log("Interswitch script not yet available, retrying...");
        setTimeout(checkScriptLoaded, 1000);
      }
    };

    checkScriptLoaded();
  }, []);

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

      const paymentData = {
        txn_ref: txnRef,
        amount: amountInKobo,
        currency: "566", // NGN currency code
        merchant_code: MERCHANT_CODE,
        pay_item_id: PAYMENT_ITEM_ID,
        site_redirect_url: SITE_REDIRECT_URL,
        // Customer details
        cust_name: invoice.payerName || "Unknown",
        cust_email: invoice.payerEmail || "default@example.com",
        cust_id: invoice.PRN || "Unknown",
      };

      console.log("Prepared payment data:", paymentData);
      setFormData(paymentData);
    } catch (error) {
      console.error("Error preparing form data:", error);
      setError(error.message);
    }
  };

  const handlePayment = () => {
    if (!scriptLoaded) {
      console.error("Payment not ready or script not loaded");
      return;
    }

    if (!formData) {
      console.error("Form data missing:", { formData });
      setError("Payment details not ready");
      return;
    }

    if (!window.webpayCheckout) {
      console.error("webpayCheckout not available:", {
        scriptLoaded,
        window: window.webpayCheckout,
      });
      setError("Payment gateway not loaded. Please refresh.");
      return;
    }

    // Log payment details for debugging
    console.log("Payment Configuration:", {
      merchantCode: formData.merchant_code,
      payItemId: formData.pay_item_id,
      redirectUrl: formData.site_redirect_url,
      amount: formData.amount,
      txnRef: formData.txn_ref,
    });

    // Prepare the callback function that will handle the payment response
    const paymentCallback = (response) => {
      console.log("Payment Response:", response);

      try {
        // Extract status from response
        const isSuccess = response.resp === "00";

        // Prepare payment notification data
        const paymentData = {
          PRN: invoiceData.PRN,
          transactionRef: response.txnref || formData.txn_ref,
          amount: invoiceData.amount || 0,
          currency: "NGN",
          status: isSuccess ? "successful" : "failed",
          channel: "interswitch",
          transactionDate: new Date().toISOString(),
          invoiceId: response.txnref || formData.txn_ref,
        };

        // Submit payment notification to your backend
        fetch(`${API_BASE_URL}/api/payment/Notification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        })
          .then((response) => {
            if (!response.ok)
              throw new Error(`HTTP error! Status: ${response.status}`);
            console.log("Payment notification submitted successfully");
          })
          .catch((error) => {
            console.error("Error submitting payment notification:", error);
          });

        // Handle redirection or success/failure UI update
        if (isSuccess) {
          console.log("Payment successful!");
          // window.location.href = "/payment-success";
        } else {
          console.error("Payment failed:", response);
          // window.location.href = "/payment-failed";
        }
      } catch (error) {
        console.error("Error processing payment response:", error);
      }
    };

    // Create the payment request object for webpayCheckout
    const paymentRequest = {
      amount: formData.amount,
      currency: formData.currency,
      merchant_code: formData.merchant_code,
      pay_item_id: formData.pay_item_id,
      txn_ref: formData.txn_ref,
      site_redirect_url: formData.site_redirect_url,
      mode: "TEST", // Use "TEST" for testing
      onComplete: paymentCallback,
    };

    // Call the Interswitch webpayCheckout function to display the modal
    if (window.webpayCheckout) {
      try {
        console.log(
          "Initiating Interswitch payment with request:",
          paymentRequest
        );
        window.webpayCheckout(paymentRequest);
      } catch (error) {
        console.error("Error during webpayCheckout call:", error);
        setError("Failed to initiate payment: " + error.message);
      }
    } else {
      console.error("Interswitch webpayCheckout is not available");
      setError("Payment gateway not ready. Please refresh and try again.");
    }
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
      disabled={!isPaymentReady || !scriptLoaded}
    >
      {isPaymentReady && scriptLoaded ? "Pay with Interswitch" : "Loading..."}
    </button>
  );
};

export default PayWithInterswitch;
