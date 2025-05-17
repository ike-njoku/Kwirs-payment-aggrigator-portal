import React, { useState } from "react";
import SwitchIcon from "../../users/SwitchIcon";
import EllipseDropdown from "./EllipseDropdown";
import DeleteModal from "../modals/DeleteModal";
import EditModal from "../modals/EditModal";
import EditReturenInwardModal from "../modals/EditReturenInwardModal";

const CustomTable = ({
  tableData,
  tableHeadings,
  isEllipseDropdwon,
  toggleStatus,
  handleDelete,
  handleEdit,
  openDeleteModal,
  setOpenDeleteModal,
  setOpenEditResourceModal,
  openEditResourceModal,
  openEditModal,
  setOpenEditModal,
  handleDeleteItem,
  handleEditItem,
  text,
  heading,
  label,
  isResource = false,
}) => {
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleCloseEditResourceModal = () => {
    setOpenEditResourceModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
 
  const [selectedItem, setSelectedItem] = useState(0);
  return (
    <>
      <div className="relative overflow-x-auto h-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 lg:table-fixed">
          <thead className="text-xs text-white uppercase bg-pumpkin">
            <tr>
              {tableHeadings.map((heading, i) => (
                <th scope="col" className="px-6 py-3" key={i}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tableData.length > 0 &&
              tableData.map((tableInfo, i) => (
                <tr
                  className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                  key={i}
                >
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {tableInfo.rOutwardId}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {tableInfo.description}
                  </td>

                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {tableInfo.qty}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {tableInfo.Store}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {tableInfo.vendorName}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {/* {tableInfo.ReturnDate} */}
                    {new Date(tableInfo.ReturnDate).toLocaleDateString()}
                  </td>
{/* gd */}
                  <td className="px-6 py-4 text-gray-900">
                    {isEllipseDropdwon ? (
                      <EllipseDropdown
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                        setSelectedItem={setSelectedItem}
                        id={tableInfo.rOutwardId}
                        item={tableInfo}
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

            {tableData.length === 0 && (
              <tr>
                <td colSpan={tableHeadings.length} className="bg-white">
                  <h3 className="w-full font-semibold py-5 text-2xl text-center">
                    No data available
                  </h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openDeleteModal && (
        <DeleteModal
          handleCloseModal={handleCloseDeleteModal}
          handleDeleteItem={handleDeleteItem}
          index={selectedItem}
          text={text}
        />
      )}
      {openEditModal && (
        <EditModal
          handleCloseModal={handleCloseEditModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )}
      {openEditResourceModal && (
        <EditReturenInwardModal
          handleCloseModal={handleCloseEditResourceModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )}
    </>
  );
};

export default CustomTable;
