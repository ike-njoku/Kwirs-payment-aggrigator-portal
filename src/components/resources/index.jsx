"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateResourceModal from "../shared-components/modals/CreateResourceModal";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";
import PrintButton from "../shared-components/PrintButton";

const ResourcesPage = () => {
  const router = useRouter();

  const tableHeadings = [
    "Name",
    "Date Created",
    "Resource type",
    "Resource URL",
    "Actions",
  ];
  const [tableData, setTableData] = useState(resourcesTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditResourceModal, setOpenResourceEditModal] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const handleCreateResourceModal = async (newResourceURL) => {
    const newResourceData = {
      ResourceName: newResourceURL.resourceName,
      URL: newResourceURL.resourceUrl,
      Username: authenticatedUser.email,
      Type: newResourceURL.resourceType,
      ParentResourceId: newResourceURL.parentResourceId,
      UserName: authenticatedUser.tin,
    };

    try {
      const createResourceResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/Create`,
        newResourceData
      );

      if (createResourceResponse.StatusCode !== 200) {
        toast.error("Could not create resource.");
        return;
      }
      toast.success("Resource created successfully");

      const createdDataRepresentation = {
        name: newResourceURL.resourceName,
        resourceURL: newResourceURL.resourceUrl,
        Username: authenticatedUser.email,
        Type: newResourceURL.resourceType,
        ParentResourceId: 0,
        resourceType: newResourceURL.resourceType == 1 ? MAIN_MENU : SUB_MENU,
        dateCreated: new Date().toISOString().split("T")[0],
        ResourceId: createResourceResponse.Data.ResourseId,
      };

      setTableData((prevData) => [
        { ...createdDataRepresentation },
        ...prevData,
      ]);
    } catch (error) {
      console.error(
        "Create Resource Error:",
        error?.response?.data || error?.message
      );
      toast.error(
        `An error occurred: ${
          error?.response?.data?.message || "Request failed"
        }`
      );
    }
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleDeleteItem = async (ResourceId) => {
    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/Delete/${ResourceId}`
      );

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

  const fetchAllResources = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/GetAllResource`
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
    tableData.map((item) => (item.resourceType = item.ResourceTypeId));
    tableData.map(
      (item) =>
        (item.resourceType = item.ResourceTypeId == 1 ? MAIN_MENU : SUB_MENU)
    );
    tableData.map((item) => (item.resourceURL = item.URL));
    tableData.map(
      (item) =>
        (item.dateCreated = new Date(item.CreateDate)
          .toISOString()
          .split("T")[0])
    );

    setTableData(tableData);
  };

  const handleEditItem = async (updatedItem, updateParameters) => {
    updatedItem.ResourceType = updatedItem.resourceType == MAIN_MENU ? 1 : 2;

    const { resourceName, resourceType, resourceUrl, parentResourceId } =
      updateParameters;

    const updateResourceURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Resources/Update`;
    const payLoad = {
      ResourceName: resourceName,
      URL: resourceUrl,
      Username: authenticatedUser.email,
      Type: resourceType == MAIN_MENU ? 1 : 2,
      ResourceId: updatedItem.ResourceId,
      ParentResourceId: updatedItem.ParentResourceId,
      UserName: authenticatedUser.tin,
    };

    const updateResourceResponse = await AxiosPost(updateResourceURL, payLoad);

    if (updateResourceResponse?.StatusCode !== 200) {
      toast.error("Could not update Resource at this time");
      return;
    }

    toast.success("Resource updated");
    await fetchAllResources();
  };

  const handleOpenEditResourceModal = () => {
    setOpenResourceEditModal(true);
  };

  useEffect(() => {
    const isUserAuthenticated = authenticateUser();
    setAuthenticatedUser(isUserAuthenticated);
    fetchAllResources();
  }, []);

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <DashboardLayout page="Resources">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            {/* Search bar and filter options */}
            <section className="w-full mb-3 flex justify-between items-center gap-5 ">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={() => setOpenResourceModal(true)}
              >
                Create Resource
                <FaPlus />
              </button>

              <PrintButton data={tableData} fileName="resource_file.csv" />
            </section>

            {/* Table */}
            <CustomTable
              isResource={true}
              tableType="resource"
              tableHeadings={tableHeadings}
              tableData={currentRows}
              isEllipseDropdwon={true}
              handleDelete={() => setOpenDeleteModal(true)}
              handleEdit={handleOpenEditResourceModal}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditResourceModal={setOpenResourceEditModal}
              openEditResourceModal={openEditResourceModal}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={handleEditItem}
              text="Are you sure you want to delete this resource?"
              label="Resource name"
              heading="Update Resource"
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
