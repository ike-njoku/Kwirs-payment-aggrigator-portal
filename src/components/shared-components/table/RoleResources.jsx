import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CustomTable = ({ tableHeadings, tableData, handleEdit, handleDelete, loading }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
    <table className="min-w-full table-auto border-collapse">
  <thead className="bg-pumpkin">
    <tr>
      {tableHeadings.map((heading, index) => (
        <th
          key={index}
          className="px-5 py-3 text-left text-sm text-white font-semibold text-gray-500"
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
          className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
        >
          <td className="px-5 py-3 text-sm text-gray-700">{row.Name}</td>

          {/* <td className="px-5 py-3 text-sm text-gray-700">
          
            {row.RoleId || 'Not Available'}
          </td> */}
{/* 
          <td className="px-5 py-3 text-sm text-gray-700">{row.PermissionId}</td> */}

          <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
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
        <td colSpan="4" className="p-3 border border-gray-300 text-center">
        No Role Selected
        </td>
      </tr>
    )}
  </tbody>
</table>





    </div>
  );
};

export default CustomTable;



