"use client";
import React, { useEffect, useState } from "react";
import CustomTable from "../shared-components/table/Transaction-list";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import { AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TransactionListPage = () => {
  const tableHeadings = ["PRN", "Narration", "PSSP", "Status", "Amount", "Date"];
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // To track selected status

  // Fetch transactions by status
  const fetchTransactionsByStatus = async (status) => {
    const apiUrl = `${API_BASE_URL}/api/Transactions/FilterbyStatus/${status}/Admin`;
    console.log("🔍 Fetching Transactions with Status:", apiUrl);

    try {
      setLoading(true);

      const response = await AxiosGet(apiUrl);
      const resData = response?.data;

      console.log("✅ API Response:", resData);

      const { StatusCode, StatusMessage, Data } = resData;

      if (StatusCode === 200) {
        setTransactions(Array.isArray(Data) ? Data : []);
      } else {
        console.error("⚠️ API Error:", StatusMessage);
        toast.error(StatusMessage || "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("🚨 Fetch Error:", error);
      toast.error("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    if (status) {
      fetchTransactionsByStatus(status); // Fetch transactions based on selected status
    }
  };

  // ✅ Fetch Transactions by admin
  const fetchAdminTransactions = async () => {
    const apiUrl = `${API_BASE_URL}/api/Transactions/GetAllTransactions/Admin`;
    console.log("🔍 Fetching Admin Transactions from:", apiUrl);
  
    try {
      setLoading(true);
  
      const response = await AxiosGet(apiUrl);
      const resData = response?.data;
  
      console.log("✅ Admin API Response:", resData);
  
      const { StatusCode, StatusMessage, Data, sumtotal } = resData;
  
      if (StatusCode === 200) {
        setTransactions(Array.isArray(Data) ? Data : []);
        setTransactionSummary({
          sumtotal: sumtotal || 0,
        });
      } else {
        console.error("⚠️ Admin API Error:", StatusMessage);
        toast.error(StatusMessage || "Failed to fetch admin transactions.");
      }
    } catch (error) {
      console.error("🚨 Fetch Error (Admin):", error);
      toast.error("Error fetching admin transactions.");
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Get Logged-in User TIN
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("authDetails");
        console.log("🔹 Stored User:", storedUser);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const tin = parsedUser?.tin;
          console.log("✅ Logged-in User TIN:", tin);

          if (tin) {
            fetchAdminTransactions(tin);
          } else {
            toast.error("User TIN not found. Please log in again.");
          }
        } else {
          toast.error("User data not found. Please log in again.");
        }
      } catch (error) {
        console.error("🚨 Error parsing authDetails:", error);
        toast.error("Invalid user data. Please log in again.");
      }
    }
  }, []);


//   // ✅ Fetch Transactions by logged in user tin
// const fetchAdminTransactions = async (tin) => {
//   const apiUrl = `${API_BASE_URL}/api/Transactions/GetAllTransactions/${tin}`; // Append tin to the URL
//   console.log("🔍 Fetching Admin Transactions from:", apiUrl);

//   try {
//     setLoading(true);

//     const response = await AxiosGet(apiUrl);
//     const resData = response?.data;

//     console.log("✅ Admin API Response:", resData);

//     const { StatusCode, StatusMessage, Data, sumtotal } = resData;

//     if (StatusCode === 200) {
//       setTransactions(Array.isArray(Data) ? Data : []);
//       setTransactionSummary({
//         sumtotal: sumtotal || 0,
//       });
//     } else {
//       console.error("⚠️ Admin API Error:", StatusMessage);
//       toast.error(StatusMessage || "Failed to fetch admin transactions.");
//     }
//   } catch (error) {
//     console.error("🚨 Fetch Error (Admin):", error);
//     toast.error("Error fetching admin transactions.");
//   } finally {
//     setLoading(false);
//   }
// };

// // ✅ Get Logged-in User TIN
// useEffect(() => {
//   if (typeof window !== "undefined") {
//     try {
//       const storedUser = localStorage.getItem("authDetails");
//       console.log("🔹 Stored User:", storedUser);

//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         const tin = parsedUser?.tin;
//         console.log("✅ Logged-in User TIN:", tin);

//         if (tin) {
//           fetchAdminTransactions(tin); // Pass tin to the function
//         } else {
//           toast.error("User TIN not found. Please log in again.");
//         }
//       } else {
//         toast.error("User data not found. Please log in again.");
//       }
//     } catch (error) {
//       console.error("🚨 Error parsing authDetails:", error);
//       toast.error("Invalid user data. Please log in again.");
//     }
//   }
// }, []);


  return (
    <DashboardLayout page="General Transactions">
      <section className="w-full">
         <div className="w-[90%] mx-auto py-5">
                  <div className="mt-4 flex gap-4 justify-between items-center">
                  <div className="relative">
  <select
    className="text-pumpkin font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin"
    onChange={(e) => {
      const status = e.target.value;
      setSelectedStatus(status);
      if (status) {
        fetchTransactionsByStatus(status); // Fetch transactions based on selected status
      } else {
        fetchAdminTransactions(); // Fetch all transactions when "All Transactions" is selected
      }
    }}
    value={selectedStatus || ""}
  >
    <option value="">All Transactions</option>
    <option value="1">Paid</option>
    <option value="2">Failed</option>
    <option value="3">Pending</option>
  </select>
</div>

                  </div>
                </div>

        {/* ✅ Table */}
        <div className="w-[90%] mx-auto mt-6">
          {loading ? (
            <p className="text-gray-600">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-red-500">No transactions found.</p>
          ) : (
            <CustomTable
              tableHeadings={tableHeadings}
              tableData={transactions}
              loading={loading}
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default TransactionListPage;










