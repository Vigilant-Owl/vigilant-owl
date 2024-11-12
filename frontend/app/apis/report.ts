import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:8000/api";

const apiUrl = `${apiBaseUrl}/report`;

export const getReport = async (data: {
  groupId: string;
  phoneNumber: string;
  startDate: string;
  endDate: string;
}) => {
  try {
    const response = await axios.post(`${apiUrl}/`, data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
