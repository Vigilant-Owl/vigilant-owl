import Image from "next/image";
import logoImage from "../assets/logo.webp";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { FcCheckmark } from "react-icons/fc";

interface PlanCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  cancelText: string | null;
  headerGradient: string;
  currentSelected: number;
  index: number
  onSelect: () => void;
  isProcessing: boolean;
  possibleFreeTrial: boolean;
}

const PlanCard = ({ title, description, features, buttonText, cancelText, headerGradient, currentSelected, index, onSelect, isProcessing, possibleFreeTrial }: PlanCardProps) => (
  <Card
    className={`max-w-lg text-white transition-all ${currentSelected === index ? "border border-primary" : "border border-transparent"}`}
    isHoverable
    isDisabled={!possibleFreeTrial && index === 0}
    isBlurred={currentSelected === index}
  >
    <CardHeader className="flex justify-center items-center" style={{ background: headerGradient }}>
      <Image src={logoImage} className="rounded-full" alt={`${title} Logo`} width={100} height={100} />
    </CardHeader>
    <CardBody className="flex flex-col p-4 px-8 h-full text-center">
      <div className="text-xl font-bold pb-3">{title}</div>
      <div className="text-base pb-3 text-gray-200">{description}</div>
      <ul className="flex flex-col gap-3 text-sm text-gray-300">
        {features.map((feature, index) => (
          <li key={index} className="flex flex-row items-center gap-3">
            <FcCheckmark className="w-4 h-4 text-green-600" />
            <div>{feature}</div>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-10">
        <Button color="secondary" className="w-full font-bold text-base py-3"
          onClick={onSelect}
          isLoading={isProcessing && currentSelected === index}
          isDisabled={(currentSelected !== index && currentSelected !== -1) || isProcessing || (!possibleFreeTrial && index === 0)}
        >
          {currentSelected === index ? cancelText : buttonText}
        </Button>
      </div>
    </CardBody>
  </Card>
);

export default PlanCard;