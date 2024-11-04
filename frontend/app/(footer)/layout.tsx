import { roboto } from "@/fonts";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${roboto.className}`}>
      {children}
    </div>
  )
}