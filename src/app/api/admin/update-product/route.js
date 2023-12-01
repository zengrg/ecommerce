import Product from "@/models/product";
import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);
    if(isAuthUser?.role === 'Admin'){

    const extractData = await req.json();

    const {
      _id,
      name,
      price,
      description,
      category,
      deliveryInfo,
      onSale,
      priceDrop,
      imageUrl,
    } = extractData;

    const updateProduct = await Product.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        name,
        price,
        description,
        category,
        deliveryInfo,
        onSale,
        priceDrop,
        imageUrl,
      },
      { new: true }
    );
    

    if (updateProduct) {
      
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      console.log(updateProduct)
      return NextResponse.json({
        success: false,
        message: "Failed to update the product! Please try again",
      });
    }}else{return NextResponse.json({
      success: false,
      message: "You are not authenticated!!!",
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
