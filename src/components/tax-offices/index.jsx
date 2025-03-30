"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateRoleModel from "../shared-components/modals/CreateRoleModel";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";

const Tax_office = () => {
  const tableHeadings = [
    "office Name",
    "Region",
    "Office",
    // "CreatedBy",
    "Phone",
    "City",
    "LGA",
    // "IsActive",
    "Actions",
  ];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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

  const handleEditItem = async (updatedItem, newRole) => {
    if (newRole) {
      const selectedRole = tableData.find((item) => item.id === updatedItem.id);
      selectedRole.name = newRole;
      selectedRole.RoleId = selectedRole.Id;
      selectedRole.UserName = authenticatedUser.tin;

      const updateRoleResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Roles/Update`,
        selectedRole
      );

      if (updateRoleResponse.StatusCode == 200) toast.success("Role Updated");
      else toast.error("Could not update role");
    }
  };

  const handleCloseCreateRoleModal = () => {
    setOpenRoleModal(false);
  };

  const handleOpenCreateRoleModal = () => {
    setOpenRoleModal(true);
  };

  const handleCreateRoleModal = async (newRole) => {
    setIsLoading(true);
    const newRoleData = {
      name: newRole,
      isActive: true,
    };

    newRoleData.Name = newRole;
    newRoleData.UserName = authenticatedUser.tin;

    const createRoleResponse = await AxiosPost(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Roles/Create`,
      newRoleData
    );

    if (createRoleResponse.StatusCode !== 200) {
      toast.error("Could not create role");
      return;
    }
    setIsLoading(false);
    toast.success("Role created successfully");
    newRoleData.dateCreated = new Date().toISOString().split("T")[0];
    setTableData([...tableData, newRoleData]);
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
                onClick={handleOpenCreateRoleModal}
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
              openEditModal={openEditModal}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={handleEditItem}
              label="Role name"
              heading="Upate Roles"
            />
          </div>
        </div>

        {openRoleModal && (
          <CreateRoleModel
            handleCloseModal={handleCloseCreateRoleModal}
            handleCreateModal={handleCreateRoleModal}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default Tax_office;
