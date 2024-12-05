/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { apiChangePassword } from "@/apis/auth";
import { ResponseData } from "@/types";

const UpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    setIsVisible(false);
    e.preventDefault();

    if (!currentPassword) {
      return toast.error("Please input the current password.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const response: ResponseData = await apiChangePassword({ currentPassword, newPassword });

      console.log(response);
      if (response && response.status === "success") {
        return toast.success("Password updated successfully!");
      }

      toast.error(response.message);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="justify-center flex flex-col gap-3">
      <h2>Update Password</h2>
      <form onSubmit={handlePasswordUpdate}>
        <div className="flex flex-col gap-2 min-w-[280px]">
          <Input
            type="password"
            variant="flat"
            label="Current Password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            isDisabled={loading}
            isRequired
          />
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
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;