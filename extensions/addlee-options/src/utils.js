export const mapTimeSlotsRequest = (data) => {
  return {
    vendor_reference: {
      customer_reference: {
        account: "50",
      },
    },
    booking: {
      product: "al_now_parcel",
      date: data.date,
      stops: [
        //First stop is the pickup location
        //TO DO: Figure out how to get this
        {
          type: "ADDRESS",
          formatted_address:
            "Addison Lee Ltd, Unit 1, 8-14 William Road, London, NW1 3EN",
          location: {
            lat: 51.52677917480469,
            lon: -0.1403989940881729,
            accuracy: 1,
          },
          address_components: {
            postal_code: "NW1 3EN",
            city: "London",
            country: "GB",
          },
        },
        {
          type: "ADDRESS",
          formatted_address: `${data.shipping_address.address1}, ${data.shipping_address.city}, ${data.shipping_address.zip}`,
          location: {
            lat: data.shipping_address.latitude + 0.0000000000000001,
            lon: data.shipping_address.longitude + 0.0000000000000001,
            accuracy: 1,
          },
          address_components: {
            postal_code: data.shipping_address.zip,
            city: data.shipping_address.city,
            country: data.shipping_address.country_code,
          },
        },
      ],
    },
  };
};

export const mapTimeSlotsPricesRequest = (data) => {
  return {
    vendor_reference: {
      customer_reference: {
        account: "50",
      },
    },
    booking: {
      product: "al_now_parcel",
      time_slot_id: data.time_slot_id,
      stops: [
        //First stop is the pickup location
        //TO DO: Figure out how to get this
        {
          type: "ADDRESS",
          formatted_address:
            "Addison Lee Ltd, Unit 1, 8-14 William Road, London, NW1 3EN",
          location: {
            lat: 51.52677917480469,
            lon: -0.1403989940881729,
            accuracy: 1,
          },
          address_components: {
            postal_code: "NW1 3EN",
            city: "London",
            country: "GB",
          },
        },
        {
          type: "ADDRESS",
          formatted_address: `${data.shipping_address.address1}, ${data.shipping_address.city}, ${data.shipping_address.zip}`,
          location: {
            lat: data.shipping_address.latitude + 0.0000000000000001,
            lon: data.shipping_address.longitude + 0.0000000000000001,
            accuracy: 1,
          },
          address_components: {
            postal_code: data.shipping_address.zip,
            city: data.shipping_address.city,
            country: data.shipping_address.country_code,
          },
        },
      ],
    },
  };
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatTime = (time) => {
  const hours = String(time.getHours()).padStart(2, "0");
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getLabel = (timeSlotId, timeSlots) => {
  if (!timeSlotId || !timeSlots || timeSlots.length === 0) return "-";

  const interval = timeSlots.find((interval) => interval.id === timeSlotId);
  if (!interval) return "-";

  return (
    formatTime(new Date(interval.from_date)) +
    " - " +
    formatTime(new Date(interval.till_date))
  );
};
