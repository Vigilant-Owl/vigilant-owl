/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResponseData {
  status: "success" | "error";
  message: string;
  data: any;
}
