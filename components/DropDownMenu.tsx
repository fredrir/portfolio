import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

type Props = {
  toggleDropdown: () => void;
};

const DropdownMenu = (props: Props) => {
  return (
    <div className=" absolute right-0 z-10 w-48 py-2 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-xl cursor-pointer dark:bg-gray-900 dark:border-gray-600 dark:text-white">
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
