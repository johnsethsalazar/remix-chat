import { json, type ActionFunction } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button, Card, Page, TextField } from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const discountTitle = formData.get('discountTitle');
  console.log(discountTitle, "discountTitle");
  try {
    const startsAt = "2022-06-21T00:00:00Z";
    const endsAt = "2025-09-21T00:00:00Z";
    const minimumRequirementSubtotal = 2;
    const discountAmount = 20;

    const response = await admin.graphql(
      `#graphql
   mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
     discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
       automaticDiscountNode {
         id
         automaticDiscount {
           ... on DiscountAutomaticBasic {
             startsAt
             endsAt
             minimumRequirement {
           ... on DiscountMinimumSubtotal {
            greaterThanOrEqualToSubtotal {
                  amount
                  currencyCode
            }
            }
          }
             customerGets {
               value {
                 ... on DiscountAmount {
                   amount {
                     amount
                     currencyCode
                   }
                   appliesOnEachItem
                 }
               }
               items {
                 ... on AllDiscountItems {
                   allItems
                 }
               }
             }
           }
         }
       }
       userErrors {
         field
         code
         message
       }
     }
   }`,
      {
        variables: {
          automaticBasicDiscount: {
            title: discountTitle,
            startsAt,
            endsAt,
            minimumRequirement: {
              subtotal: {
                greaterThanOrEqualToSubtotal: minimumRequirementSubtotal,
              },
            },
            customerGets: {
              value: {
                discountAmount: {
                  amount: discountAmount,
                  appliesOnEachItem: false,
                },
              },
              items: {
                all: true,
              },
            },
          },
        },
      },
    );

    if (response.ok) {
      const responseJson = await request.json();
      console.log("Created Discount");

      return json({
        discount: responseJson.data,
      });
    }
    return null;
  } catch (error) {
    console.error(error);
  }
};

const Discounts = () => {

  // The textfield is going to need the value and the set onchange values in order for the text fields from polaris to work.
  // Without this and the value and onChange in the TextField tag, your couldn't input texts.
  const [discountTitle, setDiscountTitle] = useState('');

  // submit function used to handle submission
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  console.log(actionData, "actionData");

  const generateDiscount = () => {
    submit(
      {},
      {
        replace: true,
        method: "POST",
      },
    );
  };

  return (
    <Page>
      <Card>
        <Form onSubmit={generateDiscount} method="post">
          <TextField
            id="discountTitle"
            name="discountTitle"
            label="Title"
            autoComplete="off"
            value={discountTitle}
            onChange={(value) => setDiscountTitle(value)}
          />
          <br />
          <Button submit>Create Discounts</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default Discounts;
