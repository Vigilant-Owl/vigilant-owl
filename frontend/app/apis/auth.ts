import axios from "axios";
import { LoginData, RegisterData, ResponseData } from "../types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";
const apiUrl = `${apiBaseUrl}/auth`;

export const apiLoginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${apiUrl}/login`, data);
    return response.data;
  } catch (error) {
    console.error(error);
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
