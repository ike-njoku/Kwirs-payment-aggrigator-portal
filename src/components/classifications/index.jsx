"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import ClassificationsTable from "../shared-components/table/ClassificationsTable";

import InventorySearchBar from "../inventory/InventorySearchBar";
import { FaPlus } from "react-icons/fa";
import CreateClassModal from "../shared-components/modals/classifications/CreateClass";
import EditClassModal from "../shared-components/modals/classifications/EditClassModal";
import DeleteClassModal from "../shared-components/modals/classifications/DeleteClassModal";
import { AxiosGet } from "@/services/http-service";
import { toast } from "react-toastify";
import PrintButton from "../shared-components/PrintButton";



const ClassificationsPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [classTableData, setClassTableData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDeleteClassModal, setOpenDeleteClassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleOpenEditClassModal = (index) => {
    setSelectedClass(classTableData[index]);
    setOpenEditModal(true);
  };
  const handleOpenDeleteClassModal = (index) => {
    setSelectedClass(classTableData[index]);
    setOpenDeleteClassModal(true);
  };

  const handleCloseCreateClassModal = () => {
    setOpenCreateModal(false);
  };

  const handleCloseEditClassModal = () => {
    setOpenEditModal(false);
  };

  const handleCloseDeleteClassModal = () => {
    setOpenDeleteClassModal(false);
  };

  const handleAddNewClassItem = (classData) => {
    // Logic to add a new class item
    console.log("New class Item:", classData);
    setClassTableData((prev) => [classData, ...prev]);
    setOpenCreateModal(false);
  };

  const handleEditclassItem = (classData, newData) => {
    setClassTableData((prevData) =>
      prevData.map((item) =>
        item.classCode === classData.classCode ? { ...item, ...newData } : item
      )
    );
    setOpenEditModal(false);
  };

  const fetchAllClass = async () => {
    try {
      setLoading(true);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemClassification/GetAll`
      );

      if (response.status !== 200) {
        toast.error("An error occurred");
        setLoading(false);
        return;
      }
      console.log(response.data.Data);
      setClassTableData(response.data.Data);
      setLoading(false);
    } catch (error) {
      console.log("ERROR", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClass();
  }, []);

  const handleDeleteClassItem = async (e) => {
    try {
      // Logic to delete the class item
      // const updatedClassData = classTableData.filter(
      //   (item, i) => item.itemCode !== selectedClass.itemCode
      // );

      // setClassTableData(updatedClassData);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemClassification/Delete/${Number(
          selectedClass.classCode
        )}`
      );

      if (response?.data?.StatusCode === 200) {
        toast.success(
          response.data.StatusMessage || "Classification deleted successfully!"
        );
        fetchAllClass();
      } else {
        toast.error(response.data.StatusMessage || "Delete failed.");
      }
      setOpenDeleteClassModal(false);
    } catch (error) {}
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.trim()) {
        setLoading(true);
        const lower = Number(searchValue);
        const filtered = classTableData.filter(
          (item) => Number(item?.classCode) === lower
        );

        console.log("Filtered Data:", filtered);
        setFilteredTableData(filtered);
        setLoading(false);
      } else {
        setFilteredTableData([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, classTableData]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [currentRows, setCurrentRows] = useState([]);

  useEffect(() => {
    const activeData =
      filteredTableData.length > 0 ? filteredTableData : classTableData;
    const newTotalPages = Math.ceil(activeData.length / rowsPerPage);
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages && newTotalPages > 10) {
      setCurrentPage(1);
    }

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(activeData.slice(indexOfFirstRow, indexOfLastRow));
  }, [classTableData, currentPage, filteredTableData]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <DashboardLayout page="Classifications">
        <section className="w-full">
          <div className="w-[90%] mx-auto py-5">
            <div className="w-full lg:mt-10">
              <section className="w-full mb-6 mt-8">
                <div className="flex justify-end w-full gap-4">

                  <button
                    onClick={() => setOpenCreateModal(true)}
                    className="text-pumpkin dark:text-darkPumpkin2 font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2 dark:border-darkPumpkin2"
                  >
                    {"Create Class"}

                    <FaPlus />
                  </button>

                    <InventorySearchBar
                    searchValue={searchValue}
                    handleChange={handleSearchChange}
                    placeholder="Search by class code"
                  />

                                                      <PrintButton data={currentRows} fileName="classifications_list.csv" />


                </div>
                <div className="mt-3 w-full">
                  <ClassificationsTable
                    tableData={currentRows}
                    handleEdit={handleOpenEditClassModal}
                    handleDelete={handleOpenDeleteClassModal}
                    loading={loading}
                  />

                  {(classTableData.length > rowsPerPage ||
                    filteredTableData.length > rowsPerPage) && (
                    <div className="flex justify-between items-center mt-4 px-4 py-2 bg-gray-100">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-pumpkin text-white hover:bg-orange-600"
                        }`}
                      >
                        Previous
                      </button>
                      <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={nextPage}
                        disabled={currentPage >= totalPages}
                        className={`px-4 py-2 text-sm font-medium rounded ${
                          currentPage >= totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-pumpkin text-white hover:bg-orange-600"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </DashboardLayout>

      {openCreateModal && (
        <CreateClassModal
          handleCLoseModal={handleCloseCreateClassModal}
          handleCreateNewClassItem={handleAddNewClassItem}
          fetchAllClass={fetchAllClass}
        />
      )}

      {openEditModal && selectedClass && (
        <EditClassModal
          handleCloseModal={handleCloseEditClassModal}
          handleEditClassItem={handleEditclassItem}
          selectedItem={selectedClass}
          fetchAllClass={fetchAllClass}
        />
      )}

      {openDeleteClassModal && (
        <DeleteClassModal
          handleCloseModal={handleCloseDeleteClassModal}
          deleteItem={handleDeleteClassItem}
        />
      )}
    </>
  );
};

export default ClassificationsPage;
