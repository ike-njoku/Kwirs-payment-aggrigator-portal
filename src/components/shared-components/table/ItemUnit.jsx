import React, { useState } from "react";
import EllipseDropdown from "../../shared-components/table/EllipseDropdown";
import DeleteModal from "../modals/DeleteModal";
import EditModal from "../modals/EditModal";
import Pagination from "../pagination/pagination";

const CustomTable = ({
  tableData = [],
  loading,
  handleEditItem,
  handleDeleteItem,
  handleItem,
  openDeleteModal,
  setOpenDeleteModal,
  openEditModal,
  setOpenEditModal,
  heading,
  label,
  text,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  const handleCloseDeleteModal = () => setOpenDeleteModal(false);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const tableHeadings = ["Unit Code", "Description", "Actions"];

  return (
    <>
      <div className="relative overflow-x-auto h-auto shadow-md sm:rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-500 lg:table-fixed">
          <thead className="text-xs text-white uppercase bg-pumpkin">
            <tr>
              {tableHeadings.map((heading, i) => (
                <th key={i} className="px-6 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={tableHeadings.length} className="text-center py-5">
                  Loading...
                </td>
              </tr>
            ) : currentTableData.length > 0 ? (
              currentTableData.map((row, i) => (
                <tr
                  key={row.unitCode || i}
                  className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                >
                  <td className="px-6 py-4 text-gray-900">{row.unitCode}</td>
                  <td className="px-6 py-4 text-gray-900">{row.description}</td>
                  <td className="px-6 py-4 text-gray-900">
                    <EllipseDropdown
                      handleEdit={(item) => {
                        setSelectedItem(item);
                        handleEditItem(item);
                      }}
                      handleDelete={(item) => {
                        setSelectedItem(item.unitCode);
                        handleDeleteItem(item.unitCode);
                      }}
                      setSelectedItem={setSelectedItem}
                      id={row.unitCode}
                      item={row}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeadings.length} className="text-center py-5 text-gray-500">
                  No Item Units Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={nextPage}
          onPrev={prevPage}
        />
      )}

      {openDeleteModal && (
        <DeleteModal
          handleCloseModal={handleCloseDeleteModal}
          handleDeleteItem={() => handleItem(selectedItem)}
          text={text}
        />
      )}

      {openEditModal && selectedItem && (
        <EditModal
          handleCloseModal={handleCloseEditModal}
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
