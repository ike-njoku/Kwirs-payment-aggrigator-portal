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
    "Item Name",
    "Class",
    "Category",
    "Customer",
    "Vendor",
    "Item Price",
    "Quantity",
    "Date Issued",
    "Actions",
  ];
  const categoryList = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];
  // const [currentTableData, setCurrentTableData] = useState(tableData);
  const [editingIndex, setEditingIndex] = useState(null);

  // const [categoryData, setCategoryData] = useState("select category");

  const handleChangeItemCategory = (index, newCategory) => {
    const updated = [...tableData];
    updated[index].category = newCategory;
    setCurrentTableData(updated);
  };

  const handleChangeQty = (index, newQty) => {
    const updated = [...tableData];
    updated[index].itemUnits = newQty;
    setCurrentTableData(updated);
  };
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
                  {row.itemName}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.itemClass}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  <select
                    name="catgeory"
                    className="outline-none bg-gray-200 rounded-md text-sm cursor-pointer"
                    value={row.category}
                    onChange={(e) =>
                      handleChangeItemCategory(index, e.target.value)
                    }
                  >
                    {categoryList.map((category, index) => (
                      <option value={category} className="" key={index}>
                        {category}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.customer}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.vendor}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.itemPrice}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  <span className="flex gap-2 items-center">
                    <input
                      type="number"
                      className="w-full max-w-[50px] border border-gray-300 disabled:border-none disabled:bg-gray-200 px-1 outline-none"
                      value={row.itemUnits}
                      disabled={editingIndex !== index}
                      onChange={(e) => {
                        handleChangeQty(index, e.target.value);
                      }}
                    />
                    {editingIndex === index ? (
                      <button onClick={() => setEditingIndex(null)}>
                        <FaCheck />
                      </button>
                    ) : (
                      <button onClick={() => setEditingIndex(index)}>
                        <FaEdit />
                      </button>
                    )}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.dateIssued}
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
