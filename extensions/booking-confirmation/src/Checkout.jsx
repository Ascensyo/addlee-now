import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingNumber, setBookingNumber] = useState();

  useEffect(() => {
    try {
      const fetchBookingNumber = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const data = await fetch("https://localhost:3000/getBooking");
        console.log("datar", data);

        const parsedData = await data.json();
        console.log("parsedData", parsedData);
        setBookingNumber(parsedData);
        setIsLoading(false);
      };

      fetchBookingNumber();
    } catch (err) {
      console.log("error:", err);
    }
  }, []);

  return (
    <Banner title="Addison Lee booking confirmation">
      {!isLoading ? (
        `You booking has been confirmed! Addison Lee booking number: ${bookingNumber}`
      ) : (
        <>Loading...</>
      )}
    </Banner>
  );
}
