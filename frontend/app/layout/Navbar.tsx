/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import NavbarMenus from "./NavbarMenus";
import Login from "../components/Login";
import Register from "../components/Register";
import { lato, roboto } from "../fonts";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { UserData } from "@/types";
import { toast } from "sonner";
import { Navbar, NavbarBrand, NavbarContent, User, NavbarMenuToggle, NavbarMenu, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Button } from "@nextui-org/react";
import Image from "next/image";
import logoImage from "@/assets/logo.webp";
import { usePathname } from "next/navigation";

const Header = () => {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: "Overview", route: "/overview", icon: "📊" },
    { name: "Reports", route: "/reports", icon: "📋" },
    { name: "Settings", route: "/settings", icon: "⚙️" },
    { name: "Help", route: "/help", icon: "❔" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error }: { data: any, error: any } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const user: UserData = {
        firstName: profile?.first_name || 'User',
        lastName: profile?.last_name || '',
        email: profile?.email,
      }
      setUser(user);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user profile");
    }
  }, [supabase]);

  const handleAuthStateChange = useCallback(async (event: string) => {
    if (event === "SIGNED_OUT") {
      setUser(null);
      clearStorage();
      toast.success("Signed out successfully");
    } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        toast.error("Authentication error");
        return;
      }
      if (user) {
        fetchUserProfile(user.id);
        toast.success("Signed in successfully");
      } else {
        setUser(null);
      }
    }
  }, [fetchUserProfile, supabase.auth]);

  const clearStorage = () => {
    [window.localStorage, window.sessionStorage].forEach((storage) => {
      Object.entries(storage).forEach(([key]) => {
        storage.removeItem(key);
      });
    });
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Session error");
        return;
      }
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    };

    fetchCurrentUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    return () => subscription.unsubscribe();
  }, [fetchUserProfile, handleAuthStateChange, supabase.auth]);

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error logging out");
    }
  }

  const navbarClassName = `
    max-w-[1120px] 
    text-2xl 
    ${lato.className} 
    transition-all 
    duration-300 
    ${isScrolled ? 'bg-default-100/50 backdrop-blur-md shadow-md' : 'bg-transparency'}
  `;

  return (
    <Navbar
      isBordered
      className={navbarClassName}
    >
      {/* Mobile Brand and Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-default-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <NavbarBrand>
          <Link
            href="/"
            className={`text-lg ${roboto.className} flex flex-row gap-2 items-center`}
          >
            <Image
              src={logoImage}
              width={32}
              height={32}
              alt="Vigilant Owl"
              className="rounded-full"
              priority
            />
            <span className="font-semibold text-default-900">Vigilant Owl</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Content */}
      <NavbarContent className="hidden sm:flex gap-4 w-full">
        <NavbarBrand>
          <Link
            href="/"
            className={`text-xl ${roboto.className} flex flex-row gap-2 items-center transition-transform hover:scale-105`}
          >
            <Image
              src={logoImage}
              width={36}
              height={36}
              alt="Vigilant Owl"
              className="rounded-full"
              priority
            />
            <div className="text-lg md:text-xl font-semibold text-default-900">
              Vigilant Owl
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4 w-full" justify="center">
        <NavbarMenus
          onClick={() => {
            if (!user) {
              toast.info("Please sign in to access this feature", {
                description: "Create an account or sign in to continue"
              });
            }
          }}
        />
      </NavbarContent>

      {/* Desktop Auth Content */}
      <NavbarContent className="hidden sm:flex" justify="end">
        {user ? (
          <Dropdown>
            <DropdownTrigger>
              <User
                className="cursor-pointer transition-opacity hover:opacity-80"
                name={`${user.firstName} ${user.lastName}`}
                description={user.email}
                avatarProps={{
                  src: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=128&background=007bff&color=fff`,
                  className: "transition-transform hover:scale-105"
                }}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User actions"
            >
              <DropdownItem key="profile">
                <Link href="/profile" className="flex items-center gap-2 text-default-900">
                  <span>👤</span> Profile
                </Link>
              </DropdownItem>
              <DropdownItem
                key="sign-out"
                className="text-danger"
                color="danger"
                onClick={handleLogOut}
              >
                <span className="flex items-center gap-2">
                  <span>🚪</span> Sign Out
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <Login />
            <Register />
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu
        className="bg-default-100/95 backdrop-blur-xl pt-6 px-4 gap-6 pb-4"
      >
        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <Link
              key={`${item}-${index}`}
              href={item.route}
              className={`transition-all flex items-center gap-3 ${pathname === item.route ? "bg-default-50" : "text-default-900 hover:bg-default-50"} p-2 rounded-lg transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span className="text-lg">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Auth Section */}
        <div className="mt-auto border-t dark:border-default-100/20 pt-4">
          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                className={`transition-all flex items-center gap-3 ${pathname === "/profile" ? "bg-default-50" : "text-default-900 hover:bg-default-50"} p-2 rounded-lg transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl w-6 text-center">👤</span>
                <span className="text-lg">Profile</span>
              </Link>
              <Button
                className="w-full justify-start gap-2 text-danger p-2"
                variant="light"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogOut();
                }}
              >
                <span className="text-xl w-6 text-center">🚪</span>
                <span className="text-lg">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Login />
              <Register />
            </div>
          )}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;