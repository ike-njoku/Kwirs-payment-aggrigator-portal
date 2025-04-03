"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
import CreateTaxOffices from "../shared-components/modals/CreateTaxOffices";

const Tax_office = () => {
  const tableHeadings = [
    "office Name",
    "Region",
    "Office",
    "Officer Name",
    "Phone",
    "City",
    "LGA",
    "Actions",
  ];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditTaxOfficeModal, setOpenEditModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const [totalPages, setTotalPages] = useState(1);
  const [currentRows, setCurrentRows] = useState([]);

  // Update pagination when tableData changes
  useEffect(() => {
    const newTotalPages = Math.ceil(tableData.length / rowsPerPage);
    setTotalPages(newTotalPages);

    // Reset to page 1 if current page exceeds new total pages
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(1);
    }

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    setCurrentRows(tableData.slice(indexOfFirstRow, indexOfLastRow));
  }, [tableData, currentPage]);

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleDeleteItem = async (TaxOfficeId) => {
    if (!TaxOfficeId) {
      toast.error("Invalid Tax Office ID");
      return;
    }

    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/Delete/${TaxOfficeId}`
      );

      if (
        deleteResponse?.status === 200 ||
        deleteResponse?.StatusCode === 200
      ) {
        toast.success("Tax office deleted successfully");
        setTableData((prevData) =>
          prevData.filter((item) => item.taxOfficeId !== TaxOfficeId)
        );
        setOpenDeleteModal(false);
      } else {
        toast.error("Could not delete Tax office");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the Tax office");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
  }, []);

  const handleEditItem = async (updatedTaxOffice) => {
    try {
      if (!updatedTaxOffice.TaxOfficeId || !updatedTaxOffice.TaxOfficeName) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const payload = {
        TaxOfficeId: updatedTaxOffice.TaxOfficeId,
        TaxOfficeName: updatedTaxOffice.TaxOfficeName,
        TaxOfficeTypeId: updatedTaxOffice.TaxOfficeTypeId,
        RegionId: updatedTaxOffice.RegionId,
        Street: updatedTaxOffice.Street,
        City: updatedTaxOffice.City,
        LGAId: updatedTaxOffice.LGAId,
        Telephone: updatedTaxOffice.Telephone,
        TaxOfficerName: updatedTaxOffice.TaxOfficerName,
        TaxOfficerPhone: updatedTaxOffice.TaxOfficerPhone,
        isActive: updatedTaxOffice.isActive === "true",
      };

      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/Update`,
        payload
      );

      if (response.StatusCode === 200) {
        toast.success("Tax Office Updated Successfully!");
        getAllTaxOffices();
      } else {
        toast.error(response.Message || "Could not update Tax Office.");
      }
    } catch (error) {
      console.error("Error updating Tax Office:", error);
      toast.error("An error occurred while updating the Tax Office.");
    }
  };

  const handleCloseCreateTaxOffice = () => {
    setOpenRoleModal(false);
  };

  const handleOpenCreateTaxOffice = () => {
    setOpenRoleModal(true);
  };

  const handleCreateTaxOffice = async (formData) => {
    setIsLoading(true);

    const newTaxOffice = {
      TaxOfficeId: formData.TaxOfficeId,
      TaxOfficeName: formData.TaxOfficeName,
      TaxOfficeTypeId: formData.TaxOfficeTypeId,
      RegionId: formData.RegionId,
      Street: formData.Street,
      City: formData.City,
      LGAId: formData.LGAId,
      Telephone: formData.Telephone,
      TaxOfficerName: formData.TaxOfficerName,
      TaxOfficerPhone: formData.TaxOfficerPhone,
      isActive: formData.isActive,
    };

    try {
      const createResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/Create`,
        newTaxOffice
      );

      if (createResponse?.StatusCode !== 200) {
        toast.error("Could not create tax office");
        return;
      }

      toast.success("Tax office created successfully");
      getAllTaxOffices();
    } catch (error) {
      console.error("Create Error:", error.response?.data || error);
      toast.error("An error occurred while creating the tax office");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTaxOffices();
  }, []);

  const getAllTaxOffices = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/taxOffice/GetAllTaxOffices`
      );

      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch tax offices");
        return;
      }

      const formattedData = apiResponse.data.Data.map((item) => ({
        ...item,
        taxOfficeId: item.TaxOfficeId,
        taxOfficeName: item.TaxOfficeName,
        regionName: item.RegionName,
        taxOfficeTypeName: item.TaxOfficeTypeName,
        createdBy: item.CreatedBy,
        officerName: item.TaxOfficerName,
        taxOfficerPhone: item.TaxOfficerPhone,
        city: item.City,
        lGAName: item.LGAName,
        isActive: item.IsActive,
        dateCreated: item.UpdateDate
          ? new Date(item.UpdateDate).toISOString().split("T")[0]
          : null,
      }));

      setTableData(formattedData);
    } catch (error) {
      toast.error("Error fetching tax offices");
      console.error("Error:", error);
    }
  };

  return (
    <DashboardLayout page="Tax Office">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3 flex justify-end items-center gap-5 lg:justify-start">
              <button
                className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                type="button"
                onClick={handleOpenCreateTaxOffice}
              >
                Create Tax office
                <FaPlus />
              </button>
            </section>

            <CustomTable
              tableHeadings={tableHeadings}
              tableType="tax-office"
              tableData={currentRows}
              isEllipseDropdwon={true}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
              setOpenEditModal={setOpenEditModal}
              openEditTaxOfficeModal={openEditTaxOfficeModal}
              handleDeleteItem={handleDeleteItem}
              handleEditItem={handleEditItem}
              label=""
              heading="Update Tax Office"
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

        {openRoleModal && (
          <CreateTaxOffices
            handleCloseModal={handleCloseCreateTaxOffice}
            handleCreateModal={handleCreateTaxOffice}
            isLoading={isLoading}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default Tax_office;
