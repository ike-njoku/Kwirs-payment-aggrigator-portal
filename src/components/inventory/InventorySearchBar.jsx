import React from "react";

const InventorySearchBar = ({
  searchValue,
  handleChange,
  placeholder = "Search by description",
}) => {
  return (
    <div className=" w-full max-w-[200px] border-2 h-[40px] border-pumpkin dark:border-darkPumpkin2 text-pumpkin dark:text-darkPumpkin2 rounded-lg overflow-hidden">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        className="w-full outline-none h-full shadow-none bg-transparent dark:placeholder:text-darkMPumpkin placeholder:text-darkPumpkin2 text-pumpkin dark:text-darkPumpkin2 px-3"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InventorySearchBar;
