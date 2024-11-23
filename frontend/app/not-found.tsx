"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">{"Oops! The page you're looking for does not exist."}</p>
        <Link href="/" passHref>
          <Button color="primary">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;