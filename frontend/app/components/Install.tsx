/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { apiInstallBot } from "@/apis/install";
import { ResponseData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Input } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

const Install = () => {
  const supabase = createClient();
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleInstall = async (form: HTMLFormElement) => {
    try {
      const { data: res } = await supabase.auth.getSession();
      if (res.session) {
        const formData = new FormData(form);

        const data = {
          phoneNumber: formData.get("phoneNumber") as string,
          title: formData.get("title") as string,
          parentId: res.session?.user.id
        }

        if (!data.phoneNumber) {
          return toast.warning("Please input your phone number.");
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

  return (
    <>
      <Button onClick={() => onOpen()} color="success" variant="shadow">
        Install Service
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} className="dark-modal">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleInstall(e.currentTarget);
            }} action="#" method="POST">
              <ModalHeader className="flex flex-col gap-1">
                Install Bot
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
                />
                <Input
                  placeholder="Enter your phone number"
                  isRequired
                  type="text"
                  variant="flat"
                  label="Phone Number"
                  name="phoneNumber"
                  labelPlacement="outside"
                  isDisabled={loading}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  aria-label="login"
                  color="success"
                  type="submit"
                  isLoading={loading}
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
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Install;