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
  useShippingOptionTarget,
  Banner,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useState } from "react";

export default reactExtension(
  "purchase.checkout.shipping-option-item.details.render",
  () => <Extension />
);

const timeSlots = [
  [
    {
      id: "d6310ee0-8559-4a83-b890-513a2406f2ea@bef86ae1",
      from_date: "2023-12-16T10:00:00+00:00",
      till_date: "2023-12-16T12:00:00+00:00",
    },
    {
      id: "d6310ee0-8559-4a83-b890-513a2406f2ea@ccb446e1",
      from_date: "2023-12-16T12:00:00+00:00",
      till_date: "2023-12-16T14:00:00+00:00",
    },
  ],
  [
    {
      id: "d6310ee0-8559-4a83-b890-513a2406f2ea@da6faae1",
      from_date: "2023-12-16T14:00:00+00:00",
      till_date: "2023-12-16T16:00:00+00:00",
    },
    {
      id: "d6310ee0-8559-4a83-b890-513a2406f2ea@e8286e1",
      from_date: "2023-12-16T16:00:00+00:00",
      till_date: "2023-12-16T18:00:00+00:00",
    },
  ],
];

function Extension() {
  const deliveryGroups = useDeliveryGroups();

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [bookingData, setBookingData] = useState(null);

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
    const day = selectedDate === "2023-12-19" ? 0 : 1;
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
    setBookingData(null);
    setIsFetching(true);
    const data = await fetch("https://localhost:3000/confirmBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: selectedTime,
      }),
    });
    setIsFetching(false);

    const parsedData = await data.json();
    setBookingData(parsedData);
  };

  const bookingTitle = useMemo(() => {
    if (!bookingData) return "";
    if (bookingData.error.message === "OK")
      return `Booking successful 🎉 Reservation number: ${bookingData.booking_reference.number}`;
    return `Booking failed. Error: ${bookingData.error.message}. Code: ${bookingData.error.code}`;
  }, [bookingData]);

  return isAddLeeDeliverySelected() ? (
    <>
      <BlockStack>
        <Text>
          Selected date & time: {getDate()} - {getLabel(selectedTime)}
        </Text>

        <InlineLayout columns={["10%", "fill", "40%", "fill", "40%"]}>
          <Image
            source="https://svgur.com/i/112T.svg"
            fit="cover"
            aspectRatio={"1/1"}
          />
          <BlockStack />
          <DateField
            value={selectedDate}
            label="Delivery date"
            onChange={changeDate}
            disabled={[{ end: "2023-12-18" }, { start: "2023-12-21" }]}
          />
          <BlockStack />
          <Select
            label="Time interval"
            value={selectedTime}
            onChange={changeTime}
            options={options}
          />
        </InlineLayout>

        <Button
          onPress={makeBooking}
          loading={isFetching}
          disabled={isFetching}
        >
          Make booking
        </Button>
        {bookingData && (
          <Banner
            title={bookingTitle}
            status={bookingData.error.message === "OK" ? "success" : "critical"}
          />
        )}
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
