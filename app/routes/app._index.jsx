import {
  Box,
  Card,
  Layout,
  Link,
  Page,
  Text,
  BlockStack,
  Image,
  Divider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import ALN_Solution from "../../public/ALN_solution.png";
import ALN_Roadmap from "../../public/ALN_Roadmap.png";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  return (
    <Page fullWidth>
      <ui-title-bar title="Service Introduction" />

      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="50">
              {/* <BlockStack> gap="300" */}
              <Image
                source="https://svgur.com/i/112T.svg"
                fit="contain"
                aspectRatio={"1/1"}
                style={{
                  height: "auto",
                  width: "120px",
                  padding: "10px",
                  display: "block",
                  margin: "auto",
                }}
              />
              <Divider borderColor="border-inverse" />
              <Text as="p" variant="bodyMd">
                The AL NOW app by Addison Lee (c) gives merchants the ability to
                configure the services on offer based on their own specific shop
                requirements.
              </Text>
              <Divider borderColor="border-inverse" />
              <Image
                source={ALN_Solution}
                fit="contain"
                style={{
                  height: "auto",
                  width: "100%",
                  padding: "5px",
                  display: "block",
                  margin: "auto",
                }}
              />
              <Divider borderColor="border-inverse" />
              <Text as="p" variant="bodyMd">
                AL Now empowers small to medium businesses supporting their
                delivery requirements.  From the on-the-day flower delivery for
                that friends forgotten birthday, prescriptions that were missing
                from the previous days' delivery, through to whole foods
                required to prepare todays meal.  Available across Addison Lee’s
                Web and Mobile Web platforms, AL Now allows our clients to get
                their goods to their customers, within a delivery time slot that
                suits them (from 2 to 6 hours).  Keeping them informed with
                emails going direct to the recipient for; Item collection,
                tracking and confirmation of delivery.
              </Text>
              <Divider borderColor="border-inverse" />
              <Image
                source={ALN_Roadmap}
                fit="contain"
                style={{
                  height: "auto",
                  width: "100%",
                  padding: "5px",
                  display: "block",
                  margin: "auto",
                }}
              />
            </BlockStack>
          </Card>
        </Layout.Section>
        {/* <Layout.Section> */}
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack>
              {/* <BlockStack gap="50"> */}
              <Image
                source="https://www.addisonlee.com/wp-content/themes/addlee/assets/images/logos/logo-letters.png"
                style={{ height: "auto", width: "80px", padding: "10px" }}
              />
              <Text as="h2" variant="headingMd">
                Addison Lee Additional Resources
              </Text>
              <Text as="p" variant="bodyMd">
                For a full range of our service, please visit{" "}
                <Link
                  url="https://book.addisonlee.com/al/booking/new/courier"
                  target="_blank"
                  removeUnderline
                >
                  Addison Lee Courier
                </Link>
                .
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
