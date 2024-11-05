import { NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";

const Navbar = ({ ...props }) => {
  return (
    <NavbarContent className="hidden sm:flex gap-4 text-xl font-[lato]" justify="center" {...props}>
      <NavbarItem>
        <Link href="/overview">
          Overview
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/reports">
          Reports
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/settings">
          Settings
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href="/help">
          Help
        </Link>
      </NavbarItem>
    </NavbarContent>
  )
}

export default Navbar;