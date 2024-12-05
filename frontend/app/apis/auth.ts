/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { LoginData, RegisterData } from "../types";
import { getAuthToken } from "@/utils/tokenUtils";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";
const apiUrl = `${apiBaseUrl}/auth`;

export const apiLoginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, data);
    console.log(response);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return err.response.data;
  }
};

export const apiRegisterUser = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const apiChangePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${apiUrl}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return err.response.data;
  }
};

export const apiResetPassword = async (data: {
  newPassword: string;
}) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${apiUrl}/reset-password`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return err.response.data;
  }
};