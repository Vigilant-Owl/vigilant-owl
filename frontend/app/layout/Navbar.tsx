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
// import QRCode from "@/components/QRCode";
import { Navbar, NavbarBrand, NavbarItem, NavbarContent, User, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react";
import Image from "next/image";
import logoImage from "@/assets/logo.webp";

const Header = () => {
  const supabase = createClient();
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Overview",
      route: "/overview"
    },
    {
      name: "Reports",
      route: "/reports"
    },
    {
      name: "Settings",
      route: "/settings"
    },
    {
      name: "Help",
      route: "/help"
    },
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
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/" className={`text-lg ${roboto.className} flex flex-row gap-2 items-center`}>
            <Image src={logoImage} width={36} height={36} alt="&#129417; Vigilant Owl" className="rounded-full" />
            Vigilant Owl
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4 w-full" justify="center">
        <NavbarBrand>
          <Link href="/" className={`text-xl ${roboto.className} flex flex-row gap-2 items-center`}>
            <Image src={logoImage} width={36} height={36} alt="&#129417; Vigilant Owl" className="rounded-full" />
            <div className="text-lg md:text-xl">Vigilant Owl</div>
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
            {/* <NavbarItem>
              <QRCode />
            </NavbarItem> */}
            <NavbarItem className="h-10">
              <Dropdown>
                <DropdownTrigger>
                  <User
                    className="cursor-pointer"
                    name={`${user.firstName} ${user.lastName}`}
                    description={user.email}
                    avatarProps={{
                      src: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=128&background=007bff&color=fff`
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="user">
                  <DropdownItem key="profile">
                    <Link href="/profile">
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="sign-out"
                    onClick={() => handleLogOut()}
                  >Sign Out</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem>
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
          <NavbarMenuItem key={`${item}-${index}`} onClick={() => setIsMenuOpen(false)}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href={item.route}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
        {user ? <>
          <NavbarMenuItem key="profile" onClick={() => setIsMenuOpen(false)}>
            <Link href="/profile">
              Profile
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem key="sign-out" onClick={() => handleLogOut()}>
            Sign Out
          </NavbarMenuItem>
        </> : <>
          <NavbarMenuItem key="login" onClick={() => setIsMenuOpen(false)}>
            <Login />
          </NavbarMenuItem>
          <NavbarMenuItem key="register" onClick={() => setIsMenuOpen(false)}>
            <Register />
          </NavbarMenuItem>
        </>}
      </NavbarMenu>
    </Navbar >
  )
}

export default Header;