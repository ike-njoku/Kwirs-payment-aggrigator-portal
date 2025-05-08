import React, { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Pagination from "../pagination/pagination";

const CustomTable = ({ tableHeadings, tableData = [], handleEdit, handleDelete, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const validTableData = Array.isArray(tableData) ? tableData : [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = validTableData.slice(indexOfFirstItem, indexOfLastItem);

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
              <tr
                key={row.catCode || index}
                className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
              >
                <td className="px-5 py-3 text-sm text-gray-700">{row.catCode}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.description}</td>
                <td className="px-5 py-3 text-sm text-gray-700">{row.accountCode}</td>
                <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleEdit(row.catCode)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(row.catCode)}>
                    <FaTrashAlt className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableHeadings.length} className="p-3 text-center text-gray-500">
                No Item Categories Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />
      )}
    </div>
  );
};

export default CustomTable;








