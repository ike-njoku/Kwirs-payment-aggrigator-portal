import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Pagination from "../pagination/pagination"; // Import Pagination Component

const CustomTable = ({ tableHeadings, tableData = [], handleEdit, handleDelete, loading }) => {
  
    const [error, setError] = useState("");
  

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
  ) : error ? (
    <tr>
      <td colSpan={tableHeadings.length} className="p-3 text-center text-red-500">
        {error}
      </td>
    </tr>
  ) : currentTableData.length > 0 ? (
    currentTableData.map((auth, index) => (
      <tr key={auth.authorizationId || index} className="border-b border-gray-200 hover:bg-gray-100">
        {/* <td className="px-5 py-3 text-sm text-gray-700">{auth.authorizationCode || "N/A"}</td> */}
        <td className="px-5 py-3 text-sm text-gray-700">{auth.taxpayerTIN || "N/A"}</td>
        <td className="px-5 py-3 text-sm text-gray-700">{auth.Agency || "N/A"}</td>
        <td className="px-5 py-3 text-sm text-gray-700">{auth.taxpayerName || "N/A"}</td>
        {/* <td className="px-5 py-3 text-sm text-gray-700">{auth.createdBy || "N/A"}</td>
        <td className="px-5 py-3 text-sm text-gray-700">{new Date(auth.createdDate).toLocaleString() || "N/A"}</td> */}
          <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
                          <button onClick={() => handleEdit(auth.authorizationId)}>
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(auth.authorizationId)}>
                            <FaTrashAlt className="text-red-500" />
                          </button>
                        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={tableHeadings.length} className="p-3 text-center text-gray-500">
        No Authorizations Found
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







