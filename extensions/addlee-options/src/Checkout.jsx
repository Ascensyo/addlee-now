import {
  reactExtension,
  useDeliveryGroups,
  DateField,
  Select,
  BlockStack,
  Text,
  InlineLayout,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension(
  "purchase.checkout.shipping-option-item.details.render",
  () => <Extension />
);

const timeSlots = [
  {
    id: "f5f1a93d-35c0-448d-a255-888baa67ff85@2bca6ae1",
    from_date: "2023-12-16T10:00:00+00:00",
    till_date: "2023-12-16T12:00:00+00:00",
  },
  {
    id: "f5f1a93d-35c0-448d-a255-888baa67ff85@398646e1",
    from_date: "2023-12-16T12:00:00+00:00",
    till_date: "2023-12-16T14:00:00+00:00",
  },
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
];

function Extension() {
  const deliveryGroups = useDeliveryGroups();

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();

  useEffect(() => {
    const today = new Date();
    setSelectedDate(formatDate(today));

    setSelectedTime(options[0].value);
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

  const options = timeSlots.map((interval) => ({
    value:
      formatTime(new Date(interval.from_date)) +
      " - " +
      formatTime(new Date(interval.till_date)),
    label:
      formatTime(new Date(interval.from_date)) +
      " - " +
      formatTime(new Date(interval.till_date)),
  }));

  // const shippingOption = useShippingOptionTarget();

  const getDate = () => {
    return selectedDate?.split("-").reverse().join("-");
  };

  return isAddLeeDeliverySelected() ? (
    <>
      <BlockStack>
        <Text>
          Selected date & time: {getDate()} - {selectedTime}
        </Text>

        <InlineLayout columns={["48%", "fill", "48%"]}>
          <DateField
            value={selectedDate}
            label="Delivery date"
            onChange={changeDate}
            disabled={[{ end: "2023-12-14" }]}
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
