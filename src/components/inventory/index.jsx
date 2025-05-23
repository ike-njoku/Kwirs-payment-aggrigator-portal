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
  const [inventoryTableData, setInventoryTableData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [openDeleteInventoryModal, setOpenDeleteInventoryModal] =
    useState(false);
  const [loading, setLoading] = useState(false);

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
  const fetchAllInventory = async () => {
    try {
      setLoading(true);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemDetails/GetAll`
      );

      if (response.data.StatusCode !== 200) {
        toast.error(response.data.StatusMessage);
        return;
      }
      setInventoryTableData(response.data.Data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred.");
    }
  };

  useEffect(() => {
    fetchAllInventory();
  }, []);

  const handleDeleteInventoryItem = async () => {
    try {
      console.log("1", selectedInventory);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemDetails/Delete${selectedInventory.ItemCode}`
      );
      console.log(response);
    } catch (error) {}
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
          fetchAllInventory={fetchAllInventory}
        />
      )}

      {openEditModal && (
        <EditInventoryModal
          handleCloseModal={handleCloseEditInventoryModal}
          selectedItem={selectedInventory}
          handleEditInventoryItem={handleEditInventoryItem}
          fetchAllInventory={fetchAllInventory}
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
