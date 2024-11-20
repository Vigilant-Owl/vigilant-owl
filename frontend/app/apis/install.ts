/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@/utils/tokenUtils";
import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";

const apiUrl = `${apiBaseUrl}/whatsapp`;

export const apiInstallBot = async (data: {
  phoneNumber: string;
  title: string;
  parentId?: string;
}) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${apiUrl}/install`, data, {
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
