import React from "react";
import DashboardLayout from "../shared-components/layouts/DashboardLayout";
import Image from "next/image";
import visa from "../../../public/images/visa-logo.png";
import stripe from "../../../public/images/stripe2.webp";
import paystack from "../../../public/images/paystack-logo.png";
import remita from "../../../public/images/remita.png";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";

const CreateNewTransaction = () => {
  return (
    <DashboardLayout
      page="New Transaction"
      subheading="How would you like to pay?"
    >
      <section className="w-full h-full mt-5">
        <div className="w-[90%] mx-auto xl:max-w-[1140px] lg:py-10">
          <Link
            href="/transactions"
            id="dropdownBgHoverButton"
            data-dropdown-toggle="dropdownBgHover"
            className="text-pumpkin focus:outline-none font-medium rounded-lg text-xl text-center inline-flex items-center gap-2"
            type="button"
          >
            <FaAngleLeft />
            Go back
          </Link>

          <div className="mt-8 w-full grid gap-5 place-center grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {[visa, paystack, stripe, remita].map((img, i) => {
              return (
                <div
                  className="border border-gray-400 rounded-[16px] w-full sm:max-w-[200px] py-6 relative cursor-pointer h-[150px] overflow-hidden"
                  key={i}
                >
                  <Image
                    src={img}
                    alt="alt-img"
                    className="object-contain"
                    fill
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CreateNewTransaction;
