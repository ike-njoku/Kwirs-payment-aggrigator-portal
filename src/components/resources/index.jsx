"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateResourceModal from "../shared-components/modals/CreateResourceModal";
import { AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";

const ResourcesPage = () => {
  const tableHeadings = ["Name", "Date Created", "Actions"];
  const [tableData, setTableData] = useState(resourcesTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
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

  const handleEditItem = async (updatedItem, newRole) => {
    if (newRole) {
      const updateResourceURL =
        "http://nofifications.fctirs.gov.ng//api/Resources/Update";
      updatedItem.ResourceName = newRole;
      updatedItem.Username = authenticateUser.email;
      updatedItem.URL = newRole;

      const updateResourceResponse = await AxiosPost(
        updateResourceURL,
        updatedItem
      );

      if (!updateResourceResponse.StatusCode == 200) {
        toast.error("Could not update Resource at this time");
        return;
      }

      toast.success("Resource updated");
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === updatedItem.id ? { ...updatedItem, name: newRole } : item
        )
      );
    }
  };

  const handleCloseCreateRoleModal = () => {
    setOpenResourceModal(false);
  };

  const handleOpenCreateResourceModal = () => {
    setOpenResourceModal(true);
  };

  const handleCreateResourceModal = (newRole) => {
    console.log("resources");
    const newRoleData = {
      name: newRole,
      id: tableData.length + 1,
      dateCreated: "Tomorrow",
    };

    setTableData([...tableData, newRoleData]);
  };

  useEffect(() => {
    setAuthenticatedUser(authenticateUser());
  }, []);

  return (
    <DashboardLayout page="Resources">
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
                onClick={handleOpenCreateResourceModal}
              >
                Create Resource
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
              text="Are you sure you want to delete this resource?"
              label="Resource name"
              heading="Update Resource"
            />
          </div>
        </div>
        {openResourceModal && (
          <CreateResourceModal
            handleCloseModal={handleCloseCreateRoleModal}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default ResourcesPage;
