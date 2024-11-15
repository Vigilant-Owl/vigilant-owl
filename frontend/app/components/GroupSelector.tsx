/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const GroupSelector = ({ onGetReport, loading }: { onGetReport: (table: string, phoneNumber: string) => void, loading: boolean }) => {
  const supabase = createClient();

  const [groups, setGroups] = useState([]);
  // const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupIndex, setGroupIndex] = useState(0);
  const [group, setGroup] = useState({
    group_id: "",
    title: "",
    phone_number: ""
  });
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [phoneNumberLoading, setPhoneNumberLoading] = useState(false);

  const handleGetGroupData = async () => {
    try {
      const { data: res } = await supabase.auth.getSession();
      if (res.session) {
        setGroupLoading(true);
        const { data, error } = await supabase.rpc("get_group_data", { user_id: res.session?.user.id });
        if (error) {
          throw error;
        }
        setGroups(data);
        // setPhoneNumbers([]);
        if (data.length) {
          setGroupIndex(0);
          setGroup(data[0]);
        } else {
          toast.error("You didn't install the service.");
        }
      } else {
        toast.error("You didn't sign in, please sign in first.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGroupLoading(false);
    }
  }

  // const handleGetPhoneNumbers = async () => {
  //   try {
  //     const { data: res } = await supabase.auth.getSession();
  //     if (res.session) {
  //       setPhoneNumberLoading(true);
  //       const { data, error } = await supabase.rpc("get_phone_number_data", { user_id: res.session?.user.id, group_id: groupId });
  //       if (error) {
  //         throw error;
  //       }
  //       setPhoneNumbers(data);
  //       if (data.length) {
  //         setPhoneNumber(data[0]);
  //       }
  //       onGetReport(groupId, data[0]);
  //     } else {
  //       toast.error("You didn't sign in, please sign in first.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setPhoneNumberLoading(false);
  //   }
  // }

  useEffect(() => {
    handleGetGroupData();
  }, []);

  // useEffect(() => {
  //   if (groupId) {
  //     handleGetPhoneNumbers();
  //   }
  // }, [groupId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center px-4 w-full min-w-fit">
      <Select
        disallowEmptySelection
        isRequired
        label="Select group"
        className="w-full min-w-60"
        selectedKeys={[`${groupIndex}`]}
        onSelectionChange={(keys: any) => {
          const [value] = keys;
          setGroupIndex(value);
          // setGroup(groups[value]);
        }}
        defaultSelectedKeys={["None"]}
        isDisabled={groupLoading}
      >
        {groups.map((group: any, index: number) => (
          <SelectItem key={index}>
            {`${group.title} (${group.group_id})`}
          </SelectItem>
        ))}
      </Select>
      <Select
        disallowEmptySelection
        isRequired
        isDisabled={groupLoading}
        label="Select phone number"
        className="w-full min-w-48"
        selectedKeys={[group.phone_number]}
        defaultSelectedKeys={["None"]}
      // onSelectionChange={(keys: any) => {
      //   const [value] = keys;
      //   setPhoneNumber(value);
      // }}
      >
        <SelectItem key={group.phone_number}>
          {group.phone_number}
        </SelectItem>
        {/* {phoneNumbers.map(phoneNumber => (
          <SelectItem key={phoneNumber}>
            {phoneNumber}
          </SelectItem>
        ))} */}
      </Select>
      <Button color="primary" isLoading={loading} onClick={() => {
        console.log(group);
        if (group.group_id == "") {
          return toast.error("Please select the group.");
        }
        if (group.phone_number == "") {
          return toast.error("Please select the child's phone number.");
        }
        onGetReport(group.group_id, group.phone_number);
      }}>
        Get Report
      </Button>
    </div >
  );
}

export default GroupSelector;