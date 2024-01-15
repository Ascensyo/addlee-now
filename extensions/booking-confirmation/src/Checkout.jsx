import { Banner, reactExtension } from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.thank-you.block.render", () => (
  <Extension />
));

function Extension() {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingNumber, setBookingNumber] = useState();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    try {
      const fetchBookingNumber = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 8000));
        const data = await fetch("https://localhost:3000/getBooking");

        const parsedData = await data.json();
        console.log("parsedData-getBooking", parsedData);
        if (parsedData === "error") {
          setIsError(true);
          return;
        }
        setBookingNumber(parsedData);
        setIsLoading(false);
      };

      fetchBookingNumber();
    } catch (err) {
      console.log("error:", err);
      setIsError(true);
    }
  }, []);

  return (
    <Banner title="AddLee Now delivery confirmed!">
      {isError ? (
        <>Something went wrong. Press the back button to refresh the page!</>
      ) : !isLoading ? (
        `Your Addison Lee courier booking number is: ${bookingNumber}`
      ) : (
        <>Loading...</>
      )}
    </Banner>
  );
}
