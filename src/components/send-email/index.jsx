"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { FaPlus } from "react-icons/fa";
import { AxiosPost, AxiosGet } from "../../services/http-service";
import { toast } from "react-toastify";
import ModalLayout from "../shared-components/modals/ModalLayout";
import CreateSendEmail from "../shared-components/modals/CreateSendEmail";
import EditSendEmail from "../shared-components/modals/EditSendEmail";

const SendEmail = () => {
  const tableHeadings = ["SMS", "Email", "Description", "Edit"];
  const [tableData, setTableData] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);
  const [currentRows, setCurrentRows] = useState([]);

  useEffect(() => {
    const newTotalPages = Math.ceil(tableData.length / rowsPerPage);
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages && newTotalPages > 0) {
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

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenEditModal = (notification) => {
    setSelectedNotification(notification);
    setOpenEditModal(true);
  };
  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedNotification(null);
    setOpenEditModal(false);
  };

  // Handle create notification
  const handleCreateSendEmail = async ({ email, sms, description }) => {
    setIsLoading(true);
    try {
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/NotificationSettings/Create`,
        {
          Email: email,
          SMS: sms,
          Description: description,
        }
      );

      if (response?.StatusCode !== 200) {
        throw new Error(
          response?.StatusMessage || "Failed to create notification"
        );
      }

      toast.success("Notification created successfully");
      getSendEmail();
      handleCloseCreateModal();
    } catch (error) {
      toast.error(error.message || "Could not create notification");
      console.error("Create error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update notification
  const handleUpdateNotification = async (
    email,
    sms,
    description,
    notificationId
  ) => {
    if (!notificationId) {
      toast.error("Notification ID is required");
      console.error("Error: Notification ID is missing");
      return;
    }

    console.log("Editing Notification ID:", notificationId);
    // console.log("Update By:", updateBy); // Log to verifyx`

    // Prepare the payload to match backend expectations
    const updatedNotification = {
      // Ensure "admin" is passed correctly
      email,
      sms,
      description,
      Id: notificationId,
    };

    console.log("Updated Payload Sent to API:", updatedNotification); // Debugging log

    setIsLoading(true);
    try {
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/NotificationSettings/Update`,
        updatedNotification
      );

      console.log("API Response:", response); // Log full API response

      if (response?.StatusCode === 200) {
        toast.success("Notification updated successfully");
        getSendEmail(); // Refresh the list
      } else {
        throw new Error(
          response?.StatusMessage || "Failed to update notification"
        );
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(error.message || "Error updating notification");
    } finally {
      setIsLoading(false);
    }
  };

  // Get all notifications
  const getSendEmail = async () => {
    try {
      const response = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/NotificationSettings/GetNotifications`
      );

      if (!response?.data?.Data) {
        throw new Error("Invalid response structure");
      }

      setTableData(
        response.data.Data.map((item) => ({
          SMS: item.SMS,
          Email: item.Email,
          Description: item.Description,
          NotificationId: item.NotificationId,
          dateCreated: item.DateCreated
            ? new Date(item.DateCreated).toISOString().split("T")[0]
            : "",
        }))
      );
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    getSendEmail();
  }, []);

  return (
    <DashboardLayout page="Notification Setting">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={handleOpenCreateModal}
              >
                Notification Settings
                <FaPlus />
              </button>
            </section>

            <CustomTable
              tableHeadings={tableHeadings}
              tableType="send-email"
              tableData={currentRows}
              handleEdit={handleOpenEditModal} // Pass the correct handler
              setOpenEditModal={setOpenEditModal}
              isEllipseDropdwon={true}
              openEditEmailModal={openEditModal}
              setOpenEditPaymentModal={setOpenEditModal}
              label=" Edit Notification "
              heading="Notification Settings"
              handleEditItem={handleUpdateNotification} // Add this line
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

        {openCreateModal && (
          <CreateSendEmail
            handleCloseModal={handleCloseCreateModal}
            handleCreateModal={handleCreateSendEmail}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default SendEmail;
