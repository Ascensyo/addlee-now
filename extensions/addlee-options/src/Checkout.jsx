import {
  reactExtension,
  useDeliveryGroups,
  DateField,
  Select,
  BlockStack,
  Text,
  InlineLayout,
  Image,
  Banner,
  useApplyMetafieldsChange,
  useApi,
  useAttributes,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useMemo, useState } from "react";
import {
  formatDate,
  formatTime,
  getLabel,
  mapTimeSlotsPricesRequest,
  mapTimeSlotsRequest,
} from "./utils";

export default reactExtension(
  "purchase.checkout.shipping-option-item.details.render",
  (target) => <Extension target={target} />
);

function Extension({ target }) {
  const deliveryGroups = useDeliveryGroups();
  const { shippingAddress, query, sessionToken, attributes } = useApi();
  const attrs = useAttributes();

  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [clientAddress, setClientAddress] = useState();
  const [options, setOptions] = useState([]);
  const [postcodeError, setPostcodeError] = useState(false);

  const handler = async (address) => {
    try {
      const data = await fetch(
        `https://api.postcodes.io/postcodes/${address.zip}`
      );
      const parsedData = await data.json();
      console.log(parsedData);
      setClientAddress({
        ...address,
        latitude: parsedData.result.latitude,
        longitude: parsedData.result.longitude,
      });
    } catch (err) {
      console.log("error:", err);
      setPostcodeError(true);
    }
  };

  useEffect(() => {
    shippingAddress.subscribe(handler);
    console.log(attrs);
  }, []);

  const yesterday = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today;
  }, []);

  const metafieldNamespace = "custom";
  const metafieldKey = "timeSlot";

  const applyMetafieldsChange = useApplyMetafieldsChange();

  useEffect(() => {
    if (!selectedTime) return;

    const updateMetafield = async () => {
      const result = await applyMetafieldsChange({
        type: "updateMetafield",
        namespace: metafieldNamespace,
        key: metafieldKey,
        valueType: "string",
        value: selectedTime,
      });
    };

    updateMetafield();
  }, [selectedTime, applyMetafieldsChange]);

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

  const addOneDay = () => {
    const day = selectedDate ? new Date(selectedDate) : new Date();
    if (selectedDate) day.setDate(day.getDate() + 1);
    setSelectedDate(formatDate(day));
  };

  useEffect(() => {
    if (selectedDate && clientAddress) {
      try {
        setIsFetching(true);
        const fetchTimeSlots = async () => {
          const body = JSON.stringify(
            mapTimeSlotsRequest({
              date: selectedDate + "T10:30:00",
              shipping_address: {
                latitude: 51.51748275756836,
                longitude: -0.1782519966363907,
                country_code: clientAddress.countryCode,
                ...clientAddress,
              },
            })
          );
          const data = await fetch("https://localhost:3000/timeSlots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });

          setIsFetching(false);
          const parsedData = await data.json();
          setTimeSlots(
            parsedData?.estimates?.length > 0
              ? parsedData.estimates[0].time_slots
              : []
          );
        };

        fetchTimeSlots();
      } catch (err) {
        console.log("error:", err);

        setIsFetching(false);
      }
    }
  }, [selectedDate, clientAddress]);

  useEffect(() => {
    if (selectedTime && clientAddress) {
      try {
        const fetchPrice = async () => {
          const body = JSON.stringify(
            mapTimeSlotsPricesRequest({
              time_slot_id: selectedTime,
              shipping_address: {
                latitude: 51.51748275756836,
                longitude: -0.1782519966363907,
                country_code: clientAddress.countryCode,
                ...clientAddress,
              },
            })
          );

          const data = await fetch("https://localhost:3000/timeSlotsPrices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
          });

          const parsedData = await data.json();
          const fare =
            parsedData?.estimates?.length > 0
              ? parsedData.estimates[0].fare_estimate.total_charged
              : null;
        };

        fetchPrice();
      } catch (err) {
        console.log("error:", err);
      }
    }
  }, [selectedTime, clientAddress]);

  useEffect(() => {
    if (!timeSlots || timeSlots.length === 0) {
      setOptions([]);
      return;
    }

    setOptions(
      timeSlots.map((interval) => ({
        value: interval.id,
        label:
          formatTime(new Date(interval.from_date)) +
          " - " +
          formatTime(new Date(interval.till_date)),
      }))
    );
  }, [timeSlots]);

  useEffect(() => {
    if (options.length > 0) setSelectedTime(options[0].value);
    else addOneDay();
  }, [options]);

  const getDate = () => {
    return selectedDate?.split("-").reverse().join("-");
  };

  return isAddLeeDeliverySelected() ? (
    postcodeError ? (
      <Banner title="Error">
        Postcode error. Please enter a valid one to use AddLee Now.
      </Banner>
    ) : (
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
          <BlockStack />{" "}
          <DateField
            value={selectedDate}
            label="Delivery date"
            onChange={changeDate}
            disabled={[{ end: formatDate(yesterday) }]}
          />
          <BlockStack />
          {isFetching ? (
            <Text size="small">Fetching time slots...</Text>
          ) : options?.length > 0 ? (
            <Select
              label="Time interval"
              value={selectedTime}
              onChange={changeTime}
              options={options}
            />
          ) : (
            <Text size="small">No slots available today.</Text>
          )}
        </InlineLayout>
      </BlockStack>
    )
  ) : null;
}
