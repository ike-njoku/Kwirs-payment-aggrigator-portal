import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

const CustomTable = ({ tableHeadings, tableData, onDelete }) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Number of rows per page

  // Calculate total pages
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  // Get current rows for the page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  // Change Page
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index} className="px-6 py-3 text-left text-sm font-semibold text-white">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((row, index) => (
              <tr key={index} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="px-6 py-3 text-gray-700">{row.roleName}</td>
                <td className="hidden">{row.rolePermissionId}</td>
                <td className="px-6 py-3 text-gray-700">{row.description}</td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => onDelete(row.rolePermissionId)}
                    className="text-red-500 hover:text-red-700 transition duration-200 active:scale-95"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-600">No Role Selected</td>
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
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className={`px-4 py-2 text-sm font-medium rounded ${
            currentPage >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomTable;







