import React from "react";

const DeleteModal = ({ handleCloseModal }) => {
  return (
    <>
      <div
        id="popup-modal"
        tabindex="-1"
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
              <h3 className="mb-5 text-lg font-normal">
                Are you sure you want to delete this role?
              </h3>
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-500 hover:bg-red-600 focus:outline-none dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
