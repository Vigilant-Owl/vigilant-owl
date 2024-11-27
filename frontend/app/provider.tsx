import 'react-phone-number-input/style.css'
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import React from "react";
import UserProvider from './contexts/UserContext';

const Provider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <React.StrictMode>
      <NextUIProvider>
        <Toaster position="top-right" />
        <div className="flex flex-col min-h-screen w-full items-center justify-items-center text-opacity-80">
          <UserProvider>
            {children}
          </UserProvider>
        </div>
      </NextUIProvider>
    </React.StrictMode>
  )
}

export default Provider;