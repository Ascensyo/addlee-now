const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
var bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

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

app.get("/availableSlots", async function (req, res) {
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
          date: "2023-12-16T10:30:00",
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
                city: "London",
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

app.get("/priceEstimateBySlot", async function (req, res) {
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
  console.log("confirmBooking");
  const fullUrl = "https://partners.addleetest.net/api/2.0/bookings/create";

  console.log(req.body?.time);

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
          id: uuidv4(),
          customer_reference: {
            account: "50",
          },
        },
        booking: {
          product: "al_now_parcel",
          time_slot_id: req.body?.time ?? "-",
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
              formatted_address: "Paddington Station, London, W2 1HA",
              location: {
                lat: 51.51748275756836,
                lon: -0.1782519966363907,
                accuracy: 1,
              },
              address_components: {
                postal_code: "W2 1HA",
                city: "London",
              },
              delivery_contact: {
                name: "test2",
                mobile: "7922222222",
                email: "test@test.COM",
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

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
