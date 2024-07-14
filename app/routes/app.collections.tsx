import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page } from "@shopify/polaris";
import { apiVersion, authenticate } from "~/shopify.server";

// Injecting Method query for the try body
export const query = `
{
    collections(first: 10){
        edges{
            node{
                id
                handle
                title
                description
            }
        }
        pageInfo {
            hasNextPage
        }
    }
}
`;

// Query collections from admin using loader function
export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": accessToken!,
        },
        body: query,
      },
    );

    //Handling response
    if (response.ok) {
      const data = await response.json();

      const {
        data: {
          collections: { edges },
        },
      } = data;
      return edges;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const Collections = () => {
  // working on collections. Using loader function by using remix hook use loader data
  const collections: any = useLoaderData();
  console.log(collections, 'collections');
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <h1>Hello World!</h1>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <List type="bullet" gap="loose">
              {
                collections.map((edge: any) => {
                  const {node: collecion} = edge;
                  return (
                    <List.Item key={collecion.id}>
                      <h2>{collecion.title}</h2>
                      <h2>{collecion.description}</h2>
                    </List.Item>
                  )
                })
              }
            </List>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Collections;
