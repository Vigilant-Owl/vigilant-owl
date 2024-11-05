import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-500 max-w-[1120px] text-sm px-[60px]">
      <div className="flex flex-wrap justify-center md:justify-between flex-row px-6 py-5 text-base gap-4">
        <div className="flex flex-row gap-4">
          <Link href="/privacy-policy" className="hover:text-blue-500 transition-all">
            Privacy Policy
          </Link >
          <Link href="/terms-of-service" className="hover:text-blue-500 transition-all">
            Terms of Service
          </Link>
        </div>
        <span>
          &copy; 2024 Vigilant Owl · All rights reserved.
        </span>
      </div>
    </footer>
  )
}

export default Footer;