"use client";
import React, { useState, useEffect } from "react";
import AuthLayout from "../shared-components/auth-components/AuthLayout";
import PrimaryInput from "../shared-components/inputs/PrimaryInput";
import AuthButtons from "../shared-components/buttons/AuthButtons";
import Link from "next/link";
import { AxiosGet, AxiosPost } from "../../services/http-service";
import {
  CLIENT_TIN_VALIDATION_ERROR,
  TIN_VALIDATION_ERROR,
} from "../../utils/constants";
import VerifyInput from "../shared-components/inputs/VerifyInput";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const verifyTin = async () => {
    const defaultSID = "1";
    const uid = registerationDetails.taxIdentificationNumber;
    const tinValidationURL = `https://fcttaxportal.fctirs.gov.ng/api/etranzact/validation/${uid}/${defaultSID}`;
    const taxIDValidationResponse = await AxiosGet(tinValidationURL, "");
    const { data } = taxIDValidationResponse;
    if (data.message == TIN_VALIDATION_ERROR) {
      toast.error(CLIENT_TIN_VALIDATION_ERROR);
      return;
    }

    setTinDetials({ ...data });
    setShowNextComponent(true);
  };

  const [registerationDetails, setRegistrationDetails] = useState({
    taxIdentificationNumber: "",
    email: "",
    password: "",
  });

  const [tinDetails, setTinDetials] = useState({});

  const [showNextComponent, setShowNextComponent] = useState(false);

  const [registrationButtonIsDisabled, setRegistrationButtonIsDisabled] =
    useState(true);

  const handleShowNextComponent = (e) => {
    e.preventDefault();
    const { taxIdentificationNumber, email, password } = registerationDetails;
    const isFormValid = taxIdentificationNumber && email && password;
    setRegistrationButtonIsDisabled(!isFormValid);
    setShowNextComponent(true);
  };

  const updateRegistrationDetails = (e) => {
    const name = e.target.name;
    setRegistrationDetails((previousValue) => ({
      ...previousValue,
      [name]: e.target.value,
    }));

    setRegistrationButtonIsDisabled(false);
  };

  const submitRegistrationRequest = async (e) => {
    e.preventDefault();
    return await verifyTin();
  };

  useEffect(() => {
    const { taxIdentificationNumber, email, password } = registerationDetails;
    setRegistrationButtonIsDisabled(
      !(taxIdentificationNumber && email && password)
    );
  }, [registerationDetails]);

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
                Simplify tax payments with an easy and efficient system.
              </p>
            </div>
          </div>
          {/*  */}

          <div className="w-full sm:max-w-[450px] mx-auto py-8 px-10 rounded-[28px] bg-[rgba(255,255,255,0.5)]">
            <h3 className="font-bold text-4xl capitalize text-center">
              {showNextComponent ? "Verify Details" : "Register"}
            </h3>
            {showNextComponent ? (
              <form
                className="w-full my-5 max-h-[350px] overflow-y-auto customScroll"
                onSubmit={submitRegistrationRequest}
              >
                <VerifyInput
                  disabled={true}
                  label="Tax Identification Number"
                  value={tinDetails.uid}
                />
                <VerifyInput
                  disabled={true}
                  label="fullname"
                  value={tinDetails.name}
                />
                <VerifyInput
                  disabled={true}
                  label="email"
                  value={tinDetails.email}
                />
                {/* <VerifyInput disabled={true} label="BVN" value="323456789" /> */}
                {/* <VerifyInput
                  disabled={true}
                  label="Date of birth"
                  value="23/04/2024"
                /> */}
                {/* <VerifyInput disabled={true} label="tax office" value="KUB" /> */}

                <AuthButtons isDisabled={false} label="Confirm Registration" />
              </form>
            ) : (
              <form
                className="w-full my-5"
                onSubmit={submitRegistrationRequest}
              >
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
                  type="text"
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
            )}
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
