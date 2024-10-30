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
import QRCode from "@/components/QRCode";
import { Navbar, NavbarBrand, NavbarItem, NavbarContent, User, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";

const Header = () => {
  const supabase = createClient();
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  const fetchUserProfile = async (userId: string) => {
    const { data: profile }: { data: any } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const user: UserData = {
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      email: profile?.email,
    }
    setUser(user);
  };

  const handleAuthStateChange = useCallback(async (event: string) => {
    console.log(event);
    if (event === "SIGNED_OUT") {
      setUser(null);
      clearStorage();
    } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        fetchUserProfile(user.id);
      } else {
        setUser(null);
      }
    }
  }, []);

  const clearStorage = () => {
    [window.localStorage, window.sessionStorage].forEach((storage) => {
      Object.entries(storage).forEach(([key]) => {
        storage.removeItem(key);
      });
    });
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    };

    fetchCurrentUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      handleAuthStateChange(event);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogOut = async () => {
    await supabase.auth.signOut();
  }

  return (
    <Navbar
      isBordered
      className={`max-w-[1120px] text-2xl ${lato.className}`}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className={`text-xl ${roboto.className}`}>
            &#129417;
            Vigilant Owl
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 w-full" justify="center">
        <NavbarBrand>
          <Link href="/" className={`text-xl ${roboto.className}`}>
            &#129417;
            Vigilant Owl
          </Link>
        </NavbarBrand>
        <NavbarMenus
          onClick={() => {
            if (!user) {
              toast.info("Please sign in first.");
            }
          }}
        />
        {user ? (
          <NavbarContent justify="end">
            <NavbarItem>
              <QRCode />
            </NavbarItem>
            <NavbarItem className="h-10">
              <User
                onClick={() => handleLogOut()}
                name={`${user.firstName} ${user.lastName}`}
                description={user.email}
                avatarProps={{
                  src: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=128&background=007bff&color=fff`
                }}
              />
            </NavbarItem>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Login />
            </NavbarItem>
            <NavbarItem>
              <Register />
            </NavbarItem>
          </NavbarContent>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default Header;