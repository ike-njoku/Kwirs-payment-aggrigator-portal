"use client";
import React, { useState } from "react";
import AuthLayout from "../shared-components/auth-components/AuthLayout";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import Link from "next/link";
import { AxiosGet } from "../../services/http-service";

const RegisterPage = () => {
  const verifyTin = () => {
    console.log("THIS FUNCTION WAS CALLED");
    const defaultSID = "1";
    const uid = "";
    const tinValidationURL = `https://fcttaxportal.fctirs.gov.ng/api/etranzact/validation/${uid}/${defaultSID}`;
    return AxiosGet(tinValidationURL, "");
  };

  const [registerationDetails, setRegistrationDetails] = useState({
    taxIdentificationNumber: "",
    email: "",
    password: "",
  });

  const [registrationButtonIsDisabled, setRegistrationButtonIsDisabled] =
    useState(true);

  const updateRegistrationDetails = (e) => {
    const name = e.target.name;
    setRegistrationDetails((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));

    setRegistrationButtonIsDisabled(
      registerationDetails.email &&
        registerationDetails.taxIdentificationNumber &&
        registerationDetails.password
    );
  };

  const submitRequest = async () => {
    window.alert("Fill out form");
    return verifyTin();
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <section className="flex justify-between items-center py-5 mt-20 gap-8">
          <div className=" max-w-[600px] w-full hidden lg:flex flex-col justify-between ">
            <article className="w-full">
              <h3 className="text-white font-bold text-5xl w-full">
                Create New Account
              </h3>
              <div className="w-full lg:flex mt-5 hidden gap-1">
                <p className="text-base">Already have an account?</p>
                <Link href="/login" className="text-pumpkin text-base">
                  Login.
                </Link>
              </div>
            </article>

            <div className="w-full mt-16">
              <div className="w-full border-[3px] border-pumpkin max-w-[100px]"></div>
              <p className=" text-base leading-normal mt-3">
                Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                lorem ipsum.
              </p>
            </div>
          </div>
          {/*  */}
          <div className="w-full sm:max-w-[450px] mx-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.5)]">
            <h3 className="font-bold text-4xl capitalize text-center">
              register
            </h3>
            <form className="w-full my-5">
              <PrimaryInput
                label="TIN"
                name="taxIdentificationNumber"
                type="text"
                placeholder="N123456789"
                handleChange={updateRegistrationDetails}
              />
              <PrimaryInput
                label="email"
                name="email"
                type="email"
                placeholder="abc@gmail.com"
                handleChange={updateRegistrationDetails}
              />
              <PrimaryInput
                label="password"
                name="password"
                type="password"
                placeholder="********"
                handleChange={updateRegistrationDetails}
              />

              <AuthButtons
                isDisabled={registrationButtonIsDisabled}
                label="register"
              />
            </form>
          </div>
        </section>

        <div className="w-full flex justify-center lg:hidden gap-1">
          <p className="">Already have an account?</p>
          <Link href="/login" className="text-pumpkin">
            Login.
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
