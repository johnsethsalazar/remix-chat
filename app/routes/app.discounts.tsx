import { json, type ActionFunction } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button, Card, Page } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    const dynamicTitle = "youTube example discounts";
    const startsAt = "2022-06-21T00:00:00Z";
    const endsAt = "2024-09-21T00:00:00Z";
    const minimumRequirementSubtotal = 2;
    const discountAmount = 100;

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
            title: dynamicTitle,
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
          <Button submit>Create Discounts</Button>
        </Form>
      </Card>
    </Page>
  );
};

export default Discounts;
