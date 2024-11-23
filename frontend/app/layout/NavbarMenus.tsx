import { NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";

const Navbar = ({ pathname, onClick }: { pathname: string, onClick: () => void }) => {
  const navItems = [
    { href: "/new-group", label: "Open a new group" },
    { href: "/reports", label: "Reports" },
    { href: "/subscriptions", label: "Subscriptions" },
    { href: "/help", label: "Help" },
  ];

  return (
    <NavbarContent
      className="hidden sm:flex gap-4 text-xl font-[lato]"
      justify="center"
      onClick={onClick}
    >
      {navItems.map((item) => (
        <NavbarItem key={item.href}>
          <Link href={item.href} className={`${pathname.startsWith(item.href) ? "underline text-blue-500" : "no-underline"
            } transition-colors hover:text-blue-700 hover:underline hover:font-semibold`}>
            {item.label}
          </Link>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
};

export default Navbar;