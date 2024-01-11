import {
  randomUUID
} from "crypto";

export const mapPayloadToBooking = (payload, timeSlotId) => {
  return {
    vendor_reference: {
      id: payload.order_number,
      customer_reference: {
        account: "50",
      },
    },
    booking: {
      product: "al_now_parcel",
      time_slot_id: timeSlotId, //To do: Figure out how to get this
      stops: [
        //First stop is the pickup location
        //TO DO: Figure out how to get this
        {
          type: "ADDRESS",
          formatted_address: "87-135 Brompton Road, London, SW1X 7XL, United Kingdom",
          location: {
            lat: 51.493458,
            lon: -0.168517,
            accuracy: 1,
          },
          address_components: {
            postal_code: "SW1X 7XL",
            city: "London",
          },
          delivery_contact: {
            name: "Snow & Boots Merchant",
            mobile: "7762916147",
            email: "eduard@ascensyo.com",
          },
        },
        {
          type: "ADDRESS",
          formatted_address: `${payload.shipping_address.address1}, ${payload.shipping_address.city}, ${payload.shipping_address.zip}`,
          location: {
            lat: payload.shipping_address.latitude,
            lon: payload.shipping_address.longitude,
            accuracy: 1,
          },
          address_components: {
            postal_code: payload.shipping_address.zip,
            city: payload.shipping_address.city,
          },
          delivery_contact: {
            name: `${payload.customer.first_name ?? ""} ${
              payload.customer.last_name ?? ""
            }`,
            mobile: payload.customer.phone,
            email: payload.customer.email,
          },
        },
      ],
    },
  };
};
