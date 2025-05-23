"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreateDamages from "../shared-components/modals/CreateDamages";

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

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

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


// Handle edit damage
// Handle edit damage with improved error handling
// Handle edit damage - structured like vendor update
// Handle edit damage with proper ID validation
// Updated handleEditItem function to match the modal's usage
const handleEditItem = async (updatedDamage) => {
  // Convert damageId to number and validate
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

// handle create damage 
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



// get all damages 
const GetAllDamages = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/Damages/GetAll`
      );
  
      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch Damages");
        return;
      }
      console.log("Damages data:", apiResponse.data.Data);
  
      // Date formatting function
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        
        try {
          const date = new Date(dateString);
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            hour12: true
          });
        } catch (error) {
          console.error("Error formatting date:", dateString, error);
          return dateString; // Return original if formatting fails
        }
      };
  
      let tableData = apiResponse.data.Data.map((item) => ({
        ...item,
        ItemCode: item.ItemCode,
        damageId: item.DamageId,
        store: item.Store,
        Description: item.Description,
        quantity: item.qty,
        SIVNo: item.SIVNo,
        IssuedDate: formatDate(item.IssuedDate), // Formatted date
        createdDate: formatDate(item.createdDate), // Formatted date
        // Keep original dates in case you need them for sorting
        originalIssuedDate: item.IssuedDate,
        originalCreatedDate: item.createdDate
      }));
  
      setTableData(tableData);
        console.log("Formatted table data:", tableData);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      toast.error("An error occurred while fetching Damages");
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
    GetAllDamages();
  }, []);

  return (
    <DashboardLayout page="Damages">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={() => setOpenCreateModal(true)}
              >
                Add Damages
                <FaPlus />
              </button>
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