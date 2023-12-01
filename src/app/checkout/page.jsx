"use client";

import { toast } from "react-toastify";
import { GlobalContext, initalCheckoutFormData } from "@/context";
import { getAllAddresses } from "@/services/address";
import { createNewOrder } from "@/services/order";
import { callStripeSession } from "@/services/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Notification from "@/components/Notification";
import PageLevelLoader from "@/components/Loader/PageLevelLoader";

export function saleCalculator(price, priceDrop) {
  return Math.ceil(((100 - priceDrop) / 100) * price);
}

export default function Checkout() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkoutFormData,
    setCheckoutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const params = useSearchParams();

  const router = useRouter();
  const publishableKey =
    "pk_test_51OHOKbALiosaP5B9JFLNMfDRlfQv7Jk2F3DBK5JB0kgKRZ0Yt78T4Bb6P5ZE4hg3zQldLp4c2J1hJAwZGcueot9A00j0bc8mea";
  const stripePromise = loadStripe(publishableKey);

  async function extractAllAddresses() {
    const res = await getAllAddresses(user?._id);
    if (res.success) {
      setAddresses(res.data);
    }
  }

  useEffect(() => {
    if (user !== null) extractAllAddresses();
  }, [user]);

  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem("stripe"));

      if (
        isStripe &&
        params.get("status") === "success" &&
        cartItems &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const getCheckoutFormData = JSON.parse(
          localStorage.getItem("checkoutFormData")
        );

        const createFinalCheckoutFormData = {
          user: user?._id,
          shippingAddress: getCheckoutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: item.quantity,
            product: item.productID,
          })),
          paymentMethod: "Stripe",
          totalPrice: cartItems.reduce(
            (total, item) =>
              saleCalculator(item.productID.price, item.productID.priceDrop) *
                item.quantity +
              total,
            0
          ),
          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };
        const res = await createNewOrder(createFinalCheckoutFormData);
        if (res.success) {
          setOrderSuccess(true);
          setIsOrderProcessing(false);

          toast.success(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setOrderSuccess(false);
          setIsOrderProcessing(false);

          toast.error(res.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    }
    createFinalOrder();
  }, [params.get("status"), cartItems]);

  function handleSelectedAddress(getAddress) {
    if (selectedAddress === getAddress._id) {
      setSelectedAddress(null);
      setCheckoutFormData({
        ...checkoutFormData,
        shippingAddress: {},
      });
      return;
    }
    setSelectedAddress(getAddress._id);
    setCheckoutFormData({
      ...checkoutFormData,
      shippingAddress: {
        ...checkoutFormData.shippingAddress,
        fullName: getAddress.fullName,
        address: getAddress.address,
        city: getAddress.city,
        country: getAddress.country,
        postalCode: getAddress.postalCode,
      },
    });
  }
  async function handleCheckout() {
    const stripe = await stripePromise;
    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: "npr",
        product_data: {
          images: [item.productID.imageUrl],
          name: item.productID.name,
        },
        unit_amount:
          saleCalculator(item.productID.price, item.productID.priceDrop) * 100,
      },
      quantity: item.quantity,
    }));
    console.log(createLineItems);

    const res = await callStripeSession(createLineItems);
    setIsOrderProcessing(true);
    localStorage.setItem("stripe", true);
    localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

    const { error } = await stripe.redirectToCheckout({
      sessionId: res.id,
    });
    console.log(error);
  }

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        //setOrderSuccess(false);
        router.push("/orders");
      }, [2000]);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg ">
                  Your Payment Is Successfuland you will be redirected to orders
                  page in 3 seconds
                </h1>
              </div>
            </div>
          </div>
        </div>
        <Notification />
      </section>
    );
  }
  if (isOrderProcessing) {
    return <PageLevelLoader loading={isOrderProcessing} />;
  }
  return (
    <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
      <div className="px-4 pt-8">
        <p className="font-medium text-xl">Cart Summary</p>
        <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
          {cartItems && cartItems.length ? (
            cartItems.map((item) => (
              <div
                className="flex flex-col rounded-lg bg:white sm:flex-row"
                key={item._id}>
                <img
                  src={item && item.productID && item.productID.imageUrl}
                  alt="cart item"
                  className="m-2 h-24 w-24 rounded-md border object-cover object-center"
                />
                <div className="flex flex-row justify-between w-full px-4 py-4">
                  <span className="font-semibold w-[180px]">
                    {item && item.productID && item.productID.name}
                  </span>
                  <span className="font-semibold">{item && item.quantity}</span>
                  <div className="w-[150px]">
                    {item &&
                    item.productID &&
                    item.productID.onSale === "Yes" ? (
                      <>
                        <p className="text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right sm:text-red">
                          {"Rs. "}
                          {saleCalculator(
                            item.productID.price,
                            item.productID.priceDrop
                          )}
                        </p>
                        <div className="flex">
                          <p className="text-xs text-red-600 sm:order-1 sm:ml-8 sm:text-right line-through">
                            {"Rs. "}
                            {item.productID.price}
                          </p>
                          <p className="text-xs text-red-600 sm:order-1 sm:ml-8 sm:text-right">
                            -{item.productID.priceDrop}%
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right">
                        {"Rs. "}
                        {item.productID.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>Your Cart Is Empty</div>
          )}
        </div>
      </div>
      <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
        <p className="text-xl font-medium">Shipping Address Details</p>
        <p className="text-gray-400 font-bold">
          Complete Your Order By Selecting An Address Below
        </p>
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
          {addresses && addresses.length ? (
            addresses.map((item) => (
              <div
                key={item._id}
                className={`border p-6 ${
                  item._id === selectedAddress ? "border-red-900" : ""
                }`}>
                <p>Name : {item.fullName}</p>
                <p>Address : {item.address}</p>
                <p>City : {item.city}</p>
                <p>Country : {item.country}</p>
                <p>PostalCode : {item.postalCode}</p>
                <button
                  className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                  onClick={() => handleSelectedAddress(item)}>
                  {selectedAddress === item._id
                    ? "unselect address"
                    : "select address"}
                </button>
              </div>
            ))
          ) : (
            <p>No Address Found</p>
          )}
        </div>
        <button
          onClick={() => router.push("/account")}
          className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">
          add new address
        </button>
        <div className="mt-6 border-t border-b py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Sub-Total</p>
            <p className="text-lg text-black font-semibold">
              Rs.{" "}
              {cartItems && cartItems.length
                ? cartItems.reduce(
                    (total, item) =>
                      saleCalculator(
                        item.productID.price,
                        item.productID.priceDrop
                      ) *
                        item.quantity +
                      total,
                    0
                  )
                : "0"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Shipping</p>
            <p className="text-lg text-black font-semibold">Rs. 0</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg text-black font-semibold">
              Rs.{" "}
              {cartItems && cartItems.length
                ? cartItems.reduce(
                    (total, item) =>
                      saleCalculator(
                        item.productID.price,
                        item.productID.priceDrop
                      ) *
                        item.quantity +
                      total,
                    0
                  )
                : "0"}
            </p>
          </div>
          <div className="mt-5 text-center">
            <button
              disabled={
                (cartItems && cartItems.length === 0) ||
                Object.keys(checkoutFormData.shippingAddress).length === 0
              }
              onClick={handleCheckout}
              className="disabled:opacity-50 group inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide">
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
