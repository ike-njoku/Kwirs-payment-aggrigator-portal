"use client";
import React, { useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateRoleModel from "../shared-components/modals/CreateRoleModel";

const RolesPage = () => {
  const tableHeadings = ["Name", "Date Created", "Actions"];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleDeleteItem = (id) => {
    const filteredTableData = tableData.filter((item) => id !== item.id);
    setTableData(filteredTableData);
    setOpenDeleteModal(false);
  };

  const handleEditItem = (updatedItem, newRole) => {
    if (newRole) {
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === updatedItem.id ? { ...updatedItem, name: newRole } : item
        )
      );
    }
  };

  const handleCloseCreateRoleModal = () => {
    setOpenRoleModal(false);
  };

  const handleOpenCreateRoleModal = () => {
    setOpenRoleModal(true);
  };

  const handleCreateRoleModal = (newRole) => {
    const newRoleData = {
      name: newRole,
      id: tableData.length + 1,
      dateCreated: "Tomorrow",
    };

    setTableData([...tableData, newRoleData]);
  };

  return (
    <DashboardLayout page="Roles">
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
                Create Role
                <FaPlus />
              </button>
            </section>
            {/* table */}
            <CustomTable
              tableHeadings={tableHeadings}
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
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default RolesPage;
