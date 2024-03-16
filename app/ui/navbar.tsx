import Link from "next/link";
import { GitLogo } from "./logos";
import { LinkLogo } from "./logos";

export default function Navbar() {
  return (
    <div className="flex mb-4 px-10 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-1/3">
        <p>Fredrik Hansteen</p>
      </div>

      <div className="w-1/5">
        <a href="/">Home</a>
      </div>
      <div className="w-1/5">
        <a href="/about">CV</a>
      </div>
      <div className="w-1/5">
        <a href="/contact">Contact</a>
      </div>
      <div className="w-1/6">
        <Link href="https://www.linkedin.com/in/fredrik-carsten-hansteen-655287281/">
          <LinkLogo />
        </Link>
      </div>
      <div className="w-1/10">
        <Link href="https://github.com/fredrir">
          <GitLogo />
        </Link>
      </div>
    </div>
  );
}
