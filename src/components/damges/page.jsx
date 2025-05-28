"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreateDamages from "../shared-components/modals/CreateDamages";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Damages = () => {
  const tableHeadings = [
    "Id",
    "Store",
    "Description",
    "SIV No",
    "quantity",
    "Issued Date",
    "Created Date",
    "Actions",
  ];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState("all");
  const [allStores, setAllStores] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  
  // Filter data based on selected store and date range
  const filteredData = tableData.filter(item => {
    // Debug store matching
    console.log("Filtering - Item storeBranchId:", item.storeBranchId, "Type:", typeof item.storeBranchId);
    console.log("Selected store:", selectedStore, "Type:", typeof selectedStore);
    
    const storeMatch = selectedStore === "all" || 
                      String(item.storeBranchId) === String(selectedStore);
    
    if (!startDate && !endDate) return storeMatch;
    
    const itemDate = new Date(item.originalIssuedDate || item.originalCreatedDate || item.IssuedDate || item.createdDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    let dateMatch = true;
    if (start) dateMatch = dateMatch && itemDate >= start;
    if (end) dateMatch = dateMatch && itemDate <= end;
    
    const finalMatch = storeMatch && dateMatch;
    console.log("Item matches filters:", finalMatch, "Store match:", storeMatch, "Date match:", dateMatch);
    return finalMatch;
  });
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = (vendor) => {
    console.log("Editing vendor:", vendor);
    setEditingVendor(vendor);
    setOpenEditModal(true);
  };

  const handleDeleteItem = async (damageId) => {
    try {
      console.log("Damage ID to delete:", damageId);
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/Damages/Delete/${damageId}`
      );
      
      if (deleteResponse?.status === 200 || deleteResponse?.StatusCode === 200) {
        toast.success("Damage record deleted successfully");
        setTableData((prevData) =>
          prevData.filter((item) => item.damageId !== damageId)
        );
        setOpenDeleteModal(false);
      } else {
        toast.error(deleteResponse?.StatusMessage || "Could not delete damage record");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the damage record");
    }
  };

  const handleEditItem = async (updatedDamage) => {
    const damageIdNum = Number(updatedDamage.damageId || updatedDamage.damageid);
    if (!damageIdNum || isNaN(damageIdNum)) {
      toast.error("Valid Damage ID is required");
      return;
    }

    try {
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/Damages/Update`,
        {
          ItemCode: Number(updatedDamage.itemCode),
          damageid: damageIdNum,
          storeBranchId: Number(updatedDamage.storeBranchId),
          description: updatedDamage.description,
          qty: Number(updatedDamage.quantity),
          SIV: updatedDamage.sivNumber,
          createdBy: updatedDamage.createdBy || "Admin",
          Date: updatedDamage.date || new Date().toISOString()
        }
      );

      if (response.StatusCode === 200) {
        toast.success("Damage record updated successfully");
        GetAllDamages();
        setOpenEditModal(false);
      } else {
        toast.error(response.StatusMessage || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update damage record");
    }
  };

  const handleCreateDamage = async (damageData) => {
    setIsLoading(true);
  
    const newDamage = {
      ItemCode: Number(damageData.ItemCode),
      damageid: Number(damageData.damageid),
      Date: new Date().toISOString(),
      storeBranchId: Number(damageData.storeBranchId),
      createdBy: "Admin",
      description: damageData.description,
      qty: Number(damageData.qty),
      SIV: damageData.SIV
    };
  
    try {
      const createResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/Damages/Create`,
        newDamage
      );
  
      if (createResponse?.StatusCode !== 200) {
        toast.error(createResponse?.StatusMessage || "Could not create damage report");
        setIsLoading(false);
        return;
      }
  
      toast.success("Damage report created successfully");
      GetAllDamages();
      setIsLoading(false);
      setOpenCreateModal(false);
    } catch (error) {
      console.error("Create Damage Error:", error);
      toast.error("An error occurred while creating the damage report");
      setIsLoading(false);
    }
  };

  const GetAllDamages = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/Damages/GetAll`
      );
  
      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch Damages");
        return;
      }
  
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
          const date = new Date(dateString);
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour12: true
          });
        } catch (error) {
          console.error("Error formatting date:", dateString, error);
          return dateString;
        }
      };
  
      let tableData = apiResponse.data.Data.map((item) => ({
        ...item,
        ItemCode: item.ItemCode,
        damageId: item.DamageId,
        store: item.Store,
        storeBranchId: item.storeBranchId || item.StoreBranchId || item.BranchId, // Multiple possible property names
        Description: item.Description,
        quantity: item.qty,
        SIVNo: item.SIVNo,
        IssuedDate: formatDate(item.IssuedDate),
        createdDate: formatDate(item.createdDate),
        originalIssuedDate: item.IssuedDate,
        originalCreatedDate: item.createdDate
      }));
  
      console.log("Fetched damages data:", tableData);
      setTableData(tableData);
      setCurrentPage(1);
    } catch (error) {
      toast.error("An error occurred while fetching Damages");
      console.error("Fetch error:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/GetAll`
      );
      const branchesData = await response.json();
      if (branchesData.StatusCode === 200) {
        console.log("Fetched stores:", branchesData.Data);
        setAllStores(branchesData.Data);
      } else {
        toast.error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error loading store branches");
    }
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
    const fetchInitialData = async () => {
      await GetAllDamages();
      await fetchStores();
    };
    fetchInitialData();
  }, []);

  return (
    <DashboardLayout page="Damages">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Store Filter */}
                  <div className="flex items-center gap-2">
                    <label htmlFor="store-filter" className="block text-sm font-medium text-gray-700">
                      Filter by Store
                    </label>
                    <select
                      id="store-filter"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                      value={selectedStore}
                      onChange={(e) => {
                        console.log("Store selection changed:", e.target.value);
                        setSelectedStore(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Stores</option>
                      {allStores.map((store) => (
                        <option key={store.branchId} value={store.branchId}>
                          {store.branchName}
                        </option>
                      ))}
                    </select>
                    {selectedStore !== "all" && (
                      <button
                        onClick={() => {
                          setSelectedStore("all");
                          setCurrentPage(1);
                        }}
                        className="text-sm text-pumpkin hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Date Range Filter */}
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date Range
                    </label>
                    <div className="flex items-center gap-2">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          setCurrentPage(1);
                        }}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                      />
                      <span>to</span>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                          setEndDate(date);
                          setCurrentPage(1);
                        }}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                      />
                      {(startDate || endDate) && (
                        <button
                          onClick={clearDateFilters}
                          className="text-sm text-pumpkin hover:underline"
                        >
                          Clear Dates
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                  type="button"
                  onClick={() => setOpenCreateModal(true)}
                >
                  Add Damages
                  <FaPlus />
                </button>
              </div>
            </section>

            <CustomTable
              tableHeadings={tableHeadings}
              tableData={currentRows}
              isEllipseDropdwon={true}
              tableType="damages"
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              openEditDamageModal={openEditModal}
              setOpenEditPaymentModal={setOpenEditModal}
              handleDeleteItem={handleDeleteItem}
              selectedDamage={editingVendor}
              handleEditItem={handleEditItem}
              label="me"
              heading="Update Damage"
            />

            {/* Pagination Controls */}
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
          </div>
        </div>

        {openCreateModal && (
          <CreateDamages
            handleCloseModal={() => setOpenCreateModal(false)}
            handleCreateModal={handleCreateDamage}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default Damages;