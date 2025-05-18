"use client";
import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const InventoryTable = ({
  tableData,
  loading,
  handleDelete,
  handleEdit,
  setCurrentTableData,
}) => {
  const tableHeadings = [
    "Item Code",
    "Bar Code",
    "Description",
    "Classification",
    "Cost",
    "Unit",
    "Reorder",
    "OP Balance",
    "Max",
    "Status",
    "Actions",
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md w-full flex flex-nowrap custom-scrollbar">
      <table className="table-auto md:table-fixed flex-shrink-0">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="px-5 py-3 text-left text-sm text-white font-semibold"
              >
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
                className="p-3 text-center text-gray-600"
              >
                Loading...
              </td>
            </tr>
          ) : tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr
                key={row.itemCode || index}
                className={`border-t hover:bg-gray-50 capitalize ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                {/* <td className="px-5 py-3 text-sm text-gray-700">{row.AgencyId}</td> */}
                <td className="px-5 py-3 text-sm text-gray-700 uppercase">
                  {row.itemCode}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.barcode}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.description}
                </td>

                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.ItemClassification}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.cost}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.Unit}</td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.reorder}
                </td>

                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.opBalance}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.max}</td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.status}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleEdit(index)}>
                    <FaEdit />
                  </button>

                  <button onClick={() => handleDelete(index)}>
                    <FaTrashAlt className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeadings.length}
                className="p-3 text-center text-gray-500"
              >
                No Inventory Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
