"use client";
import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import TransactionDetails from "../modals/TransactionDetails";

const TransactionTable = () => {
  const tableData = [
    {
      title: "John Taxes",
      dateOfPayment: "Today",
      amount: 500,
      status: "done",
    },
    {
      title: "Jane Taxes",
      dateOfPayment: "Today",
      amount: 100,
      status: "canceled",
    },
    {
      title: "Joy Taxes",
      dateOfPayment: "Today",
      amount: 500,
      status: "pending",
    },
    {
      title: "John Taxes",
      dateOfPayment: "Today",
      amount: 500,
      status: "done",
    },
    {
      title: "Jane Taxes",
      dateOfPayment: "Today",
      amount: 100,
      status: "canceled",
    },
    {
      title: "Joy Taxes",
      dateOfPayment: "Today",
      amount: 500,
      status: "pending",
    },
    {
      title: "John Taxes",
      dateOfPayment: "Today",
      amount: 500,
      status: "done",
    },
  ];
  const tableHeadings = ["description", "date", "amount(₦)", "status"];

  const [openModal, setOpenModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({});

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenModal(true);
  };
  return (
    <div className="relative overflow-x-auto h-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
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
          {tableData.length > 0 &&
            tableData.map((tableInfo, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200 text-sm"
                key={i}
              >
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize text-sm"
                >
                  {tableInfo.title}
                </td>

                <td className="px-6 py-4 text-gray-900 capitalize text-sm">
                  {tableInfo.dateOfPayment}
                </td>

                <td className="px-6 py-4 text-gray-900">{tableInfo.amount}</td>

                <td className="px-6 py-4 text-gray-900 text-sm">
                  {tableInfo.status === "done" && (
                    <p className="flex capitalize gap-1 items-center text-green-500">
                      <FaCheckCircle /> done
                    </p>
                  )}
                  {tableInfo.status === "canceled" && (
                    <p className="flex capitalize gap-1 items-center text-red-500">
                      <FaTimesCircle /> failed
                    </p>
                  )}
                  {tableInfo.status === "pending" && (
                    <button
                      className="flex capitalize gap-1 items-center text-yellow-500"
                      onClick={() => handleOpenModal(tableInfo)}
                    >
                      <IoTimeSharp /> pending
                    </button>
                  )}
                </td>
              </tr>
            ))}

          {tableData.length === 0 && (
            <tr>
              <td colSpan={tableHeadings.length} className="bg-white">
                <h3 className="w-full font-semibold py-5 text-2xl text-center">
                  No data available
                </h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* pagination needed */}

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
