import { E164Number } from 'libphonenumber-js/core';
import PhoneInput from 'react-phone-number-input';

const PhoneNumberInput = ({ value, setValue }: { value: string, setValue: (value: string) => void }) => {
  return (
    <div className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background" >
      <PhoneInput
        className="phone-number-input w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground"
        placeholder="Enter the phone number to be added"
        isRequired
        value={value}
        onChange={(value: E164Number | undefined) => {
          if (value) {
            console.log("Phone Number", value, value.toString());
            setValue(value.toString());
          }
        }}
        defaultCountry="CH"
        labelPlacement="outside"
        label="Phone Number"
        variant="flat"
      />
    </div>
  );
}

export default PhoneNumberInput;