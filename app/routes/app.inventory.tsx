import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  try {
    const response = await admin.rest.resources.InventoryLevel.all({
      session: session,
      location_ids: "99253584193",
    });

    if (response) {
      console.log("hit", response);
      const data = response.data;

      console.log("data", data);

      return json({
        inventory: data,
      });
    }

    return null;
  } catch (error) {
    console.error(error);
  }
};

const Inventory = () => {
  const data: any = useActionData();
  console.log(data, "data");

  return <div>app.inventory</div>;
};

export default Inventory;
