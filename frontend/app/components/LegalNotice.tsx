import Link from "next/link";

const LegalNotice = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="text-gray-800 dark:text-gray-200" onClick={onClick}>
      <p className="text-sm">
        Please review our{" "}
        <Link href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms-of-service" className="text-blue-600 hover:underline dark:text-blue-400">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
};

export default LegalNotice;