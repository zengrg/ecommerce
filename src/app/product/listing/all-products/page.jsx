import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";
import React from "react";

export default async function AllProducts() {
  const getAllProducts = await getAllAdminProducts();
  return <CommonListing data={getAllProducts && getAllProducts.data} />;
}
