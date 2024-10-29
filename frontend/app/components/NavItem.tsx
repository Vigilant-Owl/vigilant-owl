const NavbarItem = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="text-opacity-70 hover:text-opacity-100 hover:text-indigo-500 cursor-pointer"
    >
      {children}
    </div>
  );
}

export default NavbarItem;