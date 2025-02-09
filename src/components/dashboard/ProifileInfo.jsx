import React from "react";

const ProifileInfo = ({ propertyKeysName, value }) => {
  return (
    <li className="flex gap-3 items-center text-base">
      <h4 className="capitalize font-medium">{propertyKeysName}:</h4>
      <p className="font-normal capitalize">{value}</p>
    </li>
  );
};

export default ProifileInfo;
