/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const UpdatePassword = () => {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    setIsVisible(false);
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    if (data) {
      toast.success("Successfully updated the password.");
      router.push('/dashboard');
    }
    try {
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
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
              aria-label="Update Password"
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

export default UpdatePassword;