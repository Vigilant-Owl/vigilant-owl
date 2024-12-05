"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FiBarChart2,
  FiFileText,
  FiSettings,
  FiHelpCircle,
  FiUser,
  FiLogOut
} from "react-icons/fi";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  User,
  NavbarMenuToggle,
  NavbarMenu,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Button
} from "@nextui-org/react";

import { createClient } from "@/utils/supabase/client";
import NavbarMenus from "./NavbarMenus";
import Login from "../components/Login";
import Register from "../components/Register";
import { lato, roboto } from "../fonts";
import logoImage from "@/assets/logo.webp";
import { useUserAuth } from "@/contexts/UserContext";

// Type definitions
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
}

interface MenuItem {
  name: string;
  route: string;
  icon: React.ReactNode;
}

// Constants
const MENU_ITEMS: MenuItem[] = [
  { name: "Open a new group", route: "/new-group", icon: <FiBarChart2 /> },
  { name: "Reports", route: "/reports", icon: <FiFileText /> },
  { name: "Subscriptions", route: "/subscriptions", icon: <FiSettings /> },
  { name: "Help", route: "/help", icon: <FiHelpCircle /> },
];

const SCROLL_THRESHOLD = 20;

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();

  // Memoized scroll handler to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  // Centralized storage clearing method
  const clearAllStorage = useCallback(() => {
    [window.localStorage, window.sessionStorage].forEach((storage) => {
      Object.keys(storage).forEach((key) => {
        storage.removeItem(key);
      });
    });
  }, []);

  // Fetch user profile with improved error handling
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error }: { data: any, error: any } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const userProfile: UserProfile = {
        firstName: profile?.first_name || 'User',
        lastName: profile?.last_name || '',
        email: profile?.email,
        id: userId,
      };

      setUser(userProfile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to fetch user profile");
    }
  }, [setUser, supabase]);

  // Handle authentication state changes
  const handleAuthStateChange = useCallback(async (event: string) => {
    switch (event) {
      case "SIGNED_OUT":
        setUser(null);
        clearAllStorage();
        toast.success("Signed out successfully");
        break;
      case "SIGNED_IN":
      case "USER_UPDATED":
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          toast.error("Authentication error");
          return;
        }
        if (user) {
          await fetchUserProfile(user.id);
          toast.success("Signed in successfully");
        } else {
          setUser(null);
        }
        break;
      case 'PASSWORD_RECOVERY':
        console.log("Password recovery session detected");
        break;
    }
  }, [clearAllStorage, fetchUserProfile, setUser, supabase]);

  // Logout handler
  const handleLogOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  }, [router, setUser, supabase]);

  // Effect for scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Effect for initial auth state and subscription
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Session error");
        return;
      }
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    };

    fetchCurrentUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    return () => subscription.unsubscribe();
  }, [fetchUserProfile, handleAuthStateChange, setUser, supabase]);

  // Dynamic navbar class names
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
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile Brand and Toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-default-500"
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
          pathname={pathname}
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
            <DropdownMenu aria-label="User actions">
              <DropdownItem
                key="profile"
                onClick={() => router.replace("/profile")}
              >
                <div className="flex items-center gap-2 text-default-900">
                  <FiUser /> Profile
                </div>
              </DropdownItem>
              <DropdownItem
                key="sign-out"
                className="text-danger"
                color="danger"
                onClick={handleLogOut}
              >
                <span className="flex items-center gap-2">
                  <FiLogOut /> Sign Out
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
          {MENU_ITEMS.map((item, index) => (
            <Link
              key={`${item.name}-${index}`}
              href={item.route}
              className={`transition-all flex items-center gap-3 ${pathname === item.route ? "bg-default-50" : "text-default-900 hover:bg-default-50"
                } p-2 rounded-lg transition-colors`}
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
                className={`transition-all flex items-center gap-3 ${pathname === "/profile" ? "bg-default-50" : "text-default-900 hover:bg-default-50"
                  } p-2 rounded-lg transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <FiUser className="text-xl w-6 text-center" />
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
                <FiLogOut className="text-xl w-6 text-center" />
                <span className="text-lg">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Login onClick={() => setIsMenuOpen(false)} />
              <Register onClick={() => setIsMenuOpen(false)} />
            </div>
          )}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;