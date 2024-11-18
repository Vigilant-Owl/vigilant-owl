import Image from "next/image";
import logoImage from "../assets/logo.webp";
import { Card, CardBody, CardHeader, Button } from "@nextui-org/react";
import { FcCheckmark } from "react-icons/fc";

interface PlanCardProps {
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  headerGradient: string;
  selected: boolean;
  onSelect: () => void;
}

const PlanCard = ({ title, description, features, buttonText, headerGradient, selected, onSelect }: PlanCardProps) => (
  <Card
    className={`max-w-lg text-white transition-all ${selected ? "border border-primary" : "border border-transparent"}`}
    isHoverable
    isBlurred={selected}
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
        >
          {buttonText}
        </Button>
      </div>
    </CardBody>
  </Card>
);

export default PlanCard;