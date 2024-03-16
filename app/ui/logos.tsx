import Image from "next/image";

export function LinkLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <Image
        src="/linkedin.svg"
        alt="LinkedIn"
        className="h-8 w-8  hover:scale-150"
        width="32"
        height="32"
      />
    </div>
  );
}

export function GitLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <Image
        src="/github-mark-white.svg"
        alt="Github"
        className="h-8 w-8 hover:scale-150"
        width="32"
        height="32"
      />
    </div>
  );
}
