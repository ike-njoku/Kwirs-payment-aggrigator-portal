import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeNavigation = () => {
  return (
    <nav className="w-full bg-white sm:max-w-[500px] md:max-w-[600px] lg:max-w-[800px] mx-auto rounded-[30px] sticky top-6 z-50 py-2  overflow-hidden shadow-2xl">
      <div className="flex px-6 justify-between items-center gap-3 md:gap-6">
        <figure className="m-0 p-0 ">
          <Link href="/">
            <Image
              src="/images/fctirs-logo.jpeg"
              width={100}
              height={100}
              alt="logo"
              className="object-contain"
            />
          </Link>
        </figure>

        <div className="flex gap-1 sm:gap-4">
          <Link
            href="/login"
            className="text-pumpkin font-medium px-4 py-2 rounded-sm"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-pumpkin font-medium px-4 py-2 rounded-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavigation;
