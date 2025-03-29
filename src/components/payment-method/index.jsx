"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateRoleModel from "../shared-components/modals/CreateRoleModel";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreatePaymentMethod from "../shared-components/modals/createPaymentMethod";

const RolesPage = () => {
  const tableHeadings = [
    "Description",
    "Payment Method",
    "Created By",
    // "Authorization",
    "Actions",
  ];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditPaymentModal, setOpenEditModal] = useState(false);
  const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  // deleting items
  const handleDeleteItem = async (paymentMethodId) => {
    try {
      const deleteResponse = await AxiosGet(
        // Use AxiosDelete if API supports DELETE
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentMethod/Delete/${paymentMethodId}`
      );
      console.log("delete response:", deleteResponse);
      if (
        deleteResponse?.status === 200 ||
        deleteResponse?.StatusCode === 200
      ) {
        toast.success("Payment method deleted successfully");

        // Update state to remove the deleted payment method
        setTableData((prevData) =>
          prevData.filter((item) => item.PaymentMethod !== paymentMethodId)
        );

        setOpenDeleteModal(false);
      } else {
        toast.error("Could not delete payment method");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the payment method");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
  }, []);

  const handleEditItem = async (
    updateBy = "Admin",
    description,
    requireAuthorization,
    paymentMethodId
  ) => {
    if (!paymentMethodId) {
      toast.error("Payment method ID is required");
      console.error("Error: Payment method ID is missing");
      return;
    }

    // Find the payment method in tableData
    const selectedPaymentMethod = tableData.find(
      (item) => item.paymentMethodId === paymentMethodId
    );

    if (!selectedPaymentMethod) {
      toast.error("Payment method not found");
      console.error("Error: Payment method not found in tableData");
      return;
    }

    // Create a copy to avoid modifying the original object
    const updatedPaymentMethod = { ...selectedPaymentMethod };

    // Update the fields only if they are provided
    if (description !== undefined)
      updatedPaymentMethod.Description = description;
    if (requireAuthorization !== undefined)
      updatedPaymentMethod.Authorization = requireAuthorization;
    if (updateBy !== undefined) updatedPaymentMethod.CreatedBy = updateBy;
    updatedPaymentMethod.PaymentMethod = paymentMethodId;

    console.log("Updated Payload:", updatedPaymentMethod);

    try {
      const updateRoleResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentMethod/Update`,
        updatedPaymentMethod
      );

      if (updateRoleResponse.StatusCode === 200) {
        toast.success("Payment Method Updated");
      } else {
        toast.error("Could not update Payment Method");
        console.error("Update Failed:", updateRoleResponse);
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("An error occurred while updating the Payment Method");
    }
  };

  const handleCloseCreatePaymentMethodModal = () => {
    setOpenPaymentMethodModal(false);
  };

  const handleOpenCreatePaymentMethodModal = () => {
    setOpenPaymentMethodModal(true);
  };

  // hand create payment method
  const handleCreatePaymentMethod = async (
    description,
    requireAuthorization,
    createdBy = "admin"
  ) => {
    setIsLoading(true);

    const newPaymentMethod = {
      Description: description,
      CreatedBy: createdBy,
      Authorization: requireAuthorization,
    };
    newPaymentMethod.Description = description;
    newPaymentMethod.CreatedBy = createdBy;
    newPaymentMethod.Authorization = requireAuthorization;

    const createPaymentMethod = await AxiosPost(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentMethod/Create`,
      newPaymentMethod
    );
    console.log("create response:", createPaymentMethod);

    if (createPaymentMethod.StatusCode !== 200) {
      toast.error("Could not create role");
      return;
    }
    setIsLoading(false);
    toast.success(" created successfully");
    newPaymentMethod.dateCreated = new Date().toISOString().split("T")[0];
    setTableData([...tableData, newPaymentMethod]);
  };

  useEffect(() => {
    getAllPaymentMethod();
  }, []);

  // get all payment method
  const getAllPaymentMethod = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/PaymentMethod/GetAllPaymentMethods`
      );

      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch payment methods");
        return;
      }

      let tableData = apiResponse.data.Data.map((item) => ({
        ...item,
        Description: item.description,
        PaymentMethod: item.paymentMethodId,
        CreatedBy: item.createdBy,
        Authorization: item.requireAUthorization,
        dateCreated: item.UpdateDate
          ? new Date(item.UpdateDate).toISOString().split("T")[0]
          : null,
      }));

      setTableData(tableData);
      console.log("tableData", tableData);
    } catch (error) {
      toast.error("An error occurred while fetching payment methods");
      console.error("Fetch error:", error);
    }
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
                onClick={handleOpenCreatePaymentMethodModal}
              >
                Create Payment Modal
                <FaPlus />
              </button>
            </section>
            {/* table */}
            <CustomTable
              tableHeadings={tableHeadings}
              tableData={tableData}
              isEllipseDropdwon={true}
              tableType="paymentMethod"
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              // openEditModal={openEditPaymentModal}
              openEditPaymentModal={openEditPaymentModal}
              setOpenEditPaymentModal={setOpenEditModal}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={handleEditItem}
              label="me"
              heading="Update PaymentMethod"
            />
          </div>
        </div>

        {openPaymentMethodModal && (
          <CreatePaymentMethod
            handleCloseModal={handleCloseCreatePaymentMethodModal}
            handleCreateModal={handleCreatePaymentMethod}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default RolesPage;
