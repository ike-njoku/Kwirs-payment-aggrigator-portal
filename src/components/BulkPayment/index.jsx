"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import BulkPaymentTable from "../shared-components/table/BulkPaymentTable";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateBulkPaymentModal from "../shared-components/modals/CreateBulkPaymentModal";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";
import PrintButton from "../shared-components/PrintButton";

const ResourcesPage = () => {
  const router = useRouter();

  const tableHeadings = [
    "S/N",
    "Tax Payer",
    "Channel",
    "TIN",
    "Tax Type",
    "Date",
    "Reference",
  ];
  const [tableData, setTableData] = useState(resourcesTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditResourceModal, setOpenResourceEditModal] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [lastBatchNumber, setLastBatchNumber] = useState(() => {
    // Get from localStorage or default to null
    const saved = localStorage.getItem("lastBatchNumber");
    return saved ? JSON.parse(saved) : null;
  });
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);

  const fetchAllResources = async () => {
    const apiResponse = await AxiosGet(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/DLPayments/GetPaymentByBatch/22 00`
    );

    if (!apiResponse) {
      // toast.error("Could not fetch resources");
      return;
    }

    const { data } = apiResponse;
    const tableData = data.Data || data.resources || [];

    if (!tableData.length) {
      // toast.warn("No resources found");
      setTableData([]);
      return;
    }

    // Ensure correct key mapping
    const formattedData = tableData.map((item) => ({
      CreatedBy: item.createdBy, // Ensure this matches your API response
      psspCode: item.code,
      Dsecription: item.description, // Fix possible typo: should be "Description"
      dateCreated: item.createdDate,
      // Ensure this is present in the API response
      id: item.PSSPId, // Ensure this is set if used in the table
      isActive: item.isActive ?? true, // Provide a default value if missing
    }));

    console.log("Updated Table Data State:", formattedData);

    // setTableData(formattedData);
  };

  useEffect(() => {
    const isUserAuthenticated = authenticateUser();
    setAuthenticatedUser(isUserAuthenticated);
    // fetchAllResources();
    const savedData = localStorage.getItem("persistedTableData");
    if (savedData) {
      setTableData(JSON.parse(savedData));
    }
  }, []);

  const handleCreateResourceModal = async (newResourceData) => {
    console.log("Function called with:", newResourceData);

    const { TaxOfficeId, TaxType, ExcelFile } = newResourceData;

    if (!TaxOfficeId || !TaxType || !ExcelFile) {
      toast.error("Please provide all required fields.");
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("TaxOfficeId", TaxOfficeId);
      formData.append("TaxType", TaxType);
      formData.append("ExcelFile", ExcelFile);

      console.log("Sending request with FormData...");
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/DLPayments/ExcelUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Received response:", response);

      if (!response || response.StatusCode !== 200) {
        toast.error("Could not create resource.");
        return false;
      }

      toast.success("Resource created successfully.");

      const rawData = response?.Data || [];

      // Save the BatchNumber of the first item for undo
      if (rawData.length > 0 && rawData[0].BatchNumber) {
        setLastBatchNumber(rawData[0].BatchNumber);
        localStorage.setItem(
          "lastBatchNumber",
          JSON.stringify(rawData[0].BatchNumber)
        );
      }

      const formattedData = rawData.map((item) => ({
        BatchNumber: item.BatchNumber,
        Channel: item.Channel,
        PaymentRef: item.PaymentRef,
        RequestId: item.RequestId,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        description: item.description,
        paymentDate: item.paymentDate,
        taxTypeId: item.taxTypeId,
        taxpayerName: item.taxpayerName,
        taxpayerTIN: item.taxpayerTIN,
      }));

      setTableData(formattedData);
      localStorage.setItem("persistedTableData", JSON.stringify(formattedData));

      console.log("Updated Table Data State:", formattedData);

      fetchAllResources?.();
      return true;
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error(
        `An error occurred: ${
          error?.response?.data?.message || "Request failed"
        }`
      );
      return false;
    }
  };

  // Undo handler
  const handleUndo = async () => {
    if (!lastBatchNumber) {
      toast.warning("No BatchNumber available to undo.");
      return;
    }

    try {
      const rollbackRes = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/DLPayments/RollBack/${lastBatchNumber}`
      );

      console.log("Rollback response:", rollbackRes);

      if (rollbackRes?.status === 200) {
        toast.success("Rollback successful.");
        setTableData([]); // clear table
        setLastBatchNumber(null); // clear batch number
        localStorage.removeItem("persistedTableData");
        localStorage.removeItem("lastBatchNumber");
      } else {
        toast.error("Rollback failed.");
      }
    } catch (error) {
      console.error("Rollback error:", error);
      toast.error("Error performing rollback.");
    }
  };

  const handleClearTable = () => {
    setTableData([]);
    setLastBatchNumber(null);
    localStorage.removeItem("persistedTableData");
    localStorage.removeItem("lastBatchNumber");
    toast.success("Data Saved successfully");
  };

  const handleDeleteItem = async (ResourceId) => {
    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/PSSP/Delete/${ResourceId}`
      );

      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Resource deleted successfully");

        // setTableData((prevData) =>
        //   prevData.filter((item) => item.id !== ResourceId)
        // );

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

  const handleEditItem = async (updatedItem, updateParameters) => {
    const { resourceName, resourceUrl, resourceDes } = updateParameters;

    const updateResourceURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/PSSP/Update`;

    const payLoad = {
      psspId: updatedItem.id, // ✅ Matches the expected key
      updatedBy: resourceName, // ✅ Matches "updatedBy"
      psspCode: resourceUrl, // ✅ Matches "psspCode"
      Dsecription: resourceDes, // ✅ Fix typo (was "Dsecription")
    };

    console.log("Payload sent:", payLoad);

    try {
      const updateResourceResponse = await AxiosPost(
        updateResourceURL,
        payLoad
      );

      if (updateResourceResponse?.StatusCode !== 200) {
        toast.error("Could not update Resource at this time");
        return;
      }

      toast.success("Resource updated");
      await fetchAllResources();
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource.");
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
    <DashboardLayout page="Bulk Payment">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            {/* Search bar and filter options */}
            <section className="w-full mb-3 flex justify-between items-center gap-5 lg:justify-start-">
              <div>
                <p className="text-[18px] font-semibold text-gray-700">
                  Batch Number:
                  <span className=" text-pumpkin"> {lastBatchNumber}</span>
                </p>{" "}
              </div>
              <div className="flex gap-2 items-center ">
                <button
                  className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                  type="button"
                  onClick={() => setOpenResourceModal(true)}
                >
                  Create Bulk Payment
                  <FaPlus />
                </button>
                <button
                  className="text-pumpkin border border-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2
             disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                  type="button"
                  onClick={handleUndo}
                  disabled={!lastBatchNumber}
                >
                  RollBack
                </button>
                <button
                  onClick={handleClearTable}
                  className="text-white bg-pumpkin hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
                >
                  Done
                </button>
                <PrintButton data={tableData} fileName="bulk_payment_file" />
              </div>
            </section>

            {/* Table */}
            <BulkPaymentTable
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
              heading="Bulk Payment"
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
          <CreateBulkPaymentModal
            handleCloseModal={() => setOpenResourceModal(false)}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default ResourcesPage;
