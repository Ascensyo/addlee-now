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

app.post("/timeSlotsPrices", async function (req, res) {
  console.log("API timeSlotsPrices reached");
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
