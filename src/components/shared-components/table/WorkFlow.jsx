import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const WorkFlowTable = ({ tableHeadings = [], tableData = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index} className="px-6 py-3 text-left text-sm font-semibold text-white">
                {heading}
              </th>
            ))}
            {/* <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                <td className="px-6 py-3 text-gray-700">{row.DocumentId.trim()}</td>
                <td className="px-6 py-3 text-gray-700">{row.WF_DocumentType}</td>
                <td className="px-6 py-3 text-gray-700">{row.Description}</td>
                <td className="px-6 py-3 text-gray-700">{row.CreatedBy}</td>
                <td className="px-6 py-3 text-gray-700">{new Date(row.CreatedDate).toLocaleDateString()}</td>
                {/* <td className="px-6 py-3 flex items-center gap-3">
                  <button onClick={() => onEdit?.(row)} className="text-grey-700 hover:text-grey-700">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete?.(row.WF_Td)}
                    className="text-red-500 hover:text-red-700 active:scale-95"
                  >
                    <FaTrashAlt />
                  </button>
                </td> */}
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

export default WorkFlowTable;













