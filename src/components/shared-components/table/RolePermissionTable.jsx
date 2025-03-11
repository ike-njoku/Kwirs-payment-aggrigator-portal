import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const RolePermissionTable = ({ tableHeadings = [], tableData = [], permissions, onEdit, onDelete, handleEditPermission }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th 
                key={index} 
                className="border-b px-6 py-3 text-left text-sm font-semibold text-white"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr 
                key={index} 
                className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
              >
                <td className="px-6 py-3 text-gray-700">{row.permissionCode || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700">{row.description || "No description"}</td>
                <td className="px-6 py-3 text-gray-700">{row.resourceName || "Unknown Resource"}</td>

                <td className="px-6 py-3 flex gap-3">
       
                  {/* <button 
                    onClick={() => onEdit(row)} 
                    className="text-gray-500 hover:text-blue-700 transition duration-200"
                  >
                    <FaEdit />
                  </button> */}
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
              <td colSpan={tableHeadings.length + 1} className="text-center py-4 text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RolePermissionTable;








