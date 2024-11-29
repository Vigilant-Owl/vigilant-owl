"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Spacer, Spinner } from "@nextui-org/react";
import { getSessionDetail } from "@/apis/stripe";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SessionDetails = {
  id: string | null;
  payment_status: string | null;
  amount_total?: number;
  currency?: string;
};

const BillingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
    id: null,
    payment_status: null,
  });
  const router = useRouter();

  useEffect(() => {
    const getQueryParams = () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        return {
          sessionId: params.get("session_id"),
        };
      }
      return { sessionId: null };
    };

    const fetchSessionDetails = async (sessionId: string | null) => {
      if (!sessionId) {
        setError("No session ID found.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getSessionDetail(sessionId);

        if (response) {
          setSessionDetails(response);

          // Successful payment handling
          if (response.payment_status === "paid") {
            toast.success("Your subscription has been successfully activated. Thank you for using our service.");
          }
        } else {
          setError("Unable to retrieve session details.");
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
        setError("Payment verification failed. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    const { sessionId } = getQueryParams();
    fetchSessionDetails(sessionId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Verifying payment..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-red-500 p-4">
        <CardBody>
          <h1 className="text-2xl font-bold">Payment Verification Error</h1>
          <p>{error}</p>
          <Button
            onClick={() => router.push("/subscriptions")}
            color="primary"
          >
            Return to Subscriptions Page
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Spacer y={2} />
      <Card className="text-gray-300 p-4">
        <CardBody>
          <h1 className="text-2xl font-bold mb-4">Billing Confirmation</h1>

          {sessionDetails.payment_status === "paid" ? (
            <div className="text-green-500">
              <p>
                Payment successful for {(sessionDetails.amount_total || 0) / 100}{" "}
                {sessionDetails.currency?.toUpperCase()}
              </p>
            </div>
          ) : (
            <div className="text-yellow-500">
              <p>Payment is processing. Please check back later.</p>
            </div>
          )}

          {sessionDetails.id && (
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <strong>Session ID:</strong> {sessionDetails.id}
              </div>
              <div className="text-sm">
                <strong>Status:</strong> {sessionDetails.payment_status}
              </div>
            </div>
          )}

          <Spacer y={2} />
          <Button
            onClick={() => router.push("/new-group")}
            color="primary"
          >
            Go to Install Page
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default BillingPage;