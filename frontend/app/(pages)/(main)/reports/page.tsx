"use client"
import { getReport } from "@/apis/report";
import { useEffect } from "react";

const Reports = () => {
  useEffect(() => {
    getReport({
      groupId: "120363345932571412@g.us",
      phoneNumber: "18406880000",
      startDate: "2024-11-10",
      endDate: "2024-11-12"
    });
  }, [])
  return <div>Reports</div>
}

export default Reports;