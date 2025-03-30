"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table/TaxTextTable";
import { resourcesTableData } from "../../utils/table_data";
import { FaPlus } from "react-icons/fa";
import CreateTaxTypeModal from "../shared-components/modals/CreateTaxTypeModal";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { authenticateUser } from "../../services/auth-service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MAIN_MENU, SUB_MENU } from "../../utils/constants";

const TaxTypePage = () => {
  const router = useRouter();

  const tableHeadings = [
    "Tax Type Id",
    "Created By",
    "Head Code",
    "Sub Head Code",
    "Agency Id",
    "Service Id",
    "Description",
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
      !newResourceURL?.taxTypeId ||
      !newResourceURL?.createdBy ||
      !newResourceURL?.headCode ||
      !newResourceURL?.subHeadCode ||
      !newResourceURL?.agencyId ||
      // !newResourceURL?.serviceId ||
      !newResourceURL?.Dsecription
    ) {
      console.error("Missing required fields:", newResourceURL);
      toast.error("Please provide all required fields.");
      return;
    }

    const newResourceData = {
      taxTypeId: newResourceURL.taxTypeId,
      createdBy: newResourceURL.createdBy,
      headCode: newResourceURL.headCode,
      subHeadCode: newResourceURL.subHeadCode,
      agencyId: newResourceURL.agencyId,
      serviceId: newResourceURL.serviceId,
      Dsecription: newResourceURL.Dsecription,
    };

    console.log("Formatted newResourceData:", newResourceData);

    try {
      console.log("Sending request to create resource...");
      const createResourceResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/TaxTypes/Create`,
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
        taxTypeId: newResourceURL.taxTypeId,
        createdBy: newResourceURL.createdBy,
        headCode: newResourceURL.headCode,
        subHeadCode: newResourceURL.subHeadCode,
        agencyId: newResourceURL.agencyId,
        serviceId: newResourceURL.serviceId,
        Dsecription: newResourceURL.Dsecription,
      };

      console.log(
        "Formatted createdDataRepresentation:",
        createdDataRepresentation
      );

      setTableData((prevData) => [createdDataRepresentation, ...prevData]);

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

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
  };

  const handleDeleteItem = async (ResourceId) => {
    try {
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/TaxTypes/Delete/${ResourceId}`
      );

      if (deleteResponse?.data?.StatusCode === 200) {
        toast.success("Resource deleted successfully");

        setTableData((prevData) =>
          prevData.filter((item) => item.id !== ResourceId)
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
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/TaxTypes/GetAllTaxTypes`
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
      // taxTypeId: newResourceURL.taxTypeId,
      //   createdBy: newResourceURL.createdBy,
      //   headCode: newResourceURL.headCode,
      //   subHeadCode: newResourceURL.subHeadCode,
      //   agencyId: newResourceURL.agencyId,
      //   serviceId: newResourceURL.serviceId,
    //   Dsecription: newResourceURL.Dsecription,
    
    // Agency: "TEST AGENCY";
    // createdBy: "Admin";
    // createdDate: "2025-03-29T20:12:45.143";
    // description: "WHT";
    // headCode: "10001-001";
    // isActive: true;
    // serviceId: "";
    // subHeadCode: "1003";
    // taxtypeId: "DA";

    // Ensure correct key mapping
    const formattedData = tableData.map((item) => ({
      createdBy: item.createdBy,
      taxTypeId: item.taxtypeId,
      headCode: item.headCode,
      subHeadCode: item.subHeadCode,
      agencyId: item.Agency,
      serviceId: item.serviceId,
      Dsecription: item.description,
      dateCreated: item.createdDate,
      id: item.taxtypeId,
      isActive: item.isActive ?? true,
    }));

    console.log("Updated Table Data State:", tableData);

    setTableData(formattedData);
  };

  const handleEditItem = async (updatedItem, updateParameters) => {
    const {
      taxTypeId,
      createdBy,
      headCode,
      subHeadCode,
      agencyId,
      serviceId,
      Dsecription,
    } = updateParameters;

    const updateResourceURL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/TaxTypes/Update`;

    const payLoad = {
      psspId: updatedItem.id,
      taxTypeId: taxTypeId,
      createdBy: createdBy,
      headCode: headCode,
      subHeadCode: subHeadCode,
      agencyId: agencyId,
      serviceId: serviceId,
      Dsecription: Dsecription,
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
    <DashboardLayout page="Tax Type">
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
                Create Tax Type
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
              heading="Update Tax Type"
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
          <CreateTaxTypeModal
            handleCloseModal={() => setOpenResourceModal(false)}
            handleCreateModal={handleCreateResourceModal}
          />
        )}
      </section>
    </DashboardLayout>
  );
};

export default TaxTypePage;
