import React from "react";
import ModalLayout from "./ModalLayout";

const DeleteModal = ({
  handleCloseModal,
  handleDeleteItem,
  index,
  text = "Are you sure you want to delete this role?",
}) => {
  const deleteItem = () => {
    handleDeleteItem(index);
  };
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className={`p-4 md:p-5 text-center`}>
        <svg
          className="mx-auto mb-4 text-gray-400 w-12 h-12"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <h3 className="mb-5 text-lg font-normal">{text}</h3>
        <button
          data-modal-hide="popup-modal"
          type="button"
          className="text-white bg-red-500 hover:bg-red-600 focus:outline-none dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
          onClick={deleteItem}
        >
          Yes, I'm sure
        </button>
        <button
          data-modal-hide="popup-modal"
          type="button"
          className="py-2.5 px-5 ms-3 text-sm font-medium text-pumpkin focus:outline-none bg-white rounded-lg border border-pumpkin hover:bg-gray-100"
          onClick={handleCloseModal}
        >
          No, cancel
        </button>
      </div>
    </ModalLayout>
  );
};

export default DeleteModal;
