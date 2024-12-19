import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useRef } from "react";

type Props = {
  toggleDropdown: () => void;
};

const DropdownMenu = (props: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        props.toggleDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      className=" absolute right-0 z-10 w-48 py-2 px-2 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xl cursor-pointer dark:bg-gray-900 dark:border-gray-600 dark:text-white"
      ref={menuRef}
    >
      <Link href={"/"}>
        <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          Home
        </p>
      </Link>
      <Link href={"#contact-me"}>
        <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          Contact
        </p>
      </Link>

      <Link href={"/cv"}>
        <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          CV
        </p>
      </Link>

      <ThemeToggle />
    </div>
  );
};

export default DropdownMenu;
