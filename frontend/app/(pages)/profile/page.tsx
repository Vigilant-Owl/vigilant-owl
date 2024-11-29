/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button, Input } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/contexts/UserContext";

const supabase = createClient();

const Profile = () => {
  const { user } = useUserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

  const handleUpdate = async (form: HTMLFormElement) => {
    try {
      const formData = new FormData(form);

      const updatedData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
      };

      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: updatedData.firstName,
          last_name: updatedData.lastName,
        })
        .eq("email", profileData.email);

      if (error) throw error;

      setProfileData({ ...profileData, ...updatedData });
      toast.success("Profile updated successfully! Your changes will be visible the next time you sign in.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      router.replace("/update-password");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to send reset password email.");
    }
  }

  return (
    <div className="justify-center flex flex-col gap-3">
      <h2>Your Profile</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdate(e.currentTarget);
      }}>
        <div className="flex flex-col gap-2 min-w-[280px]">
          <Input
            type="text"
            variant="flat"
            label="First Name"
            placeholder="Enter your first name"
            name="firstName"
            value={profileData.firstName}
            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
            isDisabled={loading}
            required
          />
          <Input
            type="text"
            variant="flat"
            label="Last Name"
            placeholder="Enter your last name"
            name="lastName"
            value={profileData.lastName}
            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
            isDisabled={loading}
            required
          />
          <Input
            type="email"
            variant="flat"
            label="Email"
            name="email"
            value={profileData.email}
            isDisabled
          />
          <Button
            type="submit"
            aria-label="Update Profile"
            color="primary"
            isLoading={loading}
          >
            Update
          </Button>
        </div>
      </form>
      <Button onClick={handleResetPassword} color="secondary" isDisabled={loading}>
        Reset Password
      </Button>
    </div>
  );
}

export default Profile;