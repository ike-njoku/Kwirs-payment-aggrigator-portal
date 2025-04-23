import React, { use } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import EditWorkflowActionModal from "../modals/EditWorkflowAction";

const WorkFlowActionTable = ({
  tableHeadings = [],
  tableData = [],
  onEdit,
  onDelete,
}) => {
  const [showEditWorkflowActionModal, setShowEditWorkflowActionModal] =
    useState(false);
  const [selectedWorkflowAction, setSelectedWorkflowAction] = useState(null);

  const selectWorkflowAction = (workflowAction) => {
    setSelectedWorkflowAction(workflowAction);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md ml-10 mr-10">
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-6 py-3 text-gray-700">
                  {row.Role ?? "No role"}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {row.WF_DocumentType ?? "N/A"}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {row.Stage ?? "No stage"}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {row.Description ?? "No description"}
                </td>
                <td className="px-6 py-3 flex items-center gap-3">
                  <button
                    onClick={() => {
                      selectWorkflowAction(row);
                      setShowEditWorkflowActionModal(true);
                    }}
                    className="text-grey-700 hover:text-grey-700 transition duration-200"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete?.(row.WFActionId)}
                    className="text-red-500 hover:text-red-700 transition duration-200 active:scale-95"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeadings.length + 1}
                className="text-center py-4 text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showEditWorkflowActionModal && (
        <EditWorkflowActionModal
          workflowActionDetails={selectedWorkflowAction}
          onClose={() => setShowEditWorkflowActionModal(false)}
        />
      )}
    </div>
  );
};

export default WorkFlowActionTable;
