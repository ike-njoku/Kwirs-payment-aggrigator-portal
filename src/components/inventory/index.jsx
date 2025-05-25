"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import InventoryFilter from "./InventoryFilter";
import InventorySearchBar from "./InventorySearchBar";
import InventoryTable from "../shared-components/table/InventoryTable";
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
  const [inventoryClasses, setInventoryClasses] = useState([]);
  const [inventoryBarcode, setInventoryBarcode] = useState([]);
  const [inventoryItemcodes, setInventoryItemcodes] = useState([]);
  const [filterKey, setFilterKey] = useState({
    filterOption: "",
    filterValue: "",
  });
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

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

  useEffect(() => {
    setLoading(true);
    if (inventoryTableData && inventoryTableData.length > 0) {
      const inventoryClassesList = inventoryTableData.map(
        (item) => item.ItemClassification
      );
      setInventoryClasses(inventoryClassesList);

      const inventoryBarcodesList = inventoryTableData.map(
        (item) => item.barcode
      );

      setInventoryBarcode(inventoryBarcodesList);

      const inventoryItemcodesList = inventoryTableData.map(
        (item) => item.itemCode
      );
      setInventoryItemcodes(inventoryItemcodesList);
    }
    setLoading(false);
  }, [inventoryTableData]);

  useEffect(() => {
    if (filterKey && inventoryTableData && inventoryTableData.length > 0) {
      let filteredData = [];
      setLoading(true);

      const { filterOption, filterValue } = filterKey;

      if (filterOption === "inventory class") {
        filteredData = inventoryTableData.filter(
          (item) =>
            item.ItemClassification &&
            item.ItemClassification.toLowerCase() === filterValue.toLowerCase()
        );
      }

      if (filterOption === "inventory barcode") {
        filteredData = inventoryTableData.filter((item) => {
          const itemBarcode = String(item.barcode); // Ensure string comparison
          return itemBarcode === filterValue;
        });
      }

      if (filterOption === "inventory code") {
        filteredData = inventoryTableData.filter(
          (item) =>
            item.itemCode &&
            String(item.itemCode).toLowerCase() === filterValue.toLowerCase()
        );
      }

      setFilteredTableData(filteredData);
      setLoading(false);
    }
  }, [filterKey, inventoryTableData]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue.trim()) {
        setLoading(true);
        const lower = searchValue.toLowerCase();
        const filtered = inventoryTableData.filter((item) =>
          item?.description?.toLowerCase().includes(lower)
        );

        console.log("Filtered Data:", filtered);
        setFilteredTableData(filtered);
        setLoading(false);
      } else {
        setFilteredTableData([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchValue, inventoryTableData]);

  const handleDeleteInventoryItem = async () => {
    try {
      console.log("1", selectedInventory);
      const response = await AxiosGet(
        `${API_BASE_URL}/api/Inventory/ItemDetails/Delete${selectedInventory.ItemCode}`
      );
      console.log(response);
    } catch (error) {}
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);
  const [currentRows, setCurrentRows] = useState([]);

  useEffect(() => {
    const activeData =
      filteredTableData.length > 0 ? filteredTableData : inventoryTableData;
    const newTotalPages = Math.ceil(activeData.length / rowsPerPage);
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages && newTotalPages > 10) {
      setCurrentPage(1);
    }

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(activeData.slice(indexOfFirstRow, indexOfLastRow));
  }, [inventoryTableData, currentPage, filteredTableData]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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
                <ul className="my-4 w-full flex  items-center lg:justify-start flex-wrap gap-4">
                  <InventoryFilter
                    setFilterKey={setFilterKey}
                    filterOption="inventory class"
                    filterData={
                      (inventoryClasses.length > 0 &&
                        inventoryClasses.map((item, index) => (
                          <option
                            key={index}
                            value={item}
                            className="capitalize text-sm p-2"
                          >
                            {item}
                          </option>
                        ))) ||
                      []
                    }
                  />
                  <InventoryFilter
                    setFilterKey={setFilterKey}
                    filterOption="inventory barcode"
                    filterData={
                      (inventoryBarcode.length > 0 &&
                        inventoryBarcode.map((item, index) => (
                          <option
                            key={index}
                            value={item}
                            className="capitalize text-sm p-2"
                          >
                            {item}
                          </option>
                        ))) ||
                      []
                    }
                  />
                  <InventoryFilter
                    setFilterKey={setFilterKey}
                    filterOption="inventory code"
                    filterData={
                      (inventoryItemcodes.length > 0 &&
                        inventoryItemcodes.map((item, index) => (
                          <option
                            key={index}
                            value={item}
                            className="capitalize text-sm p-2"
                          >
                            {item}
                          </option>
                        ))) ||
                      []
                    }
                  />
                </ul>
              </article>

              <section className="w-full mb-6 mt-8">
                <div className="flex justify-end w-full gap-4">
                  <InventorySearchBar
                    searchValue={searchValue}
                    handleChange={handleSearchChange}
                  />

                  <button
                    onClick={() => setOpenCreateModal(true)}
                    className="text-pumpkin dark:text-darkPumpkin2 font-medium rounded-lg text-sm px-5 py-2.5 border border-pumpkin flex items-center gap-2 dark:border-darkPumpkin2"
                  >
                    {"Add Inventory"}

                    <FaPlus />
                  </button>
                </div>

                <div className="mt-3 w-full">
                  <InventoryTable
                    // tableData={
                    //   filteredTableData.length > 0
                    //     ? filteredTableData
                    //     : inventoryTableData
                    // }
                    tableData={currentRows}
                    setCurrentTableData={setInventoryTableData}
                    handleDelete={handleOpenDeleteInventoryModal}
                    handleEdit={handleOpenEditInventoryModal}
                    loading={loading}
                  />

                  {(inventoryTableData.length > rowsPerPage ||
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
