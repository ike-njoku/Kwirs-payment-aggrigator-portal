"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateRoleModel from "../shared-components/modals/CreateRoleModel";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreateTaxOffices from "../shared-components/modals/CreateTaxOffices";

const Tax_office = () => {
  const tableHeadings = [
    "office Name",
    "Region",
    "Office",
    "Officer Name",
    "Phone",
    "City",
    "LGA",
    // "IsActive",
    "Actions",
  ];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditTaxOfficeModal, setOpenEditModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  // handle tax office delete
  const handleDeleteItem = async (TaxOfficeId) => {
    console.log("Deleting Tax Office ID:", TaxOfficeId); // Debugging
    if (!TaxOfficeId) {
      toast.error("Invalid Tax Office ID");
      return;
    }

    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/Delete/${TaxOfficeId}`
      );

      if (
        deleteResponse?.status === 200 ||
        deleteResponse?.StatusCode === 200
      ) {
        toast.success("Tax office deleted successfully");

        setTableData((prevData) =>
          prevData.filter((item) => item.taxOfficeId !== TaxOfficeId)
        );
        setOpenDeleteModal(false);
      } else {
        toast.error("Could not delete Tax office");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the Tax office");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
  }, []);

  // handle edit Tax Offices
  const handleEditItem = async (updatedTaxOffice) => {
    try {
      // Validate required fields
      if (!updatedTaxOffice.TaxOfficeId || !updatedTaxOffice.TaxOfficeName) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Prepare payload
      const payload = {
        TaxOfficeId: updatedTaxOffice.TaxOfficeId,
        TaxOfficeName: updatedTaxOffice.TaxOfficeName,
        TaxOfficeTypeId: updatedTaxOffice.TaxOfficeTypeId,
        RegionId: updatedTaxOffice.RegionId,
        Street: updatedTaxOffice.Street,
        City: updatedTaxOffice.City,
        LGAId: updatedTaxOffice.LGAId,
        Telephone: updatedTaxOffice.Telephone,
        TaxOfficerName: updatedTaxOffice.TaxOfficerName,
        TaxOfficerPhone: updatedTaxOffice.TaxOfficerPhone,
        isActive: updatedTaxOffice.isActive === "true",
      };

      // API Call
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/Update`,
        payload
      );

      if (response.StatusCode === 200) {
        toast.success("Tax Office Updated Successfully!");
        getAllTaxOffices();
      } else {
        toast.error(response.Message || "Could not update Tax Office.");
      }
    } catch (error) {
      console.error("Error updating Tax Office:", error);
      toast.error("An error occurred while updating the Tax Office.");
    }
  };

  const handleCloseCreateTaxOffice = () => {
    setOpenRoleModal(false);
  };

  const handleOpenCreateTaxOffice = () => {
    setOpenRoleModal(true);
  };

  // hand create payment method
  const handleCreateTaxOffice = async (formData) => {
    setIsLoading(true);

    const newTaxOffice = {
      TaxOfficeId: formData.TaxOfficeId,
      TaxOfficeName: formData.TaxOfficeName,
      TaxOfficeTypeId: formData.TaxOfficeTypeId,
      RegionId: formData.RegionId,
      Street: formData.Street,
      City: formData.City,
      LGAId: formData.LGAId,
      Telephone: formData.Telephone,
      TaxOfficerName: formData.TaxOfficerName,
      TaxOfficerPhone: formData.TaxOfficerPhone,
      isActive: formData.isActive,
    };

    console.log("newtaxoffice:", newTaxOffice);

    try {
      const createResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/Create`,
        newTaxOffice
      );

      console.log("Create response:", createResponse);

      if (createResponse?.StatusCode !== 200) {
        toast.error("Could not create tax office");
        return;
      }

      setIsLoading(false);
      toast.success("Tax office created successfully");

      // Update table data with the new tax office
      setTableData([
        ...tableData,
        {
          ...newTaxOffice,
          dateCreated: new Date().toISOString().split("T")[0],
        },
      ]);

      getAllTaxOffices(); // Refresh the list
    } catch (error) {
      console.error("Create Error:", error.response?.data || error);
      toast.error("An error occurred while creating the tax office");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTaxOffices();
  }, []);

  // get all tax offices here

  const getAllTaxOffices = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GetAllTaxOffices`
    );
    if (!apiResponse || !apiResponse.data) {
      toast.error("Could not fetch tax offices");
      return;
    }

    let tableData = apiResponse.data.Data.map((item) => ({
      ...item,
      taxOfficeId: item.TaxOfficeId,
      taxOfficeName: item.TaxOfficeName,
      regionName: item.RegionName,
      taxOfficeTypeName: item.TaxOfficeTypeName,
      createdBy: item.CreatedBy,
      officerName: item.TaxOfficerName,
      taxOfficerPhone: item.TaxOfficerPhone,
      city: item.City,
      lGAName: item.LGAName,
      isActive: item.IsActive,
      dateCreated: item.UpdateDate
        ? new Date(item.UpdateDate).toISOString().split("T")[0]
        : null,
    }));

    setTableData(tableData);
    console.log("tableDatasss", tableData);
  };

  return (
    <DashboardLayout page="Tax Office">
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
                onClick={handleOpenCreateTaxOffice}
              >
                Create Tax office
                <FaPlus />
              </button>
            </section>
            {/* table */}
            <CustomTable
              tableHeadings={tableHeadings}
              tableType="tax-office"
              tableData={tableData}
              isEllipseDropdwon={true}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              // openEditTaxOfficeModal={openEditTaxOfficeModal}
              openEditTaxOfficeModal={openEditTaxOfficeModal}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={handleEditItem}
              label="Role name"
              heading="Upate Roles"
            />
          </div>
        </div>

        {openRoleModal && (
          <CreateTaxOffices
            handleCloseModal={handleCloseCreateTaxOffice}
            handleCreateModal={handleCreateTaxOffice}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default Tax_office;
