import React from "react";
import { displayDate } from "../../utils/functions";

const DashCard = ({ bg }) => {
  const date = displayDate();
  return (
    <div className={`bg-customGradient rounded-[30px] p-6 text-white mt-3`}>
      <article className="flex justify-between gap-3">
        <h3 className="w-full text-base font-medium capitalize">
          total payments
        </h3>
        <h3 className="text-sm font-medium capitalize italic">
          quantum<span className="text-pumpkin">Gateway</span>
        </h3>
      </article>

      <h4 className="font-semibold mt-5 text-white flex justify-start gap-1">
        <span className="text-2xl">&#8358;</span>
        <span className="text-[30px] lg:text-5xl">5,000</span>
        <span className="text-2xl font-normal mt-4">.00</span>
      </h4>

      <div className="mt-10 flex justify-between items-center gap-3">
        <article className="text-white">
          <h4 className="text-sm font-normal leading-normal">John Doe</h4>
          <p className="text-base font-semibold">N12345899</p>
        </article>

        <h3 className="font-normal text-sm">{date}</h3>
      </div>
    </div>
  );
};

export default DashCard;
