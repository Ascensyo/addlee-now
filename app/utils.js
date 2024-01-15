export const mapPayloadToBooking = (payload, timeSlotId) => {
  return {
    vendor_reference: {
      id: payload.order_number,
      customer_reference: {
        account: "50",
        company_references: [{
            name: payload.shop_name,
            value: payload.order_number,
          },
          {
            name: "Confirmation Number",
            value: payload.confirmation_number,
          },
        ],
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
          formatted_address: `${payload.origin_address.address1}, ${payload.origin_address.city}, ${payload.origin_address.zip}`,
          location: {
            lat: payload.origin_address.latitude,
            lon: payload.origin_address.longitude,
            accuracy: 1,
          },
          address_components: {
            postal_code: payload.origin_address.zip,
            city: payload.origin_address.city,
          },
          delivery_contact: {
            name: payload.origin_address.name,
            mobile: payload.origin_address.phone,
            email: payload.origin_address.email,
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
