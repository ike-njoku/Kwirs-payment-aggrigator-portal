"use client";
import React, { useState } from "react";
import AuthLayout from "../shared-components/auth-components/AuthLayout";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import { toast } from "react-toastify";

const VeryTinPage = () => {
  const [tinDetails, setTinDetials] = useState({
    fullName: "",
    taxIdentificationNumber: "",
  });

  const updateRegistrationDetails = (e) => {
    const name = e.target.name;
    setTinDetials((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));
  };
  return (
    <AuthLayout>
      <div className="w-full">
        <section className="flex justify-between items-center py-5 mt-20 gap-8">
          <div className=" max-w-[600px] w-full hidden lg:flex flex-col justify-between ">
            <article className="w-full">
              <h3 className="text-white font-bold text-5xl w-full">
                Verify your TIN.
              </h3>
              <div className="w-full lg:flex mt-5 hidden gap-1">
                <p className="text-base">
                  Verify your <span className="text-pumpkin">TIN</span> in one
                  easy step.
                </p>
              </div>
            </article>

            <div className="w-full mt-16">
              <div className="w-full border-[3px] border-pumpkin max-w-[100px]"></div>
              <p className=" text-base leading-normal mt-3">
                Payment aggregation system.
              </p>
            </div>
          </div>
          {/*  */}
          <div className="w-full sm:max-w-[450px] mx-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.5)]">
            <h3 className={` font-bold text-4xl capitalize text-center`}>
              Verify TIN
            </h3>
            <form
              className="w-full my-5 max-h-[350px] overflow-y-auto customScroll"
              // onSubmit={submitRegistrationRequest}
            >
              <PrimaryInput
                label="Full Name"
                name="fullname"
                type="text"
                placeholder="eg. John Doe"
                handleChange={updateRegistrationDetails}
              />
              <PrimaryInput
                label="TIN"
                name="taxIdentificationNumber"
                type="text"
                placeholder="N123456789"
                handleChange={updateRegistrationDetails}
              />

              <AuthButtons isDisabled={false} label="Confirm Registration" />
            </form>
          </div>
        </section>
      </div>
    </AuthLayout>
  );
};

export default VeryTinPage;
