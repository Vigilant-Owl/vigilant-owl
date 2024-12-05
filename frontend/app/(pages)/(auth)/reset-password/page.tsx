/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { createClient } from "@/utils/supabase/client";
import { useUserAuth } from "@/contexts/UserContext";
import { ResponseData } from "@/types";
import { apiResetPassword } from "@/apis/auth";

const ResetPassword = () => {
  const supabase = createClient();
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!newPassword || !confirmPassword) {
        return toast.error("Please enter both new password and confirmation");
      }

      if (newPassword !== confirmPassword) {
        return toast.error("Passwords do not match");
      }

      if (newPassword.length < 8) {
        return toast.error("Password must be at least 8 characters long");
      }

      setIsVisible(false);

      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No active session. Please log in again.");
      }

      const response: ResponseData = await apiResetPassword({ newPassword });

      console.log(response);
      if (response && response.status === "success") {
        return toast.success("Password updated successfully!");
      }
      toast.error(response.message);
    } catch (err: any) {
      console.error('Password update error:', err);

      const errorMessage = err.message || "Failed to update password. Please try again.";
      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let errorMessage = null;

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryError = urlParams.get('error');
      const queryErrorDescription = urlParams.get('error_description');

      if (queryError) {
        errorMessage = queryErrorDescription
          ? decodeURIComponent(queryErrorDescription)
          : 'Cannot reset your password due to an invalid or expired link.';
      }

      if (!errorMessage && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error');

        if (hashError) {
          const hashDescription = hashParams.get('error_description');
          errorMessage = hashDescription
            ? decodeURIComponent(hashDescription)
            : 'Cannot reset your password due to an invalid or expired link.';
        }
      }

      if (errorMessage) {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  }, []);

  return (
    <div className="justify-center flex flex-col gap-3">
      <h2>Reset Password</h2>
      {error ? (
        <div>
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <form onSubmit={handlePasswordUpdate}>
          <div className="flex flex-col gap-2 min-w-[280px]">
            <Input
              type={isVisible ? "text" : "password"}
              variant="flat"
              label="New Password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              isDisabled={loading}
              isRequired
              endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? (
                    <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />
            <Input
              type={isVisible ? "text" : "password"}
              variant="flat"
              label="Confirm Password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isDisabled={loading}
              isRequired
            />
            <Button
              type="submit"
              aria-label="Reset Password"
              color="primary"
              isLoading={loading}
            >
              Reset Password
            </Button>
          </div>
        </form >
      )}
    </div >
  );
}

export default ResetPassword;