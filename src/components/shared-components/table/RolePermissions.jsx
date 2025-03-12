import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const CustomTable = ({ tableHeadings, tableData, onDelete }) => {
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
          {tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr key={index} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                <td className="px-6 py-3 text-gray-700">{row.createdBy}</td>
                <td className="px-6 py-3 text-gray-700">{row.roleName}</td>
                <td className="px-6 py-3 text-gray-700">{row.permissionName}</td>
                <td className="px-6 py-3 flex gap-3">
                  <button
                    onClick={() => onDelete(row.permissionId)}
                    className="text-red-500 hover:text-red-700 transition duration-200 active:scale-95"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-600">No Role Selected</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;






