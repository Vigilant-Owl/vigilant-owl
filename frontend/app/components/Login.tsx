"use client"

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useState } from "react";
import { IoMdEye, IoMdEyeOff, IoMdLogIn } from "react-icons/io";
import { toast } from "sonner";
import Joi from 'joi';
import { apiLoginUser } from "../apis/auth";
import { ResponseData } from "../types";
import { createClient } from "@/utils/supabase/client";

const Login = () => {
  const supabase = createClient();
  const { onClose, isOpen, onOpenChange, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const schema = Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).required(),
  })

  const validateData = (data: object) => {
    const { error } = schema.validate(data);

    if (error) {
      const errorMessage = error.details[0].message;
      return toast.warning(errorMessage);
    }
  }

  const handleLogin = async (form: HTMLFormElement) => {
    try {
      const formData = new FormData(form);

      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      const validationResult = validateData(data);
      if (validationResult) {
        return;
      }

      setLoading(true);

      const response: ResponseData = await apiLoginUser(data);

      console.log(response);

      const { error } = await supabase.auth.signInWithPassword(
        data
      );

      if (error) {
        setLoading(false);
        return toast.error(error.message);
      }

      const { data: userData } = await supabase.from("profiles").select("*").eq("email", data.email).single();

      console.log(userData);

      toast.success("Welcome to vigilant owl!");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div onClick={() => onOpen()} className="sm:hidden md:flex">
        Login
      </div>
      <Button onClick={() => onOpen()} color="primary" className="hidden md:flex">
        Login
      </Button>
      <Button onClick={() => onOpen()} color="primary" isIconOnly className="hidden sm:flex md:hidden" radius="full">
        <IoMdLogIn className="text-2xl pointer-events-none" />
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} className="dark-modal">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogin(e.currentTarget);
            }} action="#" method="POST">
              <ModalHeader className="flex flex-col gap-1">
                Login
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button
                  aria-label="login"
                  color="primary"
                  type="submit"
                  isLoading={loading}
                >
                  Login
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

export default Login;