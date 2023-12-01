import Product from "@/models/product";
import connectToDB from "@/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const extractAllProducts = await Product.find({});
    if (extractAllProducts) {
      return NextResponse.json({
        success: true,
        data: extractAllProducts,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No Products Found!!!",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
