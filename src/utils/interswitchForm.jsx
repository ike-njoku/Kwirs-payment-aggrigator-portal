"use client";
import React, { useState, useEffect, useContext } from "react";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const InterswitchPaymentForm = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { paymentRequestDetails } = useContext(PaymentRequest);
  const invoiceId = paymentRequestDetails?.invoice?.PRN;
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Hardcoded values - replace with your actual values
  const MERCHANT_CODE = "6405";
  const PAYMENT_ITEM_ID = "PAYE";
  const REDIRECT_URL =
    "https://notifications.fctirs.gov.ng/api/payment/confirmation";

  useEffect(() => {
    if (!invoiceId) {
      setLoading(false);
      setError("No invoice ID found");
      return;
    }

    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/invoice/GetSingleInvoice/${invoiceId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch invoice: ${response.status}`);
        }

        const data = await response.json();

        if (data.StatusCode === 200 && data.Data.length > 0) {
          setInvoiceData(data.Data[0]);
        } else {
          throw new Error("Invalid invoice data");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [invoiceId, API_BASE_URL]);

  if (loading) {
    return (
      <button
        className="text-pumpkin !important font-bold p-2 rounded opacity-50"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // If invoice data is loaded successfully
  const txnRef = `${invoiceData.PRN || "INV"}_${Date.now()}`;
  const amount = Math.floor(parseFloat(invoiceData.amount || 0) * 100); // Convert to kobo

  return (
    <form
      method="POST"
      action="https://newwebpay.qa.interswitchng.com/collections/w/pay"
      target="_blank"
      className="inline"
    >
      <input type="hidden" name="merchant_code" value={MERCHANT_CODE} />
      <input type="hidden" name="pay_item_id" value={PAYMENT_ITEM_ID} />
      <input type="hidden" name="site_redirect_url" value={REDIRECT_URL} />
      <input type="hidden" name="txn_ref" value={txnRef} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="currency" value="566" />
      <input
        type="hidden"
        name="cust_name"
        value={invoiceData.payerName || "Customer"}
      />
      <input
        type="hidden"
        name="cust_email"
        value={invoiceData.payerEmail || "customer@example.com"}
      />
      <input type="hidden" name="cust_id" value={invoiceData.PRN || txnRef} />

      <button
        type="submit"
        className="text-pumpkin !important font-bold p-2 rounded"
      >
        Pay with Interswitch
      </button>
    </form>
  );
};

export default InterswitchPaymentForm;
