import { useState, useContext } from "react";
import { PaymentRequest } from "@/context/PaymentRequestDetails";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useFetchInvoiceData = () => {
  const { setPaymentRequestDetails } = useContext(PaymentRequest);
  const [loading, setLoading] = useState(false);

  const fetchInvoiceData = async (PRN) => {
    setLoading(true);
    try {
      console.log("Fetching invoice data...");
      const response = await fetch(
        `${API_BASE_URL}/api/invoice/GetSingleInvoice/${PRN}`
      );

      if (!response.ok) throw new Error("Failed to fetch invoice");

      const data = await response.json();
      console.log("Full API response:", data); // ✅ Log full response

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
      } else {
        console.warn("No invoice data found.");
        setPaymentRequestDetails(null);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  return { fetchInvoiceData, loading };
};

export default useFetchInvoiceData;
