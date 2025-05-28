"use client";
import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import CustomTable from "../shared-components/table";
import { roleTableData } from "../../utils/table_data";
import { FaPlus, FaFilter, FaDownload } from "react-icons/fa";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import { toast } from "react-toastify";
// import CreateReturnOutward from "../shared-components/modals/CreateReturnOutward"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePDF } from 'react-to-pdf';
import CreateOutward from "../shared-components/modals/CreateOutward";

const ReturnOutward = () => {
  const { toPDF, targetRef } = usePDF({filename: 'return-outward-report.pdf'});
  const tableHeadings = [
    "Outward Id",
    "Vendor Name",
    "Description",
    "Quantity",
    "Store",
    "Return Date",
    "Actions",
  ];
  const [tableData, setTableData] = useState(roleTableData);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [allStores, setAllStores] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  
  // Filter states
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // State for dropdown visibility

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  // Filter data based on selected filters
  const filteredData = tableData.filter(item => {
    // Store filter
    const storeMatch = selectedStore === "all" ||
                      item.Store === selectedStore;
    
    // Vendor filter
    const vendorMatch = selectedVendor === "all" ||
                       item.vendorName === selectedVendor;
    
    // Date filter
    if (!startDate && !endDate) {
      console.log('Filtering item:', {
        itemStore: item.Store,
        selectedStore: selectedStore,
        storeMatch,
        itemVendor: item.vendorName,
        selectedVendor: selectedVendor,
        vendorMatch
      });
      return storeMatch && vendorMatch;
    }
    
    const itemDate = new Date(item.ReturnDate || item.Date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    let dateMatch = true;
    if (start) dateMatch = dateMatch && itemDate >= start;
    if (end) dateMatch = dateMatch && itemDate <= end;
    
    return storeMatch && vendorMatch && dateMatch;
  });
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleEditVendor = (vendor) => {
    console.log("Editing vendor:", vendor);
    setEditingVendor(vendor);
    setOpenEditModal(true);
  };

  const handleDeleteItem = async (rOutwardId) => {
    try {
      console.log("Return Outward ID to delete:", rOutwardId);
      const deleteResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/ReturnOutward/Delete/${rOutwardId}`
      );
      
      if (deleteResponse?.status === 200 || deleteResponse?.StatusCode === 200) {
        toast.success("OutWard deleted successfully");
        setTableData((prevData) =>
          prevData.filter((item) => item.rOutwardId !== rOutwardId)
        );
        setOpenDeleteModal(false);
      } else {
        toast.error(deleteResponse?.StatusMessage || "Could not delete vendor");
      }
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
      toast.error("An error occurred while deleting the vendor");
    }
  };

  const handleEditOutward = async (rOutwardId, itemCode, storeBranchId, description, vendor, qty) => {
    if (!rOutwardId) {
      toast.error("Outward ID is required");
      return;
    }
  
    const updatedOutward = {
      rOutwardId,
      ItemCode: Number(itemCode),
      storeBranchId: Number(storeBranchId),
      description,
      vendor: Number(vendor),
      qty: Number(qty),
      Date: new Date().toISOString(),
      createdBy: "Admin"
    };
  
    try {
      const response = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/ReturnOutward/Update`,
        updatedOutward
      );
  
      if (response.StatusCode === 200) {
        toast.success("Outward updated successfully");
        GetAllOutwards();
        setOpenEditModal(false);
      } else {
        toast.error(response.StatusMessage || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update outward");
    }
  };

  const handleCreateOutward = async (ItemCode, rOutwardId, storeBranchId, description, vendor, qty) => {
    setIsLoading(true);
  
    const newOutward = {
      ItemCode: Number(ItemCode),
      rOutwardId: Number(rOutwardId),
      storeBranchId: Number(storeBranchId),
      description: description,
      vendor: Number(vendor),
      qty: Number(qty),
      createdBy: "Admin",
      Date: new Date().toISOString()
    };
  
    try {
      const createResponse = await AxiosPost(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/ReturnOutward/Create`,
        newOutward
      );
  
      if (createResponse.StatusCode !== 200) {
        toast.error(createResponse.StatusMessage || "Could not create Outward");
        setIsLoading(false);
        return;
      }
  
      toast.success("Outward record created successfully");
      GetAllOutwards();
      setIsLoading(false);
      setOpenCreateModal(false);
    } catch (error) {
      console.error("Create Outward Error:", error);
      toast.error("An error occurred while creating the outward record");
      setIsLoading(false);
    }
  };

  const GetAllOutwards = async () => {
    try {
      const apiResponse = await AxiosGet(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Inventory/ReturnOutward/GetAll`
      );
  
      if (!apiResponse || !apiResponse.data) {
        toast.error("Could not fetch Outwards");
        return;
      }
  
      console.log('Raw API Response:', apiResponse.data.Data);
  
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      };
  
      let tableData = apiResponse.data.Data.map((item) => {
        // Ensure we're working with valid numbers
        const storeId = parseInt(item.storeBranchId, 10);
        const vendorId = parseInt(item.vendor, 10);
        
        console.log('Processing item:', {
          originalStoreId: item.storeBranchId,
          parsedStoreId: storeId,
          originalVendorId: item.vendor,
          parsedVendorId: vendorId
        });

        return {
          ...item,
          rOutwardId: item.rOutwardId,
          description: item.description,
          qty: item.qty,
          Store: item.Store,
          VendorName: item.vendorName,
          vendor: vendorId,
          storeBranchId: storeId,
          ReturnDate: formatDate(item.ReturnDate),
          originalReturnDate: item.ReturnDate
        };
      });
  
      console.log('Processed table data:', tableData);
      setTableData(tableData);
      setCurrentPage(1);
    } catch (error) {
      toast.error("An error occurred while fetching Outwards");
      console.error("Fetch error:", error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/StoreBranches/GetAll`
      );
      const branchesData = await response.json();
      if (branchesData.StatusCode === 200) {
        setAllStores(branchesData.Data);
      } else {
        toast.error("Failed to fetch stores");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Error loading store branches");
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/Vendors/GetAll`
      );
      const branchesData = await response.json();
      if (branchesData.StatusCode === 200) {
        setAllVendors(branchesData.Data);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error loading vendors");
    }
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const clearAllFilters = () => {
    setSelectedStore("all");
    setSelectedVendor("all");
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authDetails"));
    setAuthenticatedUser(user);
    const fetchInitialData = async () => {
      await GetAllOutwards();
      await fetchStores();
      await fetchVendors();
    };
    fetchInitialData();
  }, []);

  return (
    <DashboardLayout page="Return Outward">
      <section className="w-full">
        <div className="w-[90%] mx-auto py-5">
          <div className="w-full lg:mt-10">
            <section className="w-full mb-3">
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {/* Filter Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-pumpkin"
                    >
                      <FaFilter />
                      Filters
                    </button>
                    
                    {/* Filter Dropdown Content */}
                    {showFilters && (
                      <div className="absolute z-10 mt-2 w-72 bg-white rounded-md shadow-lg p-4 border border-gray-200">
                        <div className="space-y-4">
                          {/* Store Filter */}
                          <div>
                            <label htmlFor="store-filter" className="block text-sm font-medium text-gray-700 mb-1">
                              Store
                            </label>
                            <select
                              id="store-filter"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                              value={selectedStore}
                              onChange={(e) => {
                                setSelectedStore(e.target.value);
                                setCurrentPage(1);
                              }}
                            >
                              <option value="all">All Stores</option>
                              {allStores.map((store) => (
                                <option key={store.branchId} value={store.branchName}>
                                  {store.branchName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Vendor Filter */}
                          <div>
                            <label htmlFor="vendor-filter" className="block text-sm font-medium text-gray-700 mb-1">
                              Vendor
                            </label>
                            <select
                              id="vendor-filter"
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                              value={selectedVendor}
                              onChange={(e) => {
                                setSelectedVendor(e.target.value);
                                setCurrentPage(1);
                              }}
                            >
                              <option value="all">All Vendors</option>
                              {allVendors.map((vendor) => (
                                <option key={vendor.vendorId} value={vendor.vendorName}>
                                  {vendor.vendorName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Date Range Filter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date Range
                            </label>
                            <div className="space-y-2">
                              <DatePicker
                                selected={startDate}
                                onChange={(date) => {
                                  setStartDate(date);
                                  setCurrentPage(1);
                                }}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                              />
                              <DatePicker
                                selected={endDate}
                                onChange={(date) => {
                                  setEndDate(date);
                                  setCurrentPage(1);
                                }}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pumpkin focus:border-pumpkin"
                              />
                            </div>
                          </div>

                          {/* Clear Filters Button */}
                          <div className="flex justify-between">
                            <button
                              onClick={clearAllFilters}
                              className="text-sm text-pumpkin hover:underline"
                            >
                              Clear All Filters
                            </button>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="text-sm text-white bg-pumpkin px-3 py-1 rounded"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Filters Indicator */}
                  {(selectedStore !== "all" || selectedVendor !== "all" || startDate || endDate) && (
                    <div className="flex items-center gap-2 text-sm text-pumpkin">
                      <span>Filters Applied:</span>
                      {selectedStore !== "all" && (
                        <span className="bg-pumpkin/10 px-2 py-1 rounded">
                          Store: {allStores.find(s => s.branchName === selectedStore)?.branchName}
                        </span>
                        
                      )}
                      {selectedVendor !== "all" && (
                        <span className="bg-pumpkin/10 px-2 py-1 rounded">
                          Vendor: {allVendors.find(v => v.vendorName === selectedVendor)?.vendorName}
                        </span>
                      )}
                      {(startDate || endDate) && (
                        <span className="bg-pumpkin/10 px-2 py-1 rounded">
                          Date: {startDate?.toLocaleDateString()} {endDate ? `- ${endDate.toLocaleDateString()}` : ''}
                        </span>
                      )}
                      <button
                        onClick={clearAllFilters}
                        className="text-pumpkin hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                    type="button"
                    onClick={() => setOpenCreateModal(true)}
                  >
                    Add Return Outward
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => toPDF()}
                    className="text-pumpkin focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2 border border-pumpkin"
                  >
                    Download PDF
                    <FaDownload />
                  </button>
                </div>
              </div>
            </section>

            <div ref={targetRef}>
              <CustomTable
                tableHeadings={tableHeadings}
                tableData={currentRows}
                isEllipseDropdwon={true}
                tableType="returnoutward"
                handleDelete={handleDelete}
                handleEdit={handleEditVendor}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                setOpenEditModal={setOpenEditModal}
                openEditReturnOutwardModal={openEditModal}
                setOpenEditPaymentModal={setOpenEditModal}
                handleDeleteItem={handleDeleteItem}
                selectedReturnOutward={editingVendor}
                handleEditItem={handleEditOutward}
                label="me"
                heading="Update Return Outward"
              />
            </div>

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

        {openCreateModal && (
          <CreateOutward
            handleCloseModal={() => setOpenCreateModal(false)}
            handleCreateModal={handleCreateOutward}
            isLoading={isLoading}
          />
      
        )}
      </section>
    </DashboardLayout>
  );
};

export default ReturnOutward;