"use client";

import React from "react";
import ComponentLevelLoader from "../Loader/ComponentLevelLoader";
import { useRouter } from "next/navigation";

export default function CommonCart({
  cartItems,
  handleDeleteCardItem,
  componentLevelLoader,
}) {
  const router = useRouter();
  function saleCalculator(price, priceDrop) {
    return Math.ceil(((100 - priceDrop) / 100) * price);
  }

  return (
    <section className="h-screen bg-gray-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {cartItems && cartItems.length ? (
                  <ul>
                    {cartItems.map((cartItem) => (
                      <li
                        className="flex-col flex space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
                        key={cartItem._id}>
                        <div className="shrink-0">
                          <img
                            src={
                              cartItem &&
                              cartItem.productID &&
                              cartItem.productID.imageUrl
                            }
                            alt="Product image"
                            className="h-24 w-25 max-w-full rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                            <div className="pr-8 sm:pr-4">
                              <p className="text-base font-semibold text-gray-800">
                                {cartItem &&
                                  cartItem.productID &&
                                  cartItem.productID.name}
                              </p>
                            </div>
                            <div className="mt-4 flex gap-10 items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                              <p className="shrink-0 w-20 text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right">
                                {cartItem && cartItem.quantity}
                              </p>
                              <div className="">
                                {cartItem &&
                                cartItem.productID &&
                                cartItem.productID.onSale === "Yes" ? (
                                  <>
                                    <p className="text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right sm:text-red">
                                      {"Rs. "}
                                      {saleCalculator(
                                        cartItem.productID.price,
                                        cartItem.productID.priceDrop
                                      )}
                                    </p>
                                    <div className="flex">
                                      <p className="text-xs text-red-600 sm:order-1 sm:ml-8 sm:text-right line-through">
                                        {"Rs. "}
                                        {cartItem.productID.price}
                                      </p>
                                      <p className="text-xs text-red-600 sm:order-1 sm:ml-8 sm:text-right">
                                        -{cartItem.productID.priceDrop}%
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right">
                                    {"Rs. "}
                                    {cartItem.productID.price}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                className="shrink-0 font-medium text-red-400 sm:order-2"
                                onClick={() =>
                                  handleDeleteCardItem(cartItem._id)
                                }>
                                {componentLevelLoader &&
                                componentLevelLoader.loading &&
                                cartItem._id === componentLevelLoader.id ? (
                                  <ComponentLevelLoader
                                    text={"Removing..."}
                                    color={"#fc8181"}
                                    loading={
                                      componentLevelLoader &&
                                      componentLevelLoader.loading
                                    }
                                  />
                                ) : (
                                  "Remove"
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <h1>Your Cart Is Empty</h1>
                    <button
                      type="button"
                      className="font-medium text-gray"
                      onClick={() => {
                        router.push("/product/listing/all-products");
                      }}>
                      Continue Shopping
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                )}
              </div>
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
                    disabled={cartItems && cartItems.length === 0}
                    onClick={() => {
                      router.push("/checkout");
                    }}
                    className="disabled:opacity-50 group inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
