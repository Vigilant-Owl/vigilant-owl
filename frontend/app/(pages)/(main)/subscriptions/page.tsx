/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client"

import React, { useCallback, useEffect, useState } from "react";
import { loadStripe } from '@stripe/stripe-js';
import PlanCard from "@/components/PlanCard";
import { cancelSubscription, checkout } from "@/apis/stripe";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useUserAuth } from "@/contexts/UserContext";

const PRICE_IDS = {
  monthly: "price_1QMX3kRoMLPC6yHCvIqEA8LV",
  yearly: "price_1QNEjZRoMLPC6yHClWRZ5vye",
};

const supabase = createClient();

const plans = [
  {
    title: "Free Trial",
    description: "Experience all features for free for a limited time.",
    features: [
      "Full Access to All Features",
      "Limited Time Offer",
      "Available on a Single Device"
    ],
    buttonText: "Start Free Trial",
    cancelText: "Stop Free Trial",
    headerGradient: "linear-gradient(to right, #232526, #414345)",
    priceId: null,
  },
  {
    title: "Monthly Subscription",
    description: "Enjoy features on a month-to-month basis.",
    features: [
      "All Features Included",
      "Cancel Anytime",
      "Priority Support"
    ],
    buttonText: "Subscribe Monthly",
    cancelText: "Cancel Subscription",
    headerGradient: "linear-gradient(to right, #1e3c72, #2a5298)",
    priceId: PRICE_IDS.monthly,
  },
  {
    title: "Yearly Subscription",
    description: "Get the best value with a yearly subscription.",
    features: [
      "All Features Included",
      "Two Months Free",
      "Priority Support"
    ],
    buttonText: "Subscribe Yearly",
    cancelText: "Cancel Subscription",
    headerGradient: "linear-gradient(to right, #4e54c8, #8f94fb)",
    priceId: PRICE_IDS.yearly,
  },
];

const PricingPlans = () => {
  const { user } = useUserAuth();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [possibleFreeTrial, setPossibleFreeTrial] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState("");

  useEffect(() => {
    const handleGetInitialData = async () => {
      try {
        if (user?.id) {
          const { data, error }: { data: any, error: any } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          if (error) throw error;
          if (data) {
            setPossibleFreeTrial(data?.free_trial !== false);
            if (data?.stripe_subscription_id) {
              setSubscriptionId(data?.stripe_subscription_id);
            }
            if (data?.subscription_status === "active") {
              if (data?.current_price_id === PRICE_IDS.monthly) {
                setSelectedPlanIndex(1);
                return;
              } else if (data?.current_price_id === PRICE_IDS.yearly) {
                setSelectedPlanIndex(2);
                return;
              }
            } else if (data?.free_trial) {
              setSelectedPlanIndex(0);
              return;
            }
          }
          setSelectedPlanIndex(-1);
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      }
    }

    handleGetInitialData();
  }, []);

  const handleSubscribe = useCallback(async (priceId: string | null) => {
    try {
      if (!priceId) {
        const { error }: { data: any, error: any } = await supabase.from("profiles").update({
          free_trial: true,
          subscription_date: new Date()
        }).eq("id", user?.id);
        if (error) throw error;
        toast.success("Start the free trial successfully.");
        return;
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
      );

      if (!stripe) {
        toast.error("Stripe failed to load");
        return;
      }

      setIsProcessing(true);

      try {
        const response = await checkout({ priceId });

        if (response.status === "success") {
          await stripe.redirectToCheckout({
            sessionId: response.data.result.id
          });
        } else {
          toast.error("Failed to create checkout session");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred during checkout");
      } finally {
        setIsProcessing(false);
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  }, [user]);

  const handleCancelSubscribe = useCallback(async (index: number) => {
    try {
      if (user?.id) {
        if (index === 0) {
          const { error } = await supabase.from("profiles").update({ free_trial: false }).eq("id", user.id);
          if (error) throw error;
          setPossibleFreeTrial(false);
          return;
        }

        if (subscriptionId) {
          const response = await cancelSubscription({ subscriptionId });
          if (response.status === "success") {
            toast.success(response.message);
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  }, [subscriptionId, user]);

  return (
    <div className="flex mx-auto justify-center items-center">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            {...plan}
            possibleFreeTrial={possibleFreeTrial}
            currentSelected={selectedPlanIndex}
            onSelect={() => {
              if (selectedPlanIndex !== index) {
                setSelectedPlanIndex(index);
                handleSubscribe(plan.priceId);
              } else {
                handleCancelSubscribe(index);
                setSelectedPlanIndex(-1);
              }
            }}
            index={index}
            isProcessing={isProcessing}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;