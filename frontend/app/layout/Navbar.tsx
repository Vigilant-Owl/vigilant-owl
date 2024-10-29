import NavbarItem from "../components/NavItem";

const Navbar = () => {
  return (
    <nav className="flex flex-row gap-5 items-center font-[lato] text-base">
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
    </nav>
  )
}

export default Navbar;