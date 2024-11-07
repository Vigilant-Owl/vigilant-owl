import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-500 max-w-[1120px] text-sm px-4 sm:px-[60px]">
      <div className="flex flex-wrap justify-center md:justify-between flex-row px-6 py-5 text-base gap-2 sm:gap-4">
        <div className="flex flex-row gap-2 sm:gap-4 flex-wrap justify-center">
          <Link href="/privacy-policy" className="hover:text-blue-500 transition-all">
            Privacy Policy
          </Link >
          <Link href="/terms-of-service" className="hover:text-blue-500 transition-all">
            Terms of Service
          </Link>
        </div>
        <div className="flex flex-wrap justify-center flex-row text-sm sm:text-base">
          <div>&copy; 2024 Vigilant Owl</div><div>·All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;