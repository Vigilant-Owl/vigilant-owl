import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";

const apiUrl = `${apiBaseUrl}/stripe`;

export const checkout = async (data: { priceId: string }) => {
  try {
    const response = await axios.post(`${apiUrl}/checkout`, data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
