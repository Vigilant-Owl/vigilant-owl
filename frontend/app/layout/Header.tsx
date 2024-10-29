import Link from "next/link";
import Navbar from "./Navbar";
import Login from "../components/Login";
import Register from "../components/Register";
import { lato, roboto } from "../fonts";

const Header = () => {
  return (
    <header className={`max-w-[1120px] text-2xl text-opacity-90 py-5 w-full flex flex-row justify-between border-b items-center border-gray-500 ${lato.className}`}>
      <Link href="/" className={`text-2xl ${roboto.className}`}>
        &#129417;
        Vigilant Owl
      </Link>
      <Navbar />
      <div className={`flex flex-row gap-2 ${roboto.className}`}>
        <Login />
        <Register />
      </div>
    </header>
  )
}

export default Header;