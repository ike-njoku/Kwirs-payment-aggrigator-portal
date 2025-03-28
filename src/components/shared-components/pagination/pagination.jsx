import React from "react";

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="flex justify-between items-center mt-4 px-4 py-2 bg-gray-100 border-t">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded ${
          currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
        }`}
      >
        Previous
      </button>

      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 text-sm font-medium rounded ${
          currentPage >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-pumpkin text-white hover:bg-orange-600"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
