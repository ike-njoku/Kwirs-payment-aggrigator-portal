import React from "react";

const AuditDetailsModal = ({ logId, onClose, details = [], isLoading }) => {
  // Helper function to safely parse JSON
  const tryParseJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 max-w-4xl max-h-[80vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Audit Log Details #{logId}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 ">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pumpkin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {Array.isArray(details) && details.length > 0 ? (
                <table className="min-w-full divide-y ">
                  <thead className="bg-pumpkin text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Column
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Original Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        New Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details.map((detail) => (
                      <tr key={detail.AuditLogDetailId}>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-gray-900">
                          {detail.ColumnName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {detail.OriginalValue || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {detail.ColumnName === "LogDescription" ? (
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              {tryParseJson(detail.NewValue)}
                            </pre>
                          ) : (
                            detail.NewValue || "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No details available for this log
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pumpkin  text-white rounded hover:bg-pumpkin transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditDetailsModal;
