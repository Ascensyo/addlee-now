import { authenticate } from "../shopify.server";
import db from "../db.server";
import https from "https";
import { mapPayloadToBooking } from "../utils";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const action = async ({ request }) => {
  console.log("webhooks action start. request: ", request);
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  const query = async () => {
    const response = await admin.graphql(
      `query {
        order(id: "${payload.admin_graphql_api_id}") {
          metafield(namespace: "custom", key: "timeSlot") {
            id
            value
          }
        }
      }
      `
    );

    const parsed = await response.json();
    return parsed.data.order.metafield.value;
  };

  const getShopLocation = async () => {
    const shopData = await admin.rest.resources.Shop.all({
      session: session,
    });

    console.log("shopData", shopData);

    const primaryLocation = await admin.graphql(
      `query {
        location(id: "gid://shopify/Location/${shopData.data[0].primary_location_id}") {
          address {
            address1
            city
            zip
            latitude
            longitude
            phone
          }
        }
      }
      `
    );

    const parsed = await primaryLocation.json();

    const result = {
      ...parsed.data.location.address,
      phone: shopData.data[0].phone,
      email: shopData.data[0].email,
      name: shopData.data[0].name,
    };

    console.log("result", result);

    return result;
  };

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  console.log("webhook fired", topic, shop, session, admin, payload);

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "ORDERS_CREATE":
      if (payload.shipping_lines[0].title === "AddLee Now") {
        try {
          const timeSlotId = await query();

          const shopLocation = await getShopLocation();

          await fetch("https://localhost:3000/confirmBooking", {
            agent: httpsAgent,
            body: JSON.stringify(
              mapPayloadToBooking(
                {
                  ...payload,
                  origin_address: shopLocation,
                },
                timeSlotId
              )
            ),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          // TO DO: save tracking number for the order
        } catch (error) {
          console.log("error", error);
        }
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
