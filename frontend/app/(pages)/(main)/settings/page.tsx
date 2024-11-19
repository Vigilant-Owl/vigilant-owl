"use client"
import React, { useState } from "react";
import PlanCard from "@/components/PlanCard";
import { loadStripe } from '@stripe/stripe-js';
import { checkout } from "@/apis/stripe";

const PricingPlans = () => {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  const plans = [
    {
      title: "Free Trial",
      description: "Experience all features for free for a limited time.",
      features: ["Full Access to All Features", "Limited Time Offer", "Available on a Single Device"],
      buttonText: "Start Free Trial",
      headerGradient: "linear-gradient(to right, #232526, #414345)",
    },
    {
      title: "Monthly Subscription",
      description: "Enjoy features on a month-to-month basis.",
      features: ["All Features Included", "Cancel Anytime", "Priority Support"],
      buttonText: "Subscribe Monthly",
      headerGradient: "linear-gradient(to right, #1e3c72, #2a5298)",
    },
    {
      title: "Yearly Subscription",
      description: "Get the best value with a yearly subscription.",
      features: ["All Features Included", "Two Months Free", "Priority Support"],
      buttonText: "Subscribe Yearly",
      headerGradient: "linear-gradient(to right, #4e54c8, #8f94fb)",
    },
  ];

  const handleSubmit = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
    );
    if (!stripe) {
      return;
    }
    try {
      const response = await checkout({ priceId: "price_1QMX3kRoMLPC6yHCvIqEA8LV" })
      if (response.status === "success") {
        await stripe.redirectToCheckout({
          sessionId: response.data.result.id
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex mx-auto justify-center items-center">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            {...plan}
            selected={index === selectedPlanIndex}
            onSelect={() => {
              handleSubmit();
              setSelectedPlanIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;