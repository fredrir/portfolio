import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center text-center">
          <br />
          <h2 className="text-3xl font-bold">Fredrik Hansteen</h2>
        </div>
        <div className="text-center">
          <br />
          <h3 className="font-bold mb-3 text-2xl">Resources</h3>
          <ul>
            <li>
              <Link href="/category/new-arrivals">
                <span className="cursor-pointer hover:underline">Example</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <br />
          <h3 className="font-bold mb-3 text-2xl">Info</h3>
          <ul>
            <li>
              <Link href="/policy">
                <span className="cursor-pointer hover:underline">Example</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-center">
          <br />
          <h3 className="font-bold mb-3 text-2xl">Hmm</h3>
          <ul></ul>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-gray-700 mt-8">
        <p>&copy; {new Date().getFullYear()} Fredrik Hansteen</p>
      </div>
    </footer>
  );
};

export default Footer;
