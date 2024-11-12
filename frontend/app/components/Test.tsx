/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";

const Test = ({ onGetReport, loading }: { onGetReport: (table: string, phoneNumber: string) => void, loading: boolean }) => {
  const [table, setTable] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState("18406880000");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center px-4">
      <Select
        isRequired
        label="Select test data"
        className="w-full"
        defaultSelectedKeys={["1"]}
        onSelectionChange={(keys: any) => {
          const [value] = keys;
          setTable(value);
        }}
        isDisabled={loading}
      >
        <SelectItem key="1">
          Test Data 1 (Common)
        </SelectItem>
        <SelectItem key="2">
          Test Data 2 (Long Chat)
        </SelectItem>
        <SelectItem key="3">
          Test Data 3 (Excitement and Joy)
        </SelectItem>
        <SelectItem key="4">
          Test Data 4 (Disappointment and Sadness)
        </SelectItem>
        <SelectItem key="5">
          Test Data 5 (Anger and Frustration)
        </SelectItem>
        <SelectItem key="6">
          Test Data 6 (Fear and Worry)
        </SelectItem>
        <SelectItem key="7">
          Test Data 7 (Curiosity and Interest)
        </SelectItem>
        <SelectItem key="8">
          Test Data 8 (Contentment and Relaxation)
        </SelectItem>
      </Select>
      <Select
        isRequired
        isDisabled={loading}
        label="Select phone"
        className="w-full"
        defaultSelectedKeys={["18406880000"]}
        onSelectionChange={(keys: any) => {
          const [value] = keys;
          setPhoneNumber(value);
        }}
      >
        <SelectItem key="18406880000">
          Jamie (18406880000)
        </SelectItem>
        <SelectItem key="41795877809">
          Alex (41795877809)
        </SelectItem>
      </Select>
      <Button color="primary" isLoading={loading} onClick={() => {
        onGetReport(table, phoneNumber)
      }}>
        Generate Report
      </Button>
    </div >
  );
}

export default Test;