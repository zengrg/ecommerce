import connectToDB from "@/database";
import User from "@/models/user";
import Joi from "joi";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const schema = Joi.object({
  name: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();
  const { name, email, password, role } = await req.json();

  //validate schema
  const { error } = schema.validate({ name, email, password, role });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    //check if the user already exists or not
    const isUserAlreadyExists = await User.findOne({ email });
    if (isUserAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: "User already exists. Please use different email",
      });
    } else {
      const hashPassword = await hash(password, 12);
      const newlyCreatedUser = await User.create({
        name,
        email,
        password: hashPassword,
        role,
      });

      if (newlyCreatedUser) {
        return NextResponse.json({
          success: true,
          message: "Account Created Successfully",
        });
      }
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
