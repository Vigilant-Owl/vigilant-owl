import { Checkbox } from "@nextui-org/react";
import Link from "next/link";

const LegalAgreement = ({ onClick, isChecked, setIsChecked }: { onClick: () => void, isChecked: boolean, setIsChecked: (state: boolean) => void }) => {
  return (
    <div className="flex items-start space-x-2 px-1">
      <Checkbox
        isSelected={isChecked}
        onChange={() => {
          setIsChecked(!isChecked);
        }}
        color="primary"
      >
        <span className="text-gray-800 dark:text-gray-200 text-sm">
          I agree to the{" "}
          <Link href="/privacy-policy" onClick={onClick} className="text-blue-600 hover:underline dark:text-blue-400">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-service" onClick={onClick} className="text-blue-600 hover:underline dark:text-blue-400">
            Terms of Service
          </Link>
          .
        </span>
      </Checkbox>
    </div>
  );
};

export default LegalAgreement;