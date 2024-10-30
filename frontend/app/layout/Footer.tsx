import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-500 max-w-[1120px] text-sm px-[65px]">
      <div className="flex justify-between flex-row px-6 py-5">
        <div className="flex flex-row gap-4">
          <Link href="/privacy-policy" className="hover:text-opacity-100">
            Privacy Policy
          </Link >
          <Link href="/terms-of-service" className="hover:text-opacity-100">
            Terms of Service
          </Link>
          <Link href="/security" className="hover:text-opacity-100">
            Security
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