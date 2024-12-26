import {
  DatePicker,
  Heading,
  reactExtension,
  useApplyMetafieldsChange
} from "@shopify/ui-extensions-react/checkout";
import { useCallback, useMemo, useState } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.shipping-option-list.render-after", () => (
  <Extension />
));

function Extension() {

  // Get the applyMetafieldsChange function
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Local state to store the selected date and yesterday's date
  const [selectedDate, setSelectedDate] = useState("");
  const [yesterday, setYesterday] = useState("");
  
  // Initialize the selected date
  useMemo(() => {
    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Set the initial date to tomorrow if today is Sunday otherwise set it to today
    const initialDate = today.getDay() === 0 ? tomorrow : today;
    setSelectedDate(formatDate(initialDate));
    setYesterday(formatDate(yesterday));
  }, []);

  const handleDateChange = useCallback((value) => {
    setSelectedDate(value);
    // Apply the selected date to the metafield
    applyMetafieldsChange({
      type: "updateMetafield",
      namespace: "custom",
      key: "delivery_date",
      valueType: "string",
      value: value
    });
  }, []);

  return (
    <>
      <Heading level={2}>Select delivery date</Heading>
      <DatePicker 
        selected={selectedDate} 
        onChange={handleDateChange}
        disabled={["Sunday", {end: yesterday}]} />
    </>
  )
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}