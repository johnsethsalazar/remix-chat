import { json, type ActionFunction } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button, Card, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { createCustomer } from "~/api/prisma.server";
import { authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const email = formData.get("email");
  const name = formData.get("name");
  console.log(email, name);

  try {
    const response = await admin.graphql(
      `#graphql
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          userErrors {
            field
            message
          }
          customer {
            id
            email
            phone
            firstName
            lastName
            smsMarketingConsent {
              marketingState
              marketingOptInLevel
            }
            addresses {
              address1
              city
              country
              phone
              zip
            }
          }
        }
      }`,
      {
        variables: {
          input: {
            email: email,
            phone: "+17066765421",
            firstName: name,
            lastName: "tapia",
            addresses: [
              {
                address1: "905 BRICKELL BAY DR",
                city: "Miami",
                province: "FL",
                phone: "1234911030",
                zip: "33131",
                lastName: "paul",
                firstName: "richard",
                country: "USA",
              },
            ],
          },
        },
      },
    );

    if (response.ok) {
      console.log("hit");
      const data = await response.json();
      console.log(data);

      await createCustomer({
        email: email,
        name: name,
      });

      return json({
        data: data.data,
      });
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const Customers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  console.log(actionData, "actionData");

  const generateCustomer = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <Card>
        <Form onSubmit={generateCustomer} method="post">
          <TextField
            id="name"
            name="name"
            label="Name"
            autoComplete="off"
            value={name}
            onChange={(value) => setName(value)}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            autoComplete="off"
            value={email}
            onChange={(value) => setEmail(value)}
          />
          <br />
          <Button submit>Create Customer</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default Customers;
