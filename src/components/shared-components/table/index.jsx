import React from "react";
import SwitchIcon from "../../users/SwitchIcon";
import EllipseDropdown from "./EllipseDropdown";
import DeleteModal from "../modals/DeleteModal";

const CustomTable = ({
  tableData,
  tableHeadings,
  isEllipseDropdwon,
  toggleStatus,
  handleDelete,
  handleEdit,
  openDeleteModal,
  setOpenDeleteModal,
}) => {
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  return (
    <>
      <div class="relative overflow-x-auto h-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed">
          <thead class="text-xs text-white uppercase bg-pumpkin">
            <tr>
              {tableHeadings.map((heading, i) => (
                <th scope="col" class="px-6 py-3" key={i}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((tableInfo, i) => (
              <tr
                className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                key={i}
              >
                <td
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                >
                  {tableInfo.name}
                </td>

                <td class="px-6 py-4 text-gray-900 capitalize">
                  {tableInfo.dateCreated}
                </td>

                <td class="px-6 py-4 text-gray-900">
                  {isEllipseDropdwon ? (
                    <EllipseDropdown
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                    />
                  ) : (
                    <SwitchIcon
                      isActive={tableInfo.isActive}
                      onToggle={toggleStatus}
                      index={i}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openDeleteModal && (
        <DeleteModal handleCloseModal={handleCloseDeleteModal} />
      )}
    </>
  );
};

export default CustomTable;
