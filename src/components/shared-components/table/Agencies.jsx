import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Pagination from "../pagination/pagination"; // Import Pagination Component

const CustomTable = ({ tableHeadings, tableData = [], handleEdit, handleDelete, loading }) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ✅ Always show 10 items per page

  // Ensure tableData is an array before slicing
  const validTableData = Array.isArray(tableData) ? tableData : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = validTableData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const totalPages = Math.ceil(validTableData.length / itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

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
          {loading ? (
            <tr>
              <td colSpan={tableHeadings.length} className="p-3 text-center text-gray-600">
                Loading...
              </td>
            </tr>
          ) : currentTableData.length > 0 ? (
            currentTableData.map((row, index) => (
              <tr key={row.AgencyId || index} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
                {/* <td className="px-5 py-3 text-sm text-gray-700">{row.AgencyId}</td> */}
                <td className="px-5 py-3 text-sm text-gray-700">{row.agencyCode}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.description}</td>
                <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleEdit(row.AgencyId)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(row.AgencyId)}>
                    <FaTrashAlt className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeadings.length} className="p-3 text-center text-gray-500">
                No Agencies Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Integrated Pagination Component */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />}
    </div>
  );
};

export default CustomTable;







