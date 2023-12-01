import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      await connectToDB();
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      const updateOrder = await Order.findOneAndUpdate(
        {
          _id: id,
        },
        {
          isProcessing: false,
        },
        { new: true }
      );

      if (updateOrder) {
        return NextResponse.json({
          success: true,
          message: "Order marked as delivered",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "failed to mark the order as delivered",
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
      message: "Something went wrong ! Please try again later",
    });
  }
}
