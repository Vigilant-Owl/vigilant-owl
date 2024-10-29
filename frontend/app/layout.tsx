import type { Metadata } from "next";
import "./globals.css";
import Header from "./layout/Header";
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
      <body
        className="dark bg-[#151718] text-white"
      >
        <Provider>
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
