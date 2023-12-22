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
  Banner,
  useApplyMetafieldsChange,
  useAppMetafields,
  useMetafields,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useState } from "react";
import { mapTimeSlotsRequest } from "./utils";

export default reactExtension(
  "purchase.checkout.shipping-option-item.details.render",
  () => <Extension />
);

function Extension() {
  const deliveryGroups = useDeliveryGroups();

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const yesterday = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today;
  }, []);

  const metafieldNamespace = "custom";
  const metafieldKey = "timeSlot";

  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();
  const metafields = useMetafields();

  useEffect(() => {
    const id = "4d3251181-f805-453f-811a-609e9046fe06@88f6ae1";

    console.log("saving metafield");

    const updateMetafield = async () => {
      const result = await applyMetafieldsChange({
        type: "updateMetafield",
        namespace: metafieldNamespace,
        key: metafieldKey,
        valueType: "string",
        value: id,
      });

      console.log("result", result);
    };

    updateMetafield();
  }, []);

  const isAddLeeDeliverySelected = () => {
    const expressHandle = deliveryGroups[0].deliveryOptions.find(
      (method) => method.title == "AddLee Now"
    )?.handle;

    return expressHandle === deliveryGroups[0].selectedDeliveryOption?.handle;
  };

  const changeDate = (date) => {
    setSelectedDate(date);
    setBookingData(null);
  };

  const changeTime = (time) => {
    setSelectedTime(time);
    setBookingData(null);
  };

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setSelectedDate(formatDate(today));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      //get metafield
      const updateMetafield = async () => {
        console.log("result metafield", metafields);
      };

      updateMetafield();

      try {
        const fetchTimeSlots = async () => {
          const body = JSON.stringify(
            mapTimeSlotsRequest({
              date: selectedDate + "T10:30:00",
              shipping_address: {
                address1: "Paddington Station",
                city: "London",
                zip: "W2 1HA",
                latitude: 51.51748275756836,
                longitude: -0.1782519966363907,
                country_code: "GB",
              },
            })
          );
          const data = await fetch("https://localhost:3000/timeSlots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });

          const parsedData = await data.json();
          //console.log(parsedData);
          setTimeSlots(
            parsedData?.estimates?.length > 0
              ? parsedData.estimates[0].time_slots
              : []
          );
        };

        fetchTimeSlots();
      } catch (err) {
        console.log(err);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (timeSlots?.length > 0) {
      setSelectedTime(timeSlots[0].id);
    }
  }, [timeSlots]);

  useEffect(() => {
    if (selectedTime) {
      try {
        const fetchPrice = async () => {
          const body = JSON.stringify({
            shipping_address: {
              address1: "123 Main St",
              city: "London",
              zip: "W1W 8AX",
              latitude: 51.516,
              longitude: -0.13,
            },
          });
          const data = await fetch("https://localhost:3000/timeSlotsPrices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });

          const parsedData = await data.json();
          //console.log("parsedData", parsedData);

          //To do: update the price
        };

        fetchPrice();
      } catch (err) {
        console.log(err);
      }
    }
  }, [selectedTime]);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    //console.log(timeSlots);
    if (!timeSlots || timeSlots.length === 0) return;
    setOptions(
      timeSlots.map((interval) => ({
        value: interval.id,
        label:
          formatTime(new Date(interval.from_date)) +
          " - " +
          formatTime(new Date(interval.till_date)),
      }))
    );
  }, [selectedDate, timeSlots]);

  useEffect(() => {
    if (options.length > 0) setSelectedTime(options[0].value);
  }, [options]);

  const getDate = () => {
    return selectedDate?.split("-").reverse().join("-");
  };

  const makeBooking = async () => {
    setBookingData(null);
    setIsFetching(true);
    //console.log("selectedTime", selectedTime);
    try {
      const data = await fetch("https://localhost:3000/confirmBookingManual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time: selectedTime,
        }),
      });
      setIsFetching(false);

      const parsedData = await data.json();
      setBookingData(parsedData);
    } catch (err) {
      console.log(err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsFetching(false);
    }
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
          Selected date & time: {getDate()} -{" "}
          {getLabel(selectedTime, timeSlots)}
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
            disabled={[{ end: formatDate(yesterday) }]}
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
          disabled={isFetching || bookingData}
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

const getLabel = (timeSlotId, timeSlots) => {
  if (!timeSlotId || !timeSlots || timeSlots.length === 0) return "-";

  const interval = timeSlots.find((interval) => interval.id === timeSlotId);
  if (!interval) return "-";

  return (
    formatTime(new Date(interval.from_date)) +
    " - " +
    formatTime(new Date(interval.till_date))
  );
};
