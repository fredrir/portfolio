import React from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

const Footer = () => {
  return (
    <footer className=" p-10">
      <div className="max-w-7xl mx-auto ">
        <HeartIcon className="h-6 w-6 text-red-500 mx-auto hover:scale-150 transition-transform duration-700" />
      </div>
      <div className="text-center pt-8 border-t border-gray-700 mt-8">
        <p>
          &copy; {new Date().getFullYear()} Fredrik Hansteen. All rights
          reserved.
        </p>
        <p>Licensed under the MIT License.</p>
      </div>
    </footer>
  );
};

export default Footer;
