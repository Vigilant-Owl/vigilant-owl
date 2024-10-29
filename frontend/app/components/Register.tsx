"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "sonner";
import Joi from 'joi';
import { RegisterData, ResponseData } from "../types";
import { apiRegisterUser } from "../apis/auth";

const Register = () => {
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const schema = Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

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

      const response: ResponseData = await apiRegisterUser(data);

      console.log(response);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => onOpen()} color="secondary">Register</Button>
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
                  />
                  <Input
                    type="text"
                    variant="flat"
                    label="Last Name"
                    placeholder="Enter your last name"
                    labelPlacement="outside"
                    name="lastName"
                    isRequired
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
                />
                <Input
                  placeholder="Enter your password"
                  isRequired
                  type={isVisible ? "text" : "password"}
                  label="Password"
                  name="password"
                  labelPlacement="outside"
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
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  aria-label="Register"
                  color="secondary"
                  isLoading={loading}
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