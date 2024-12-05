"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useState } from "react";
import { IoMdEye, IoMdEyeOff, IoMdPersonAdd } from "react-icons/io";
import { toast } from "sonner";
import Joi from 'joi';
import { RegisterData } from "../types";
import { createClient } from "@/utils/supabase/client";
import LegalNotice from "./LegalNotice";

const supabase = createClient();

const schema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

const Register = ({ onClick }: { onClick?: () => void }) => {
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLegalChecked, setIsLegalChecked] = useState(false);

  const validateData = (data: object) => {
    const { error } = schema.validate(data);

    if (error) {
      const errorMessage = error.details[0].message;
      return toast.warning(errorMessage);
    }

    return null;
  };

  const handleRegister = async (form: HTMLFormElement) => {
    try {
      const formData = new FormData(form);

      const data: RegisterData = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
      };

      const validationResult = validateData(data);
      if (validationResult) {
        return;
      }

      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setLoading(false);
        return toast.error(error.message);
      }

      const { error: insertError } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName
        })
        .eq("email", data.email);
      if (insertError) {
        setLoading(false);
        return toast.error(insertError.message);
      }

      toast.success("Welcome to Vigilant Owl! Please check your email and confirm your address to complete your signup process.");
      onClose();
      if (onClick) onClick();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => onOpen()} variant="light" className="flex sm:hidden w-full justify-start gap-2 p-2" color="secondary">
        <IoMdPersonAdd className="text-xl w-6 text-center" />
        <span className="text-lg">Register</span>
      </Button>
      <Button onClick={() => onOpen()} color="secondary" className="hidden md:flex">
        Register
      </Button>
      <Button onClick={() => onOpen()} color="secondary" isIconOnly className="hidden sm:flex md:hidden" radius="full">
        <IoMdPersonAdd className="text-2xl pointer-events-none" />
      </Button>
      <Modal onClose={() => !loading && onClose()} isOpen={isOpen} onOpenChange={onOpenChange} className="dark-modal">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleRegister(e.currentTarget);
            }} action="#" method="POST">
              <ModalHeader className="flex flex-col gap-1">
                Register
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-4">
                  <Input
                    type="text"
                    variant="flat"
                    label="First Name"
                    placeholder="Enter your first name"
                    labelPlacement="outside"
                    name="firstName"
                    isRequired
                    isDisabled={loading}
                  />
                  <Input
                    type="text"
                    variant="flat"
                    label="Last Name"
                    placeholder="Enter your last name"
                    labelPlacement="outside"
                    name="lastName"
                    isRequired
                    isDisabled={loading}
                  />
                </div>
                <Input
                  placeholder="Enter your email address"
                  isRequired
                  type="email"
                  variant="flat"
                  label="Email"
                  name="email"
                  labelPlacement="outside"
                  isDisabled={loading}
                />
                <Input
                  placeholder="Enter your password"
                  isRequired
                  type={isVisible ? "text" : "password"}
                  label="Password"
                  name="password"
                  labelPlacement="outside"
                  isDisabled={loading}
                  endContent={
                    <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
                      {isVisible ? (
                        <IoMdEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <IoMdEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  } />
                <Input
                  name="confirmPassword"
                  type={isVisible ? "text" : "password"}
                  variant="flat"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  labelPlacement="outside"
                  isRequired
                  isDisabled={loading}
                />
                <LegalNotice onClick={() => onClose()} isChecked={isLegalChecked} setIsChecked={setIsLegalChecked} />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  aria-label="Register"
                  color="secondary"
                  isLoading={loading}
                  isDisabled={!isLegalChecked}
                >
                  Register
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
      </Modal >
    </>
  );
}

export default Register;