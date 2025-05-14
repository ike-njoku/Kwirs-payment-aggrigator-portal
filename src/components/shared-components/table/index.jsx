import React, { useState } from "react";
import SwitchIcon from "../../users/SwitchIcon";
import EllipseDropdown from "./EllipseDropdown";
import DeleteModal from "../modals/DeleteModal";
import EditModal from "../modals/EditModal";
import EditResourceModal from "../modals/EditResourceModal";
import EditPaymentMethodModal from "../modals/EditPaymentMethodModal";
import EditTaxOfficeModal from "../modals/EditTaxofficeModal";
import EditSendEmail from "../modals/EditSendEmail";
import EditVendorModal from "../modals/EditVendorsModal";
import EditDamagesModal from "../modals/EditDamagesModal";
import EditDamageModal from "../modals/EditDamagesModal";

const CustomTable = ({
  tableData,
  tableHeadings,
  isEllipseDropdwon,
  toggleStatus,
  handleDelete,
  handleEdit,
  openEditTaxOfficeModal,
  openDeleteModal,
  openEditVendorModal,
  openEditDamageModal,
  setOpenDeleteModal,
  setOpenEditResourceModal,
  openEditResourceModal,
  editingVendor,
  openEditModal,
  openEditPaymentModal,
  setOpenEditModal,
  handleDeleteItem,
  handleEditItem,
  openEditEmailModal,
  text,
  heading,
  label,
  isResource = false,
  tableType = "default", // Add this new prop to differentiate table types
  onPreviewClick, // Add this new prop
}) => {
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleCloseEditResourceModal = () => {
    setOpenEditResourceModal(false);
  };

  const handleCloseEditVendorModal = () => {
    setOpenEditModal(false)
  };

  const handleCloseEditDamagerModal = () => {
    setOpenEditModal(false)
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleClosePaymentMethodModal = () => {
    setOpenEditModal(false);
  };

  const handleCloseTaxOfficeModal = () => {
    setOpenEditModal(false);
  };

  const handleCloseEmailsModal = () => {
    setOpenEditModal(false);
  };

  const [paymentMethodId, setPaymentMethodId] = useState(0);

  const [selectedItem, setSelectedItem] = useState(0);

  // Function to render table cells based on table type
  const renderTableCell = (tableInfo, type) => {
    switch (type) {
      case "resource":
        return (
          <>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.name}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.dateCreated}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.resourceType}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.resourceURL}
            </td>
          </>
        );
      case "roles": // Add your other table types here
        return (
          <>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.name}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.dateCreated}
            </td>
          </>
        );
      case "paymentMethod": // Another table type
        return (
          <>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.PaymentMethod}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Description}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.CreatedBy}
            </td>
            {/* <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Authorization}
            </td> */}
          </>
        );

        case "vendor": // Another table type
        return (
          <>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.VendorsId}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.VendorsName}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.VendorsAddress}
            </td>
        
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.VendorsPhone}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.VendorsEmail}
            </td>
          </>
        );

      case "send-email": // Another table type
        return (
          <>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.SMS}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Email}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Description}
            </td>
            {/* <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Authorization}
            </td> */}
          </>
        );
      case "audit-log": // Another table type
        return (
          <>
            <td
              scope="row"
              className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.userName}
            </td>
            <td className="px-2 py-4 text-gray-900 capitalize">
              {tableInfo.date}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.machineAddress}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.machineName}
            </td>
            {/* <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.machineVersion}
            </td> */}
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.actionType}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.recordId}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.auditLogId}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              <button
                className="hover:text--600 bg-orange-600 rounded-xl text-white px-3 py-1"
                onClick={() => onPreviewClick(tableInfo.auditLogId)} // Use the prop here
              >
                Preview
              </button>
            </td>
          </>
        );
      case "tax-office": // Another table type
        return (
          <>
            <td
              scope
              className="px-3 py-4 font-medium text-gray-900 capitalize break-words "
            >
              {tableInfo.taxOfficeName}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.regionName}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.taxOfficeTypeName}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.officerName}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.taxOfficerPhone || "null"}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.city || "null"}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.lGAName || "null"}
            </td>

            {/* <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.IsActive}
            </td> */}
          </>
        );

        case "returnoutward": // Another table type
        return (
          <>
            <td
              scope
              className="px-3 py-4 font-medium text-gray-900 capitalize break-words "
            >
              {tableInfo.rOutwardId}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.VendorName || "null"}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.description
              }
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.qty}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Store}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.ReturnDate || "null"}
            </td>
          

            {/* <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.IsActive}
            </td> */}
          </>
        );

        case "damages": // Another table type
        return (
          <>
            <td
              scope
              className="px-6 py-4 font-medium text-gray-900 capitalize break-words "
            >
            {tableInfo.damageId || "null"}
            </td>
            
            <td className="px-6 py-4 text-gray-900 capitalize">
            {tableInfo.store || "null"}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.Description}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.SIVNo}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.quantity || "null"}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.IssuedDate || "null"}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.createdDate || "null"}
            </td>
          
          </>
        );

      default: // Default table type
        return (
          <>
            <td
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize"
            >
              {tableInfo.name}
            </td>
            <td className="px-6 py-4 text-gray-900 capitalize">
              {tableInfo.dateCreated}
            </td>
          </>
        );
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto h-auto shadow-md sm:rounded-lg">
        <table
          className={`w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ${
            tableType === "resource" ? "xl:table-fixed" : "lg:table-fixed"
          }`}
        >
          <thead className="text-xs text-white uppercase bg-pumpkin dark:bg-darkPumpkin2">
            <tr>
              {tableHeadings.map((heading, i) => (
                <th scope="col" className="px-6 py-3" key={i}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 &&
              tableData.map((tableInfo, i) => (
                <tr
                  className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                  key={i}
                >
                  {renderTableCell(tableInfo, tableType)}
                  {tableType !== "audit-log" && (
                    <td className="px-6 py-4 text-gray-900">
                      {isEllipseDropdwon ? (
                        <EllipseDropdown
                          handleDelete={handleDelete}
                          handleEdit={handleEdit}
                          setSelectedItem={setSelectedItem}
                          id={
                            tableInfo.TaxOfficeId ||
                            tableInfo.id ||
                            tableInfo.paymentMethodId || tableInfo.damageId ||
                            tableInfo.VendorsId || tableInfo.rOutwardId
                          }
                          item={tableInfo}
                          showDelete={tableType !== "send-email"} // Hide delete for "send-email"
                        />
                      ) : (
                        <SwitchIcon
                          isActive={tableInfo.isActive}
                          onToggle={toggleStatus}
                          index={i}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}

            {tableData.length === 0 && (
              <tr>
                <td colSpan={tableHeadings.length} className="bg-white">
                  <h3 className="w-full font-semibold py-5 text-2xl text-center">
                    No data available
                  </h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openDeleteModal && (
        <DeleteModal
          handleCloseModal={handleCloseDeleteModal}
          handleDeleteItem={handleDeleteItem}
          index={selectedItem}
          text={text}
        />
      )}
      {openEditModal && (
        <EditModal
          handleCloseModal={handleCloseEditModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )}

      {openEditPaymentModal && (
        <EditPaymentMethodModal
          handleCloseModal={handleClosePaymentMethodModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )}

{/* {openEditPaymentModal && (
        <EditPaymentMethodModal
          handleCloseModal={handleClosePaymentMethodModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )} */}

{openEditVendorModal && (
         <EditVendorModal
         handleCloseModal={handleCloseEditVendorModal}
         index={selectedItem}
         vendorData={editingVendor}
         handleEditModal={handleEditItem}
         heading={heading}
         label={label}
        />
      )}


{openEditDamageModal && (
         <EditDamagesModal
         handleCloseModal={handleCloseEditDamagerModal}
         index={selectedItem}
         damageData={editingVendor}
         handleEditModal={handleEditItem}
         heading={heading}
         label={label}
        />
      )}

    
      
      {openEditEmailModal && (
        <EditSendEmail
          handleCloseModal={handleCloseEmailsModal}
          index={selectedItem}
          handleEditModal={handleEditItem} // This should now be properly connected
          heading={heading}
          label={label}
        />
      )}

      {openEditTaxOfficeModal && (
        <EditTaxOfficeModal
          handleCloseModal={handleCloseTaxOfficeModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )}

      {openEditResourceModal && (
        <EditResourceModal
          handleCloseModal={handleCloseEditResourceModal}
          index={selectedItem}
          handleEditModal={handleEditItem}
          heading={heading}
          label={label}
        />
      )}
    </>
  );
};

export default CustomTable;
