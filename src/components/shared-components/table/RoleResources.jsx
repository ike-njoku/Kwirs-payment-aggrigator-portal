import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CustomTable = ({ tableHeadings, tableData, handleEdit, handleDelete, loading }) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page

  // Calculate pagination indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const nextPage = () => {
    if (currentPage < Math.ceil(tableData.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index} className="px-5 py-3 text-left text-sm text-white font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTableData.length > 0 ? (
            currentTableData.map((row, index) => (
              <tr key={index} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                <td className="px-5 py-3 text-sm text-gray-700">{row.Name}</td>
                <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
                  {/* Uncomment if edit button is needed */}
                  {/* <button onClick={() => handleEdit(row)}>
                    <FaEdit />
                  </button> */}
                  <button onClick={() => handleDelete(row.RoleResourceId)}>
                    <FaTrashAlt className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeadings.length} className="p-3 border border-gray-300 text-center">
                No Role Selected
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 px-4 py-2 bg-gray-100">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
          }`}
        >
          Previous
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {Math.ceil(tableData.length / itemsPerPage)}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= Math.ceil(tableData.length / itemsPerPage)}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage >= Math.ceil(tableData.length / itemsPerPage) ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomTable;




