"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { FaPlus } from "react-icons/fa";
import { AxiosPost, AxiosGet } from "../../services/http-service"; // <- use POST
import { toast } from "react-toastify";
import GetAuditLogs from "../shared-components/modals/GetAuditsLog";
import ModalLayout from "../shared-components/modals/ModalLayout";
import AuditDetialsModal from "../shared-components/modals/AuditDetialsModal";

const AuditLog = () => {
  const tableHeadings = [
    "User Name",
    "Date",
    "Machine Address",
    "Machine Name",
    // "Machine Version",
    "Action Type",
    "Record ",
    "Audit Log",
    "Preview",
  ];

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentLogDetails, setCurrentLogDetails] = useState([]);
  const [currentLogId, setCurrentLogId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [openAuditModal, setOpenAuditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);
  const [currentRows, setCurrentRows] = useState([]);

  useEffect(() => {
    const newTotalPages = Math.ceil(tableData.length / rowsPerPage);
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages && newTotalPages > 10) {
      setCurrentPage(1);
    }

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(tableData.slice(indexOfFirstRow, indexOfLastRow));
  }, [tableData, currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleOpenAuditModal = () => {
    setOpenAuditModal(true);
  };

  const handleCloseAuditModal = () => {
    setOpenAuditModal(false);
  };

  // This is the handler that will be called when Preview is clicked
  const handlePreviewClick = async (logId) => {
    setCurrentLogId(logId);
    setDetailsLoading(true);
    setDetailsModalOpen(true);

    try {
      const response = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Audithlog/GetAudithLogDetails/${logId}`
      );

      console.log("response", response.data.Data);
      // Ensure we're setting an array
      setCurrentLogDetails(response?.data.Data || []); // This ensures it's always an array

      if (!response?.data.Data) {
        toast.error("Could not load audit log details");
        setDetailsModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error(error.response?.data?.message || "Error loading details");
      setDetailsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ends here

  // fetching the Auditlog
  const fetchAuditLogs = async (filters = {}) => {
    setIsLoading(true);
  
    const data = {
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      UserName: filters.UserName || "",
      function: filters.function || "",
    };
    
    try {
      const apiResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Audithlog/GetAudithLog`,
        data
      );
  
      const actionMap = {
        I: "Create",
        U: "Update",
        D: "Delete",
      };
  
      const formattedData = apiResponse.Data.map((item) => ({
        userName: item.UserName,
        date: item.Date ? new Date(item.Date).toISOString().split("T")[0] : "",
        machineAddress: item.MachineIPAddress,
        machineName: item.MachineName,
        machineVersion: item.MachineOSVersion,
        actionType: actionMap[item.ActionType] || item.ActionType || "Unknown",
        recordId: item.RecordId,
        function: item.Function,
        auditLogId: item.AuditLogId,
      }));
  
      setTableData(formattedData);
  
      // Only show toast if there's data and status is 200
      if (apiResponse.StatusCode === 200) {
        if (formattedData.length > 0) {
          toast.success("Audit Log gotten Successfully!");
        }
        // No toast if formattedData is empty
      } else {
        toast.error(apiResponse.Message || "Could not get Audit Log.");
      }
  
      console.log("API Response:", apiResponse);
      console.log("Formatted Data:", formattedData);
    } catch (error) {
      console.error("API Error Details:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Error fetching audit logs");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <DashboardLayout page="Audit Log">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={handleOpenAuditModal}
              >
                Get Audit Logs
                <FaPlus />
              </button>
            </section>

            <CustomTable
              tableHeadings={tableHeadings}
              tableType="audit-log"
              tableData={currentRows}
              onPreviewClick={handlePreviewClick} // Pass the handler here
              label=""
              heading="Audit Log"
            />

            {tableData.length > rowsPerPage && (
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
            )}
          </div>
        </div>

        {openAuditModal && (
          <GetAuditLogs
            handleCloseModal={handleCloseAuditModal}
            handleCreateModal={fetchAuditLogs} // ✅ Pass it here
            isLoading={isLoading}
          />
        )}
      </section>

      {detailsModalOpen && (
        <AuditDetialsModal
          logId={currentLogId}
          onClose={() => setDetailsModalOpen(false)}
          details={currentLogDetails}
          isLoading={detailsLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default AuditLog;
