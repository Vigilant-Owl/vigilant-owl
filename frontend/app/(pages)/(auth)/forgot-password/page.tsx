/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please input your email address.");
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password`,
      });
      if (error) throw error;
      if (data) {
        toast.success("A password reset email has been successfully sent. Please check your email for further instructions.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="justify-center flex flex-col gap-3">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <div className="flex flex-col gap-2 min-w-[280px]">
          <Input
            type="email"
            variant="flat"
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={loading}
            isRequired
          />
          <Button
            type="submit"
            aria-label="Send Reset Email"
            color="primary"
            isLoading={loading}
          >
            Send Reset Email
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;