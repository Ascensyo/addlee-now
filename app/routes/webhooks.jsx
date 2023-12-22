import { authenticate } from "../shopify.server";
import db from "../db.server";
import https from "https";
import { mapPayloadToBooking } from "../utils";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const action = async ({ request }) => {
  console.log("gets here action start", request);
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

  console.log("gets here");

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
          console.log("timeSlotId", timeSlotId);

          const body = mapPayloadToBooking(payload);
          console.log("body", body);

          await fetch("https://localhost:3000/confirmBooking", {
            agent: httpsAgent,
            body: JSON.stringify(mapPayloadToBooking(payload)),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
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
