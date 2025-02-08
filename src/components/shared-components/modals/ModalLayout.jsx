import React from "react";

const ModalLayout = ({ children, handleCloseModal }) => {
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50  justify-center items-center w-full bottom-0 max-h-full bg-[rgba(0,0,0,0.5)]"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-md text-gray-700">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
            data-modal-hide="popup-modal"
            onClick={handleCloseModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
