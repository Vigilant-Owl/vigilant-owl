"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, Spacer } from "@nextui-org/react";

type SessionDetails = {
  id: string | null;
  payment_status: string | null;
  amount_total?: number;
  currency?: string;
};

const BillingPage: React.FC = () => {
  const [message, setMessage] = useState("Loading...");
  const [sessionDetails, setSessionDetails] = useState<SessionDetails>({
    id: null,
    payment_status: null,
  });

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
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/session/${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch session details");
      const sessionData = await response.json();
      setSessionDetails(sessionData);
      setMessage(
        `Payment successful for ${sessionData.amount_total / 100} ${sessionData.currency.toUpperCase()}.`
      );
    } catch (error) {
      setMessage("Error loading payment details.");
      console.error("Error fetching session details:", error);
    }
  };

  useEffect(() => {
    const { sessionId } = getQueryParams();
    console.log(sessionId);
    if (sessionId) {
      fetchSessionDetails(sessionId);
    } else {
      setMessage("No session ID found.");
    }
  }, []);

  return (
    <div>
      <Spacer y={2} />
      <Card className="text-gray-300 p-4">
        <CardBody>
          <h1>Billing Confirmation</h1>
          <div>{message}</div>
          {sessionDetails.id && (
            <>
              <Spacer y={1} />
              <div className="text-sm">Session ID: {sessionDetails.id}</div>
              <div className="text-sm">Status: {sessionDetails.payment_status}</div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default BillingPage;