import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhoneNumber(number: string) {
  const phoneNumber = parsePhoneNumberFromString(number);
  if (phoneNumber) {
    return phoneNumber.formatInternational(); // Formats to international style
  }
  return number; // Return the original if parsing fails
}
