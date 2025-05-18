"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import InventoryFilter from "./InventoryFilter";
import InventorySearchBar from "./InventorySearchBar";
import InventoryTable from "../shared-components/table/InventoryTable";
import { inventoryData } from "@/utils/app_data";
import { FaPlus } from "react-icons/fa6";
import CreateInventoryModal from "../shared-components/modals/CreateInventoryModal";
import EditInventoryModal from "../shared-components/modals/EditInventoryModal";
import DeleteInventoryModal from "../shared-components/modals/DeleteInventoryModal";
import { AxiosGet } from "@/services/http-service";
import { toast } from "react-toastify";

const InventoryPage = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [inventoryTableData, setInventoryTableData] = useState(inventoryData);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [openDeleteInventoryModal, setOpenDeleteInventoryModal] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAllInventory = async () => {
    try {
      setLoading(true);
      const response = await AxiosGet(
        `${API_BASE_URL}api/Inventory/ItemDetails/GetAll`
      );

      console.log({ response });
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllInventory();
  }, []);

  const handleOpenEditInventoryModal = (index) => {
    setSelectedInventory(inventoryTableData[index]);
    setOpenEditModal(true);
  };
  const handleOpenDeleteInventoryModal = (index) => {
    setSelectedInventory(inventoryTableData[index]);
    setOpenDeleteInventoryModal(true);
  };

  const handleCloseCreateInventoryModal = () => {
    setOpenCreateModal(false);
  };

  const handleCloseEditInventoryModal = () => {
    setOpenEditModal(false);
  };

  const handleCloseDeleteInventoryModal = () => {
    setOpenDeleteInventoryModal(false);
  };

  const handleDeleteInventoryItem = () => {
    // Logic to delete the inventory item
    const updatedInventoryData = inventoryTableData.filter(
      (item, i) => item.itemCode !== selectedInventory.itemCode
    );

    setInventoryTableData(updatedInventoryData);
    setOpenDeleteInventoryModal(false);
  };

  const handleAddNewInventoryItem = (inventory) => {
    // Logic to add a new inventory item
    console.log("New Inventory Item:", inventory);
    setInventoryTableData((prev) => [inventory, ...prev]);
    setOpenCreateModal(false);
  };

  const handleEditInventoryItem = (inventory, newData) => {
    setInventoryTableData((prevData) =>
      prevData.map((item) =>
        item.itemCode.toLowerCase() === inventory.itemCode.toLowerCase()
          ? { ...item, ...newData }
          : item
      )
    );
    setOpenEditModal(false);
  };

  return (
    <>
      <DashboardLayout page="inventory">
        <section className="w-full">
          <div className="w-[90%] mx-auto py-5">
            <div className="w-full lg:mt-10">
              <article className="w-full pb-2 border-b border-b-gray-500">
                <h3 className="dark:text-white capitalize font-medium text-xl">
                  filters:
                </h3>

                <InventoryFilter />
              </article>

              <section className="w-full mb-6 mt-8">
                <div className="flex justify-end w-full gap-4">
                  <InventorySearchBar />

                  <button
                    onClick={() => setOpenCreateModal(true)}
                    className="text-pumpkin dark:text-darkPumpkin2 font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2 dark:border-darkPumpkin2"
                    // disabled={loading}
                  >
                    {"Add Inventory"}
                    {/* {loading ? "Processing..." : "Create an Agency"} */}
                    <FaPlus />
                  </button>
                </div>

                <div className="mt-3 w-full">
                  <InventoryTable
                    tableData={inventoryTableData}
                    setCurrentTableData={setInventoryTableData}
                    handleDelete={handleOpenDeleteInventoryModal}
                    handleEdit={handleOpenEditInventoryModal}
                  />
                </div>
              </section>
            </div>
          </div>
        </section>
      </DashboardLayout>

      {openCreateModal && (
        <CreateInventoryModal
          handleCloseModal={handleCloseCreateInventoryModal}
          handleAddNewInventoryItem={handleAddNewInventoryItem}
        />
      )}

      {openEditModal && (
        <EditInventoryModal
          handleCloseModal={handleCloseEditInventoryModal}
          selectedItem={selectedInventory}
          handleEditInventoryItem={handleEditInventoryItem}
        />
      )}

      {openDeleteInventoryModal && (
        <DeleteInventoryModal
          handleCloseModal={handleCloseDeleteInventoryModal}
          deleteItem={handleDeleteInventoryItem}
        />
      )}
    </>
  );
};

export default InventoryPage;
