const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
var bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

const options = {
  key: fs.readFileSync("./cert/localhost.key"),
  cert: fs.readFileSync("./cert/localhost.crt"),
};
const app = express();
const port = 3000;
app.use(cors());

const server = https.createServer(options, app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/timeSlots", jsonParser, async function (req, res) {
  console.log("API timeSlots reached");
  console.log(req.body);
  const fullUrl = "https://partners.addleetest.net/api/2.0/estimates";

  let data = "nothing";
  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic TXVsZVNvZnRfaTE6R00yNU1tWWthZA==`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    data = await response.json();
  } catch (error) {
    data = error;
  }

  res.send(data);
});

app.get("/timeSlotsPrices", async function (req, res) {
  const fullUrl = "https://partners.addleetest.net/api/2.0/estimates";

  let data = "nothing";
  console.log("fetching");
  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic TXVsZVNvZnRfaTE6R00yNU1tWWthZA==`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor_reference: {
          customer_reference: {
            account: "50",
          },
        },
        booking: {
          product: "al_now_parcel",
          time_slot_id: "e0e02e1f-0401-4ff0-8680-c171d5d662f8@2bca6ae1",
          stops: [
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
                city: "",
                country: "GB",
              },
            },
            {
              type: "ADDRESS",
              formatted_address: "Paddington Station, London, W2 1HA",
              location: {
                lat: 51.51748275756836,
                lon: -0.1782519966363907,
                accuracy: 1,
              },
              address_components: {
                postal_code: "W2 1HA",
                city: "London",
                country: "GB",
              },
            },
          ],
        },
      }),
    });
    data = await response.json();
  } catch (error) {
    data = error;
  }

  res.send(data);
});

app.post("/confirmBooking", jsonParser, async function (req, res) {
  console.log("API confirmBooking reached");
  const fullUrl = "https://partners.addleetest.net/api/2.0/bookings/create";

  console.log(req.body);

  let data = "nothing";
  console.log("fetching");
  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic TXVsZVNvZnRfaTE6R00yNU1tWWthZA==`,
        "Content-Type": "application/json",
        Connection: "keep-alive",
      },
      body: JSON.stringify(req.body),
    });
    data = await response.json();
    console.log("data - ", data);
  } catch (error) {
    console.log("error - ", error);
    data = error;
  }

  console.log("finished");

  res.send(data);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
