import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      await connectToDB();

      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({
          success: false,
          message: "product id is required",
        });
      }
      const extractOrderDetail = await Order.findById(id).populate(
        "orderItems.product"
      );

      if (extractOrderDetail) {
        return NextResponse.json({
          success: true,
          data: extractOrderDetail,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to get order detail!!! Please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated!!!",
      });
    }
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later order details",
    });
  }
}
