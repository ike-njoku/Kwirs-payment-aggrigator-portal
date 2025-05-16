"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table/BranchesTable";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateBranchesModal from "../shared-components/modals/CreateBranchesModal";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";

const BankAccountPage = () => {
  const router = useRouter();

  const tableHeadings = ["Branch Id", "Branch Name", "Address", "Actions"];
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
    // Ensure all required fields are present
    if (
      // !newResourceURL?.CreatedBy ||
      !newResourceURL?.branchId ||
      !newResourceURL?.branchName ||
      !newResourceURL?.Address
    ) {
      toast.error("Please provide all required fields.");
      return;
    }

    const newResourceData = {
      // CreatedBy: newResourceURL.CreatedBy,
      branchId: newResourceURL.branchId,
      branchName: newResourceURL.branchName,
      Address: newResourceURL.Address,
      // Agency: "TEST AGENCY",
    };

    try {
      const createResourceResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/Create`,
        newResourceData
      );

      if (
        !createResourceResponse ||
        createResourceResponse.StatusCode !== 200
      ) {
        toast.error("Could not create resource.");
        return;
      }

      fetchAllResources();

      toast.success("Resource created successfully");
    } catch (error) {
      toast.error(
        `An error occurred: ${
          error?.response?.data?.message || "Request failed"
        }`
      );
    }
  };

  const handleDeleteItem = async (ResourceId) => {
    console.log("Deleting resource with ID:", ResourceId);
    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/Delete/${ResourceId}`
      );

      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Resource deleted successfully");

        fetchAllResources();

        setOpenDeleteModal(false);
      } else {
        toast.error("Could not delete resource");
        console.error("Delete response:", deleteResponse);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the resource");
    }
  };

  const fetchAllResources = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/GetAll`
    );

    if (!apiResponse) {
      toast.error("Could not fetch resources");
      return;
    }

    const { data } = apiResponse;
    const tableData = data.Data || data.resources || [];

    // console.log("Fetched data:", tableData);

    if (!tableData.length) {
      toast.warn("No resources found");
      setTableData([]);
      return;
    }

    // Ensure correct key mapping
    const formattedData = tableData.map((item) => ({
      // CreatedBy: item.createdBy,
      branchId: item.branchId,
      branchName: item.branchName,
      address: item.address,
      // accountNumber: item.account,
      // agencyId: item.Agency,
      // BankaccountId: item.BankaccountId,
    }));

    setTableData(formattedData);
  };

  const handleEditItem = async (_index, updateParameters) => {

    const updateResourceURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/Update`;

    const payLoad = {
      ...updateParameters,
    };

    try {
      const updateResourceResponse = await AxiosPost(
        updateResourceURL,
        payLoad
      );
      console.error("Edit response:", updateResourceResponse);

      if (
        !updateResourceResponse ||
        updateResourceResponse?.StatusCode !== 200
      ) {
        throw new Error(
          "Failed to update resource. Unexpected response from server."
        );
      }

      toast.success("Resource updated successfully!");
      await fetchAllResources();
    } catch (error) {
      toast.error("Failed to update resource. Please try again.");
      console.error("Edit response:", updateResourceResponse);
    }
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
    <DashboardLayout page="Store Branches">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            {/* Search bar and filter options */}
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={() => setOpenResourceModal(true)}
              >
                Create Store Branch
                <FaPlus />
              </button>
            </section>

            {/* Table */}
            <CustomTable
              isResource={false}
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
              heading="Update Branch"
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
          <CreateBranchesModal
            handleCloseModal={() => setOpenResourceModal(false)}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default BankAccountPage;
