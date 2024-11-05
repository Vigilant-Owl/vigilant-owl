import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";

const apiUrl = `${apiBaseUrl}/whatsapp`;

export const apiInstallBot = async (data: { phoneNumber: string }) => {
  try {
    const response = await axios.post(`${apiUrl}/install`, data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
