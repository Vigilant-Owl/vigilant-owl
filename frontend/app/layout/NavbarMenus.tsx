import { NavbarContent, NavbarItem } from "@nextui-org/react";

const Navbar = ({ ...props }) => {
  return (
    <NavbarContent className="hidden sm:flex gap-4 text-xl font-[lato]" justify="center" {...props}>
      <NavbarItem>
        Overview
      </NavbarItem>
      <NavbarItem>
        Reports
      </NavbarItem>
      <NavbarItem>
        Settings
      </NavbarItem>
      <NavbarItem>
        Help
      </NavbarItem>
    </NavbarContent>
  )
}

export default Navbar;