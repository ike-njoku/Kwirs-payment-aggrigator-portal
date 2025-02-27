"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateResourceModal from "../shared-components/modals/CreateResourceModal";
import { toast } from "react-toastify";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { AxiosPost } from "../../services/http-service";
import { userIsAuthenticated } from "../../services/auth-service";

const ResourcesPage = () => {
  const tableHeadings = ["Name", "Date Created", "Actions"];
  const [tableData, setTableData] = useState(resourcesTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [openResourceModal, setOpenResourceModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("authDetails");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.email) {
          setAuthenticatedUser(parsedUser);
        } else {
          console.error("Stored user data is invalid.");
          localStorage.removeItem("authDetails");
        }
      } catch (error) {
        console.error("Error parsing authDetails:", error);
        localStorage.removeItem("authDetails");
      }
    }
  }, []);

  const handleCreateResourceModal = async ({ resourceName, resourceUrl }) => {
    const storedUser = localStorage.getItem("authDetails");

    if (!storedUser) {
      toast.error("User authentication is required.");
      return;
    }

    let authenticatedUser;
    try {
      authenticatedUser = JSON.parse(storedUser);
      if (!authenticatedUser?.email) {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      toast.error("Invalid authentication data. Please log in again.");
      return;
    }

    if (!resourceName.trim() || !resourceUrl.trim()) {
      toast.error("Resource Name and URL are required.");
      return;
    }

    const newResourceData = {
      ResourceName: resourceName,
      URL: resourceUrl,
      Username: authenticatedUser.email,
      Type: 2,
      ParentResourceId: 1,
    };

    try {
      const createResourceResponse = await AxiosPost(
        "http://nofifications.fctirs.gov.ng/api/Resources/Create",
        newResourceData
      );

      if (createResourceResponse.StatusCode !== 200) {
        toast.error("Could not create resource.");
        return;
      }

      toast.success("Resource created successfully");

      setTableData((prevData) => [
        {
          ...newResourceData,
          ResourceId:
            createResourceResponse?.data?.ResourceId || prevData.length + 1,
          dateCreated: new Date().toISOString().split("T")[0],
        },
        ...prevData,
      ]);
    } catch (error) {
      toast.error(
        `An error occurred: ${
          error.response?.data?.message || "Request failed"
        }`
      );
    }
  };

  const fetchAllResources = async () => {
    const apiResponse = await AxiosGet(
      "http://nofifications.fctirs.gov.ng/api/Resources/GetAllResource"
    );

    if (!apiResponse) {
      toast.error("Could not fetch resources");
      return;
    }

    const { data } = apiResponse;
    const tableData = data.Data || data.resources || [];

    if (!tableData.length) {
      toast.warn("No resources found");
      setTableData([]);
      return;
    }

    tableData.map((item) => (item.name = item.ResourceName));
    tableData.map((item) => (item.id = item.ResourceId));

    tableData.map(
      (item) =>
        (item.dateCreated = new Date(item.CreateDate)
          .toISOString()
          .split("T")[0])
    );

    setTableData(tableData);
  };

  useEffect(() => {
    fetchAllResources();
  }, []);

  const handleDeleteItem = async (ResourceId) => {
    try {
      const deleteResponse = await AxiosGet(
        `http://nofifications.fctirs.gov.ng/api/Resources/Delete/${ResourceId}`
      );

      console.log("Delete Response:", deleteResponse);

      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Resource deleted successfully");

        setTableData((prevData) =>
          prevData.filter((item) => item.ResourceId !== ResourceId)
        );

        setOpenDeleteModal(false);
      } else {
        toast.error("Could not delete resource");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the resource");
    }
  };

  return (
    <DashboardLayout page="Resources">
      <section className="w-full">
        <div className=" w-[90%] mx-auto py-5">
          <div className=" w-full lg:mt-10">
            {/* Search bar and filter options */}
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={() => setOpenResourceModal(true)}
              >
                Create Resource
                <FaPlus />
              </button>
            </section>

            {/* Table */}
            <CustomTable
              tableHeadings={tableHeadings}
              tableData={tableData}
              isEllipseDropdwon={true}
              handleDelete={() => setOpenDeleteModal(true)}
              handleEdit={() => setOpenEditModal(true)}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              openEditModal={openEditModal}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={(updatedItem, newRole) => {
                if (newRole) {
                  setTableData((prevData) =>
                    prevData.map((item) =>
                      item.id === updatedItem.id
                        ? { ...updatedItem, name: newRole }
                        : item
                    )
                  );
                }
              }}
              text="Are you sure you want to delete this resource?"
              label="Resource name"
              heading="Update Resource"
            />
          </div>
        </div>

        {/* Modal */}
        {openResourceModal && (
          <CreateResourceModal
            handleCloseModal={() => setOpenResourceModal(false)}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default ResourcesPage;
