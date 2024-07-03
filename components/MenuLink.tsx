import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";

interface Props {
  href: string;
  icon: string;
  active?: boolean;
}

export function MenuLink({
  href,
  icon,
  active,
  children,
}: React.PropsWithChildren & Props) {
  const linkClassnames = classNames(
    "mx-4 font-semibold flex gap-3 items-center p-3 rounded-lg hover:bg-fuchsia-50",
    { "bg-fuchsia-100": active }
  );
  return (
    <Link className={linkClassnames} href={href}>
      <span className="relative size-5">
        <Image src={icon} fill={true} alt="" sizes="20px" />
      </span>
      {children}
    </Link>
  );
}
