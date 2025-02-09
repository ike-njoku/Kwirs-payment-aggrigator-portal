import React from "react";
import ModalLayout from "./ModalLayout";
// import ProifileInfo from "@/components/dashboard/ProifileInfo";

import { IoTimeSharp } from "react-icons/io5";

const TransactionDetails = ({ details, handleCloseModal }) => {
  console.log({ details });
  return (
    <ModalLayout handleCloseModal={handleCloseModal}>
      <div className="w-full p-6">
        <h4 className="text-2xl text-black py-4 border-b border-b-gray-500">
          Transaction Details
        </h4>

        {/* <section className="mt-5 w-full">
          <ul className="w-full flex flex-col gap-4 my-6">
            <ProifileInfo
              propertyKeysName="description"
              value={details.title}
            />
            <ProifileInfo
              propertyKeysName="date"
              value={details.dateOfPayment}
            />
            <ProifileInfo
              propertyKeysName="amount (₦)"
              value={details.amount}
            />

            <li className="flex gap-3 items-center text-base">
              <h4 className="capitalize font-medium">status:</h4>
              <p className="font-normal flex capitalize gap-1 items-center text-yellow-500">
                <IoTimeSharp /> {details.status}
              </p>
            </li>
          </ul>
        </section> */}

        <section className="mt-5 w-full flex gap-8">
          <ul className="w-full flex flex-col gap-3 my-6 ">
            <li className="flex gap-3 items-center text-base w-fit">
              <h4 className="capitalize font-medium w-fit">description :</h4>
            </li>
            <li className="flex gap-3 items-center text-base w-fit">
              <h4 className="capitalize font-medium w-fit">status :</h4>
            </li>
            <li className="flex gap-3 items-center text-base w-fit">
              <h4 className="capitalize font-medium w-fit">amount (₦) :</h4>
            </li>
            <li className="flex gap-3 items-center text-base w-fit">
              <h4 className="capitalize font-medium w-fit">date :</h4>
            </li>
          </ul>
          <ul className="w-full flex flex-col gap-3 my-6">
            <li className="flex gap-3 items-center text-base">
              <p className="capitalize font-normal">{details.title}</p>
            </li>
            <li className="flex gap-3 items-center text-base">
              <p className="font-normal flex capitalize gap-1 items-center text-yellow-500">
                <IoTimeSharp /> {details.status}
              </p>
            </li>
            <li className="flex gap-3 items-center text-base">
              <p className="capitalize font-normal">{details.amount}</p>
            </li>
            <li className="flex gap-3 items-center text-base">
              <p className="capitalize font-normal">{details.dateOfPayment}</p>
            </li>
          </ul>
        </section>
      </div>
    </ModalLayout>
  );
};

export default TransactionDetails;
