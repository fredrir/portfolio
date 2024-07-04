import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center">
          <br />
        </div>
        <div className="text-center">
          <br />
          <Link href="/cv">
            <h3 className="font-bold mb-3 text-2xl">CV</h3>
          </Link>
        </div>
        <div className="text-center">
          <br />
          <Link href="#landing-component">
            <h3 className="font-bold mb-3 text-2xl">Home</h3>
          </Link>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-gray-700 mt-8">
        <p>&copy; {new Date().getFullYear()} Fredrik Hansteen</p>
      </div>
    </footer>
  );
};

export default Footer;
