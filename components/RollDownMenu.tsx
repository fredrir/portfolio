import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import classNames from "classnames";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RolldownMenu({
  isOpen,
  onClose,
  children,
}: React.PropsWithChildren & Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isHidden, setIsHidden] = useState(!isOpen);
  const [isRolledDown, setIsRolledDown] = useState(false);
  const titleId = useId();
  const rolldownMenuRef = useRef<HTMLDivElement | null>(null);

  const menuClasses = classNames(
    "fixed bg-white w-full h-full transition-transform duration-500",
    { "-translate-y-full": !isRolledDown, "translate-y-0": isRolledDown },
    { hidden: isHidden }
  );

  useEffect(() => {
    // Close the rolldown menu when the browser's back button has been pressed
    if (isOpen && !searchParams.has("open-menu")) {
      onClose();
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isOpen) {
      showMenu();
    } else {
      hideMenu();
    }
  }, [isOpen]);

  function showMenu() {
    router.push("?open-menu=true");
    // Remove 'display: none;' from the menu's styles before adding `translateY()` to allow the animation to work
    setIsHidden(false);
    setTimeout(() => {
      setIsRolledDown(true);
      rolldownMenuRef.current?.focus();
    }, 0);
  }

  function hideMenu() {
    setIsRolledDown(false);
    setTimeout(() => {
      // After the roll-up animation has completed, add 'display: none;' to the menu's styles so that it cannot be reached by keyboard navigation
      setIsHidden(true);
    }, 500);
  }

  return (
    <div
      className={menuClasses}
      aria-labelledby={titleId}
      tabIndex={-1}
      ref={rolldownMenuRef}
    >
      <h2 id={titleId} className="sr-only">
        Navigation menu
      </h2>
      {children}
    </div>
  );
}
