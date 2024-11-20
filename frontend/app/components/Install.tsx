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

const Install = () => {
  const supabase = createClient();
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [title, setTitle] = useState("");

  const handleInstall = async () => {
    try {
      const { data: res } = await supabase.auth.getSession();
      if (res.session) {

        if (!title) {
          return toast.warning("Please input your title.");
        }
        if (!isValidPhoneNumber(phoneNumber)) {
          return toast.warning("Please input your phone number correctly.");
        }

        const realPhoneNumber = phoneNumber.startsWith("+") ? phoneNumber.slice(1) : phoneNumber;
        const data = {
          phoneNumber: realPhoneNumber,
          title,
          parentId: res.session?.user.id
        }

        setLoading(true);

        console.log(data);

        const response: ResponseData = await apiInstallBot(data);

        if (response.status === "success") {
          toast.success(response.message);
        }
        onClose();
      } else {
        toast.error("You didn't sign in, please sign in first.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Please try again. If you’re still unable to install the service, feel free to contact us.");
      // toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (session?.user.id) {
        const { data, error }: { data: any, error: any } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (error) throw error;
        if (data) {
          if (data?.subscription_status === "active") {
            onOpen();
          } else if (data?.free_trial) {
            const { data: groups, error } = await supabase.from('consent_messages').select("*").eq("parent_id", session.user.id)
            if (error) throw error;
            if (groups.length > 0) {
              return toast.warning("During the free trial period, you can install the service on one device.");
            } else {
              onOpen();
            }
          } else {
            return toast.warning("Please select a subscription plan before installing this service.");
          }
        }
      }
    } catch (err: any) {
      toast.error(err);
      console.error(err);
    }
  }
  return (
    <>
      <Button onClick={() => handleOpen()} color="success" variant="shadow" className="min-w-56">
        Create A Group
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} className="dark-modal">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create A Group
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Enter your title"
                  isRequired
                  type="text"
                  variant="flat"
                  label="Title"
                  name="title"
                  labelPlacement="outside"
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
                  onClick={handleInstall}
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