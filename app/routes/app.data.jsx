import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Card, Layout, Page } from "@shopify/polaris";

// Is used only for Get requests
export const loader = () => {
  return json({ message: "Welcome to AddLee Now" });
};

// If we need to mutate the data in any way we need to use action({request})
export const action = async ({ request }) => {
  const body = await request.formData();
  console.log(body.get("first_name"));
  console.log(body.get("last_name"));
  return Object.fromEntries(body.entries());
};

export default function Data(params) {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  return (
    <Page>
      <ui-title-bar title="Settings" />
      <Layout>
        <Layout.Section>
          <Card>
            <div>
              <Form method="POST">
                <input name="first_name" />
                <input name="last_name" />
                <button>Submit</button>
              </Form>
              <div>
                Name:{""}
                {actionData
                  ? `${actionData.first_name} ${actionData.last_name}`
                  : null}
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
