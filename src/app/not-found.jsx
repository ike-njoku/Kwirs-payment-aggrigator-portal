import HomeNavigation from "@/components/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <section className="w-full bg-white min-h-screen flex flex-col justify-center items-center py-5">
      <HomeNavigation />
      <figure className=" max-w-[900px] w-[90%] mx-auto h-[500px] animate-custom-bounce">
        <Image
          src="/images/404IMG.png"
          alt="404"
          className="w-full h-full object-contain"
          width={900}
          height={500}
        />
      </figure>
      <div className="bg-pumpkin rounded-[30px] overflow-hidden max-w-[150px] h-[48px] w-full mt-6">
        <Link
          href="/"
          className="w-full h-full flex items-center justify-center bg-transparent text-white"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
