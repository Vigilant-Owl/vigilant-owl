export const getAuthToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};
