"use client";
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import TransactionDetails from "../modals/TransactionDetails";
import { AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TransactionTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [userTIN, setUserTIN] = useState("");

  // Fetch Logged-in User TIN
  useEffect(() => {
    try {
      const authDetails = JSON.parse(localStorage.getItem("authDetails"));
      console.log("Auth Details from localStorage:", authDetails);

      if (authDetails?.tin) {
        setUserTIN(authDetails.tin);
        fetchTransactions(authDetails.tin);
      } else {
        toast.error("User TIN not found. Please log in again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error retrieving TIN:", error);
      toast.error("Error fetching user details.");
      setLoading(false);
    }
  }, []);

  // Fetch Transactions from API
  const fetchTransactions = async (TIN) => {
    console.log("Fetching transactions for TIN:", TIN);
    try {
      const response = await AxiosGet(`${API_BASE_URL}/api/Dashboard/GetDashboard/${TIN}`);
      console.log("API Response:", response);

      if (response?.data?.StatusCode === 200) {
        setTableData(response.data.Data || []);
      } else {
        toast.error(response.data?.StatusMessage || "Could not fetch transactions.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Closing Modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle Opening Modal
  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };

  // Table Headings
  const tableHeadings = ["Narration", "PRN", "Date", "Amount (₦)", "Status"];

  return (
    <div className="relative overflow-x-auto h-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, i) => (
              <th scope="col" className="px-6 py-3" key={i}>
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
  {loading ? (
    <tr>
      <td colSpan={tableHeadings.length} className="text-center py-5 text-gray-700">
        Loading transactions...
      </td>
    </tr>
  ) : tableData.length > 0 ? (
    tableData.map((transaction, i) => {
      const isPAYEFailed = transaction.narration?.toLowerCase().includes("paye") && transaction.status?.toLowerCase() === "failed";

      return (
        <tr
          key={i}
          className={`odd:bg-white even:bg-gray-100 border-b border-gray-200 text-sm ${
            isPAYEFailed ? "text-red-500" : "text-gray-900"
          }`}
        >
          <td className="px-6 py-4 font-medium capitalize">{transaction.narration}</td>
          <td className="px-6 py-4 capitalize">{transaction.PaymentDate}</td>
          <td className="px-6 py-4">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(transaction.amount)}
          </td>
          <td className="px-6 py-4">
            {transaction.Status.toLowerCase() === "paid" && (
              <p className="flex capitalize gap-1 items-center text-green-500">
                <FaCheckCircle /> Paid
              </p>
            )}
            {transaction.Status.toLowerCase() === "failed" && (
              <p className="flex capitalize gap-1 items-center text-red-500">
                <FaTimesCircle /> Failed
              </p>
            )}
            {transaction.Status.toLowerCase() === "pending" && (
              <button
                className="flex capitalize gap-1 items-center text-yellow-500"
                onClick={() => handleOpenModal(transaction)}
              >
                <IoTimeSharp /> Pending
              </button>
            )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={tableHeadings.length} className="bg-white text-center py-5">
        No transactions available
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* Transaction Details Modal */}
      {openModal && <TransactionDetails details={selectedTransaction} handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default TransactionTable;


