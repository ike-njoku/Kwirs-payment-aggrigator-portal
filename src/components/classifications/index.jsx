"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import ClassificationsTable from "../shared-components/table/ClassificationsTable";
import { classData } from "@/utils/app_data";
import InventorySearchBar from "../inventory/InventorySearchBar";
import { FaPlus } from "react-icons/fa";
import CreateClassModal from "../shared-components/modals/classifications/CreateClass";
import EditClassModal from "../shared-components/modals/classifications/EditClassModal";
import DeleteClassModal from "../shared-components/modals/classifications/DeleteClassModal";
import { AxiosGet } from "@/services/http-service";
import { toast } from "react-toastify";

const ClassificationsPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const [classTableData, setClassTableData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDeleteClassModal, setOpenDeleteClassModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <DashboardLayout page="Classifications">
        <section className="w-full">
          <div className="w-[90%] mx-auto py-5">
            <div className="w-full lg:mt-10">
              <section className="w-full mb-6 mt-8">
                <div className="flex justify-end w-full gap-4">
                  <InventorySearchBar />

                  <button
                    onClick={() => setOpenCreateModal(true)}
                    className="text-pumpkin dark:text-darkPumpkin2 font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2 dark:border-darkPumpkin2"
                    // disabled={loading}
                  >
                    {"Create Class"}
                    {/* {loading ? "Processing..." : "Create an Agency"} */}
                    <FaPlus />
                  </button>
                </div>
                <div className="mt-3 w-full">
                  <ClassificationsTable
                    tableData={classTableData}
                    handleEdit={handleOpenEditClassModal}
                    handleDelete={handleOpenDeleteClassModal}
                    loading={loading}
                  />
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
