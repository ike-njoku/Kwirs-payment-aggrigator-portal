"use client";
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import TransactionDetails from "../modals/TransactionDetails";
import { AxiosGet } from "../../../services/http-service";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const TransactionTable = ({ transactions, loading }) => {
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [userTIN, setUserTIN] = useState("");

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
              <td
                colSpan={tableHeadings.length}
                className="text-center py-5 text-gray-700"
              >
                Loading transactions...
              </td>
            </tr>
          ) : transactions.transactions.length > 0 ? (
            transactions?.transactions.map((transaction, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200 text-sm"
                key={i}
              >
                <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                  {transaction.narration}
                </td>
                <td className="px-6 py-4 text-gray-900">{transaction.PRN}</td>
                <td className="px-6 py-4 text-gray-900">
                  {transaction.PaymentDate}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(transaction.amount)}
                </td>

                <td className="px-6 py-4 text-gray-900">
                  {transaction.Status === "Paid" && (
                    <p className="flex capitalize gap-1 items-center text-green-500">
                      <FaCheckCircle /> Paid
                    </p>
                  )}
                  {transaction.Status === "Failed" && (
                    <p className="flex capitalize gap-1 items-center text-red-500">
                      <FaTimesCircle /> Failed
                    </p>
                  )}
                  {transaction.Status === "Pending" && (
                    <button
                      className="flex capitalize gap-1 items-center text-yellow-500"
                      onClick={() => handleOpenModal(transaction)}
                    >
                      <IoTimeSharp /> Pending
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeadings.length}
                className="bg-white text-center py-5"
              >
                No transactions available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Transaction Details Modal */}
      {openModal && (
        <TransactionDetails
          details={selectedTransaction}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default TransactionTable;
