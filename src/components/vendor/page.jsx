"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateRoleModel from "../shared-components/modals/CreateRoleModel";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreatePaymentMethod from "../shared-components/modals/createPaymentMethod";
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
  const [openEditPaymentModal, setOpenEditModal] = useState(false);
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleEditVdendor = (vendor) => {
    console.log("Editing vendor:", vendor); // Debug log
    setEditingVendor(vendor);
    setOpenEditModal(true);
  };

// deleting Vendors
const handleDeleteItem = async (vendorId) => {
  try {
    // Use AxiosDelete if available, or implement a proper DELETE request
    console.log("Vendor ID to delete:", vendorId);
console.log("Full URL:", `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/Delete/${vendorId}`);
    const deleteResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/Delete/${vendorId}`
    );
    
    console.log("delete response:", deleteResponse);
    
    // Check response based on your API's structure
    if (deleteResponse?.status === 200 || deleteResponse?.StatusCode === 200) {
      toast.success("Vendor deleted successfully");

      // Update state to remove the deleted vendor
      setTableData((prevData) =>
        prevData.filter((item) => item.vendorId !== vendorId) // Changed to vendorId
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
  }, []);

  // handle edit Vendors
  // handle edit Vendors
// handle edit Vendors
// Update your edit handler to set the vendor data


// Update your handleEditItem function
const handleEditItem = async (vendorName, email, address, phone) => {
  if (!editingVendor?.vendorId) {
    toast.error("Vendor ID is required");
    return;
  }

  const updatedVendor = {
    vendorId: editingVendor.vendorId, // Use the original ID
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


  const handleCloseCreatePaymentMethodModal = () => {
    setOpenPaymentMethodModal(false);
  };

  const handleOpenCreatePaymentMethodModal = () => {
    setOpenPaymentMethodModal(true);
  };

  // hand create Vendors
  const handleCreateVendor = async (
    vendorId,
    vendorName,
    email,
    address,
    phone
  ) => {
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
      GetAllVendors(); // Refresh the vendor list
      setIsLoading(false);
      setOpenPaymentMethodModal(false); // Close the modal
    } catch (error) {
      console.error("Create Vendor Error:", error);
      toast.error("An error occurred while creating the vendor");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetAllVendors();
  }, []);

  // get all vendors 
  const GetAllVendors = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/GetAll`
      );

      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch Vendors ");
        return;
      }

      let tableData = apiResponse.data.Data.map((item) => ({
        ...item,
        VendorsId: item.vendorId,
        VendorsName: item.vendorName,
        VendorsAddress: item.address,
        VendorsEmail: item.email,
        VendorsPhone: item.phone
       
      }));

      setTableData(tableData);

      console.log("tableData", tableData);
    } catch (error) {
      toast.error("An error occurred while fetching Vendors ");
      console.error("Fetch error:", error);
    }
  };

  return (
    <DashboardLayout page="Vendors">
      <section className="w-full">
        <div className=" w-[90%] mx-auto py-5">
          <div className=" w-full lg:mt-10">
            {/* search bar and filter options here */}
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                id="dropdownBgHoverButton"
                data-dropdown-toggle="dropdownBgHover"
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  relative  gap-2 border border-pumpkin"
                type="button"
                onClick={handleOpenCreatePaymentMethodModal}
              >
                Create Vendor
                <FaPlus />
              </button>
            </section>
            {/* table */}
            <CustomTable
              tableHeadings={tableHeadings}
              tableData={tableData}
              isEllipseDropdwon={true}
              tableType="vendor"
              handleDelete={handleDelete}
              handleEdit={handleEditVdendor}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}

              setOpenEditModal={setOpenEditModal}
              // openEditModal={openEditPaymentModal}
              // openEditPaymentModal={openEditPaymentModal}
              openEditVendorModal={openEditPaymentModal}
              setOpenEditPaymentModal={setOpenEditModal}
              handleDeleteItem={handleDeleteItem}
              editingVendor={editingVendor}
              handleEditItem={handleEditItem}
              label="me"
              heading="Update PaymentMethod"
            />
          </div>
        </div>

        {openPaymentMethodModal && (
          <CreateVendor
            handleCloseModal={handleCloseCreatePaymentMethodModal}
            handleCreateModal={handleCreateVendor}
            isLoading={isLoading}
          />
        
        )}

      </section>
    </DashboardLayout>
  );
};

export default Vendors;
