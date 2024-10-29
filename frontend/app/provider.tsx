import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import React from "react";

const Provider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <React.StrictMode>
      <NextUIProvider>
        <Toaster position="top-center" />
        <div className="flex flex-col min-h-screen w-full items-center justify-items-center text-opacity-80">
          {children}
        </div>
      </NextUIProvider>
    </React.StrictMode>
  )
}

export default Provider;