import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ClassificationsTable = ({
  tableData,
  loading,
  handleDelete,
  handleEdit,
}) => {
  const tableHeadings = [
    "Class Code",
    "Class Description",
    "Cat Code",
    "Actions",
  ];
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md w-full flex flex-nowrap custom-scrollbar-2">
      <table className="table-auto w-full flex-shrink-0 ">
        <thead className="bg-pumpkin">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="px-5 py-3 text-left text-sm text-white font-semibold"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={tableHeadings.length}
                className="p-3 text-center text-gray-600"
              >
                Loading...
              </td>
            </tr>
          ) : tableData.length > 0 ? (
            tableData.map((row, index) => (
              <tr
                key={row.classCode || index}
                className={`border-t hover:bg-gray-50 capitalize ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                {/* <td className="px-5 py-3 text-sm text-gray-700">{row.AgencyId}</td> */}
                <td className="px-5 py-3 text-sm text-gray-700 uppercase">
                  {row.classCode}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.description}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {row.catCode}
                </td>

                <td className="px-5 py-3 text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleEdit(index)}>
                    <FaEdit />
                  </button>

                  <button onClick={() => handleDelete(index)}>
                    <FaTrashAlt className="text-red-500" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeadings.length}
                className="p-3 text-center text-gray-500"
              >
                No Class Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassificationsTable;
