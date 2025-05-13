"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreateVendor from "../shared-components/modals/CreateVendor";

const Vendors = () => {
  const tableHeadings = [
    "Id",
    "Vendor Name",
    "Vendors Address",
    "Vendors Phone",
    "Vendors Email",
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
  const rowsPerPage = 5;
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

  const handleEditVendor = (vendor) => {
    console.log("Editing vendor:", vendor);
    setEditingVendor(vendor);
    setOpenEditModal(true);
  };

  const handleDeleteItem = async (vendorId) => {
    try {
      console.log("Vendor ID to delete:", vendorId);
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/Delete/${vendorId}`
      );
      
      if (deleteResponse?.status === 200 || deleteResponse?.StatusCode === 200) {
        toast.success("Vendor deleted successfully");
        setTableData((prevData) =>
          prevData.filter((item) => item.vendorId !== vendorId)
        );
        setOpenDeleteModal(false);
      } else {
        toast.error(deleteResponse?.StatusMessage || "Could not delete vendor");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the vendor");
    }
  };

  const handleEditItem = async (vendorName, email, address, phone) => {
    if (!editingVendor?.vendorId) {
      toast.error("Vendor ID is required");
      return;
    }

    const updatedVendor = {
      vendorId: editingVendor.vendorId,
      vendorName,
      email,
      address,
      phone
    };

    try {
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/Update`,
        updatedVendor
      );

      if (response.StatusCode === 200) {
        toast.success("Vendor updated successfully");
        GetAllVendors();
        setOpenEditModal(false);
      } else {
        toast.error(response.StatusMessage || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update vendor");
    }
  };

  const handleCreateVendor = async (vendorId, vendorName, email, address, phone) => {
    setIsLoading(true);
  
    const newVendor = {
      vendorId: vendorId,
      vendorName: vendorName,
      email: email,
      Address: address,
      phone: phone
    };
  
    try {
      const createResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/Create`,
        newVendor
      );
  
      if (createResponse.StatusCode !== 200) {
        toast.error(createResponse.StatusMessage || "Could not create Vendor");
        setIsLoading(false);
        return;
      }
  
      toast.success("Vendor created successfully");
      GetAllVendors();
      setIsLoading(false);
      setOpenCreateModal(false);
    } catch (error) {
      console.error("Create Vendor Error:", error);
      toast.error("An error occurred while creating the vendor");
      setIsLoading(false);
    }
  };

  const GetAllVendors = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/GetAll`
      );
  
      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch Vendors");
        return;
      }
  
      // Date formatting function (in case you need it for future date fields)
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
        VendorsId: item.vendorId,
        VendorsName: item.vendorName,
        VendorsAddress: item.address,
        VendorsEmail: item.email,
        VendorsPhone: item.phone,
        // If you have date fields in the future, format them like this:
        // formattedDateField: formatDate(item.originalDateField)
      }));
  
      setTableData(tableData);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      toast.error("An error occurred while fetching Vendors");
      console.error("Fetch error:", error);
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
    GetAllVendors();
  }, []);

  return (
    <DashboardLayout page="Vendors">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={() => setOpenCreateModal(true)}
              >
                Create Vendor
                <FaPlus />
              </button>
            </section>

            <CustomTable
              tableHeadings={tableHeadings}
              tableData={currentRows}
              isEllipseDropdwon={true}
              tableType="vendor"
              handleDelete={handleDelete}
              handleEdit={handleEditVendor}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              openEditVendorModal={openEditModal}
              setOpenEditPaymentModal={setOpenEditModal}
              handleDeleteItem={handleDeleteItem}
              editingVendor={editingVendor}
              handleEditItem={handleEditItem}
              label="me"
              heading="Update Vendor"
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
          <CreateVendor
            handleCloseModal={() => setOpenCreateModal(false)}
            handleCreateModal={handleCreateVendor}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default Vendors;