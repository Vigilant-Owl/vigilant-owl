/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@/utils/tokenUtils";
import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";

const apiUrl = `${apiBaseUrl}/stripe`;

export const checkout = async (data: { priceId: string }) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${apiUrl}/checkout`, data, {
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

export const getSessionDetail = async (sessionId: string | null) => {
  try {
    const token = getAuthToken();

    const response = await axios.get(`${apiUrl}/session/${sessionId}`, {
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

export const cancelSubscription = async (data: { subscriptionId: string }) => {
  try {
    const token = getAuthToken();

    const response = await axios.post(`${apiUrl}/cancel-subscription`, data, {
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
