import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const WorkFlowActivityTable = ({ tableData = [], onEdit, onDelete }) => {
  const tableHeadings = [
    "ID",                   // WFActivityId
    "Document Type",        // WF_DocumentType
    "Stage",                // Stage
    "Stage Description",    // StageDescription
    "Work flow Description", // WFDescription
    "Remark",      // isFinalAction
    "Action"               // Action buttons
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-white"
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
                key={row.WFActivityId}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-6 py-3 text-gray-700">{row.WFActivityId || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700">{row.WF_DocumentType || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700">{row.Stage || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700">{row.StageDescription || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700">{row.WFDescription || "N/A"}</td>
                <td className="px-6 py-3 text-gray-700">
                  {row.isFinalAction ? "Yes" : "No"}
                </td>
                {/* <td className="px-6 py-3 text-gray-700">
                  {row.CreatedDate
                    ? new Date(row.CreatedDate).toLocaleString()
                    : "N/A"}
                </td> */}
                <td className="px-6 py-3 flex justify-end items-center gap-3">
                  <button
                    onClick={() => onEdit?.(row)}
                    title="Edit"
                    className="text-gray-700 hover:textgrey-600 transition duration-200"
                  >
                    <FaEdit />
                  </button>
                  {/* <button
                    onClick={() => onDelete?.(row.WFActivityId)}
                    title="Delete"
                    className="text-red-500 hover:text-red-700 transition duration-200 active:scale-95"
                  >
                    <FaTrashAlt />
                  </button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeadings.length}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkFlowActivityTable;















