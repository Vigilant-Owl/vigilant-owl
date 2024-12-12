/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { apiInstallBot } from "@/apis/install";
import { ResponseData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import { isValidPhoneNumber } from 'react-phone-number-input'
import PhoneNumberInput from "./PhoneNumberInput";
import { useUserAuth } from "@/contexts/UserContext";

const Install = () => {
  const { user } = useUserAuth();
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [title, setTitle] = useState("");

  const supabase = createClient();

  const handleInstall = async () => {
    try {
      if (!user?.id) {
        return toast.error("You didn't sign in, please sign in first.");
      }

      if (!title) {
        return toast.warning("Please input your title.");
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        return toast.warning("Please input your phone number correctly.");
      }

      const realPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber.slice(1)
        : phoneNumber;

      const data = {
        phoneNumber: realPhoneNumber,
        title,
        parentId: user.id
      }

      setLoading(true);

      const response: ResponseData = await apiInstallBot(data);

      if (response.status === "success") {
        toast.success(response.message);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Please try again. If you're still unable to install the service, feel free to contact us.");
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = async () => {
    try {
      console.log("create a group")
      if (!user?.id) {
        return toast.error("You didn't sign in, please sign in first.");
      }

      // Use optional chaining and nullish coalescing to prevent potential undefined errors
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data?.subscription_status === "active") {
        onOpen();
        return;
      }

      if (data?.free_trial) {
        const { data: groups, error: groupError } = await supabase
          .from('consent_messages')
          .select("*")
          .eq("parent_id", user.id);

        if (groupError) throw groupError;

        if (groups.length > 0) {
          return toast.warning("During the free trial period, you can install the service on one device.");
        }

        onOpen();
        return;
      }

      toast.warning("Please select a subscription plan before installing this service.");
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred");
      console.error(err);
    }
  }

  return (
    <>
      <Button
        onClick={() => handleOpen()}
        color="success"
        variant="shadow"
        className="min-w-56"
      >
        Create a Group
      </Button>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="dark-modal"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create a Group
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Please enter the group's name"
                  type="text"
                  variant="flat"
                  label="Group Name"
                  name="title"
                  isDisabled={loading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <PhoneNumberInput
                  value={phoneNumber}
                  setValue={setPhoneNumber}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  aria-label="login"
                  color="success"
                  type="submit"
                  isLoading={loading}
                  onClick={() => handleInstall()}
                >
                  Install
                </Button>
                <Button
                  aria-label="close"
                  color="default"
                  onPress={onClose}
                  isDisabled={loading}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Install;