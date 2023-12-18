import {
  reactExtension,
  useDeliveryGroups,
  DateField,
  Select,
  BlockStack,
  Text,
  InlineLayout,
  Image,
  Button,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension(
  "purchase.checkout.shipping-option-item.details.render",
  () => <Extension />
);

const timeSlots = [
  [
    {
      id: "0b19cc7b-0e98-4220-892d-acdd9bda13d9@1a2ceae1",
      from_date: "2023-12-16T10:00:00+00:00",
      till_date: "2023-12-16T12:00:00+00:00",
    },
    {
      id: "f5f1a93d-35c0-448d-a255-888baa67ff85@398646e1",
      from_date: "2023-12-16T12:00:00+00:00",
      till_date: "2023-12-16T14:00:00+00:00",
    },
  ],
  [
    {
      id: "f5f1a93d-35c0-448d-a255-888baa67ff85@4741aae1",
      from_date: "2023-12-16T14:00:00+00:00",
      till_date: "2023-12-16T16:00:00+00:00",
    },
    {
      id: "f5f1a93d-35c0-448d-a255-888baa67ff85@54fd86e1",
      from_date: "2023-12-16T16:00:00+00:00",
      till_date: "2023-12-16T18:00:00+00:00",
    },
  ],
];

function Extension() {
  const deliveryGroups = useDeliveryGroups();

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();

  useEffect(() => {
    const today = new Date();
    setSelectedDate(formatDate(today));
  }, []);

  const isAddLeeDeliverySelected = () => {
    const expressHandle = deliveryGroups[0].deliveryOptions.find(
      (method) => method.title == "AddLee Now"
    )?.handle;

    return expressHandle === deliveryGroups[0].selectedDeliveryOption?.handle;
  };

  const changeDate = (date) => {
    setSelectedDate(date);
  };

  const changeTime = (time) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    //when date changes, call API to get available timeslots
  }, [selectedDate]);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const day = selectedDate === "2023-12-18" ? 0 : 1;
    setOptions(
      timeSlots[day].map((interval) => ({
        value: interval.id,
        label:
          formatTime(new Date(interval.from_date)) +
          " - " +
          formatTime(new Date(interval.till_date)),
      }))
    );
  }, [selectedDate]);

  useEffect(() => {
    if (options.length > 0) setSelectedTime(options[0].value);
  }, [options]);

  // const shippingOption = useShippingOptionTarget();

  const getDate = () => {
    return selectedDate?.split("-").reverse().join("-");
  };

  const makeBooking = async () => {
    console.log("make booking");
    await fetch("https://localhost:3000/confirmBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: selectedTime,
      }),
    });
    console.log("made booking");
  };

  return isAddLeeDeliverySelected() ? (
    <>
      <BlockStack>
        <Text>
          Selected date & time: {getDate()} - {getLabel(selectedTime)}
        </Text>

        <Image src="./14X14.svg" />

        <InlineLayout columns={["48%", "fill", "48%"]}>
          <DateField
            value={selectedDate}
            label="Delivery date"
            onChange={changeDate}
            disabled={[{ end: "2023-12-17" }, { start: "2023-12-20" }]}
          />
          <BlockStack />
          <Select
            label="Time interval"
            value={selectedTime}
            onChange={changeTime}
            options={options}
          />
          {/* {JSON.stringify(shippingOption)} */}
        </InlineLayout>

        <Button onPress={makeBooking}>Make booking</Button>
      </BlockStack>
    </>
  ) : null;
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (time) => {
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getLabel = (timeSlotId) => {
  if (!timeSlotId) return "-";

  const timeSlot = timeSlots.find((slot) =>
    slot.find((interval) => interval.id === timeSlotId)
  );
  const interval = timeSlot.find((interval) => interval.id === timeSlotId);
  return (
    formatTime(new Date(interval.from_date)) +
    " - " +
    formatTime(new Date(interval.till_date))
  );
};
