"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table/BankAccountTable";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateBankAccountModal from "../shared-components/modals/CreateBankAccountModal";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";

const BankAccountPage = () => {
  const router = useRouter();

  const tableHeadings = [
    "Account Name",
    "Bank Name",
    "Account Number",
    "Agency",
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
    console.log("Function called with newResourceURL:", newResourceURL);

    // Ensure all required fields are present
    if (
      !newResourceURL?.CreatedBy ||
      !newResourceURL?.accountname ||
      !newResourceURL?.bankName ||
      !newResourceURL?.accountNumber ||
      !newResourceURL?.agencyId
    ) {
      console.error("Missing required fields:", newResourceURL);
      toast.error("Please provide all required fields.");
      return;
    }

    

    const newResourceData = {
      CreatedBy: newResourceURL.CreatedBy,
      accountname: newResourceURL.accountname,
      bankName: newResourceURL.bankName,
      accountNumber: newResourceURL.accountNumber,
      agencyId: newResourceURL.agencyId,
      // Agency: "TEST AGENCY",
    };

    console.log("newResourceData:", newResourceData);

    try {
      console.log("Sending request to create resource...");
      const createResourceResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Banks/Create`,
        newResourceData
      );

      console.log("Received response:", createResourceResponse);

      if (
        !createResourceResponse ||
        createResourceResponse.StatusCode !== 200
      ) {
        console.error("Error: Response status not 200", createResourceResponse);
        toast.error("Could not create resource.");
        return;
      }

      console.log("Resource creation successful, proceeding...");

      const createdDataRepresentation = {
        CreatedBy: newResourceURL.CreatedBy,
        accountname: newResourceURL.accountname,
        bankName: newResourceURL.bankName,
        accountNumber: newResourceURL.accountNumber,
        agencyId: newResourceURL.agencyId,
      };

      console.log(
        "Formatted createdDataRepresentation:",
        createdDataRepresentation
      );

      fetchAllResources();

      console.log("Updated table data with new resource.");
      toast.success("Resource created successfully");
    } catch (error) {
      console.error(
        "Create Resource Error:",
        error?.response?.data || error?.message || error
      );
      toast.error(
        `An error occurred: ${
          error?.response?.data?.message || "Request failed"
        }`
      );
    }
  };

  const handleDeleteItem = async (ResourceId) => {
    console.log("Deleting Resource with ID:", ResourceId); // Debugging log

    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Banks/Delete/${ResourceId}`
      );

      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Resource deleted successfully");

        fetchAllResources();

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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Banks/GetAllBankAccounts`
    );
    console.log("data1:", apiResponse);

    if (!apiResponse) {
      toast.error("Could not fetch resources");
      return;
    }

    const { data } = apiResponse;
    const tableData = data.Data || data.resources || [];

    console.log("data2:", apiResponse);

    if (!tableData.length) {
      toast.warn("No resources found");
      setTableData([]);
      return;
    }

    // Ensure correct key mapping
    const formattedData = tableData.map((item) => ({
      CreatedBy: item.createdBy,
      accountname: item.accountName,
      bankName: item.bankName,
      dateCreated: item.createdDate,
      accountNumber: item.account,
      agencyId: item.Agency,
      BankaccountId: item.BankaccountId,
    }));

    console.log("Updated Table Data State:", formattedData);

    setTableData(formattedData);
  };

  const handleEditItem = async (updatedItem, updateParameters) => {
    const { CreatedBy, accountname, bankName, agencyId, accountNumber } =
      updateParameters;

    const updateResourceURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/Banks/Update`;

    const payLoad = {
      bankId: updatedItem.BankaccountId,
      updatedBy: CreatedBy,
      // CreatedBy,
      accountname,
      bankName,
      accountNumber,
      agencyId,
    };

    console.log("Payload sent:", payLoad);

    try {
      const updateResourceResponse = await AxiosPost(
        updateResourceURL,
        payLoad
      );

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
      console.error("Error updating resource:", error.message || error);
      // toast.error("Failed to update resource. Please try again later.");
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
    <DashboardLayout page="Bank Accounts">
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
                Create Bank Account
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
              heading="Update Bank Account"
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
          <CreateBankAccountModal
            handleCloseModal={() => setOpenResourceModal(false)}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default BankAccountPage;
