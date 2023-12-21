import { randomUUID } from "crypto";

export const mapPayloadToBooking = (payload) => {
  return {
    vendor_reference: {
      id: randomUUID(),
      customer_reference: {
        account: 50,
      },
    },
    booking: {
      product: "al_now_parcel",
      time_slot_id: "{{time_slot_id.1}}", //To do: Figure out how to get this
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
          },
          delivery_contact: {
            name: "test1",
            mobile: "7922222222",
            email: "test@test.COM",
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
