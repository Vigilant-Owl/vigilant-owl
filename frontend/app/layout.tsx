import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Provider from "./provider";

export const metadata: Metadata = {
  title: "Vigilant Owl - Insights for Parents",
  description: "Vigilant Owl provides parents with non-intrusive insights into their children's group conversations across social media platforms, ensuring their safety and well-being.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark" >
        <Provider>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
