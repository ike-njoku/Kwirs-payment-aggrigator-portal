import { useState, useContext } from "react";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useFetchInvoiceData = () => {
  const { setPaymentRequestDetails } = useContext(PaymentRequest);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchInvoiceData = async (PRN) => {
    setLoading(true);
    setNotFound(false); // Reset notFound state before making the request
    try {
      console.log("Fetching invoice data...");
      const response = await fetch(
        `${API_BASE_URL}/api/invoice/GetSingleInvoice/${PRN}`
      );

      if (!response.ok) throw new Error("Failed to fetch invoice");

      const data = await response.json();

      console.log("Fetched data:", data); // Debugging the fetched data

      if (data?.Data?.length > 0) {
        const invoiceData = data.Data[0]; // ✅ Extract the first invoice object
        console.log("Extracted Invoice Data:", invoiceData); // ✅ Log extracted invoice

        setPaymentRequestDetails({
          invoice: {
            PRN: data.Data[0]?.PRN ?? "N/A",
            TIN: data.Data[0]?.TIN ?? "N/A",
            createdDate: data.Data[0]?.createdDate ?? "",
            payerAddress: data.Data[0]?.payerAddress ?? "",
            payerPhone: data.Data[0]?.payerPhone ?? "",
            payerEmail: data.Data[0]?.payerEmail ?? "",
          },
          payerName: data.Data[0]?.payerName ?? "",
          amount: data.Data[0]?.amount ?? 0,
        });

        return true; // Successfully fetched invoice data
      } else {
        console.warn("No invoice data found.");
        setPaymentRequestDetails(null);
        setNotFound(true);
        return false; // No invoice found
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setNotFound(true);
      return false; // Error occurred
    } finally {
      setLoading(false);
    }
  };

  return { fetchInvoiceData, loading, notFound };
};


export default useFetchInvoiceData;
