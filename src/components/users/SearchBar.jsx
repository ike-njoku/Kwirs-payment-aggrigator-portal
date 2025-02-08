import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="w-full max-w-[250px] border border-gray-400 rounded-[30px] flex gap-3 items-center justify-between overflow-hidden px-3">
      <div className="w-[90%] h-[40px]">
        <input
          type="text"
          placeholder="Enter keyword..."
          className="w-full h-full outline-none border-none"
        />
      </div>
      <FaSearch className="text-gray-400" />
    </div>
  );
};

export default SearchBar;
