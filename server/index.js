const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
// const {
//   v4: uuidv4
// } = require("uuid");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

const options = {
  key: fs.readFileSync("./cert/localhost.key"),
  cert: fs.readFileSync("./cert/localhost.crt"),
};
const app = express();
const port = 3000;
app.use(cors());

const server = https.createServer(options, app);

// Server root page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/timeSlots", jsonParser, async function (req, res) {
  console.log("API timeSlots reached");
  const fullUrl = "https://partners.addleetest.net/api/2.0/estimates";

  console.log(JSON.stringify(req.body));

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

  console.log(data);

  res.send(data);
});

app.post("/timeSlotsPrices", jsonParser, async function (req, res) {
  console.log("API timeSlotsPrices reached");
  console.log("body - ", req.body);

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
    console.log("data - ", data);
  } catch (error) {
    data = error;
    console.log("error - ", error);
  }

  res.send(data);
});

// Server root page // This request is responsable of making the booking in HL backend
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

    fs.writeFile(
      "./booking",
      data.booking_reference?.number.toString(),
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      }
    );
  } catch (error) {
    console.log("error - ", error);
    data = error;
    fs.writeFile("./booking", "error", function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  }

  console.log("finished");

  res.send(data);
});

app.get("/getBooking", async function (req, res) {
  console.log("API getBooking reached");
  // this seems to be an issue , the file has 389606 however the api returns 389552 ?
  try {
    data = fs.readFileSync("./booking", "utf8");
    console.log("data - ", data);
  } catch (error) {
    console.log("error - ", error);
    data = error;
  }

  res.send(data);
});
//

server.listen(port, () => {
  console.log(`AddLee NOW App Server listening on:  ${port}`);
});
