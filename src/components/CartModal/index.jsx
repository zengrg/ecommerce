"use client";

import React, { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/ComponentLevelLoader";

export default function CartModal() {
  const {
    showCartModal,
    setShowCartModal,
    user,
    cartItems,
    setCartItems,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);
  const router = useRouter();

  async function extractAllCartItems() {
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setCartItems(res.data);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    }
  }
  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);

  async function handleDeleteCardItem(getCartItemId) {
    setComponentLevelLoader({ loading: true, id: getCartItemId });
    const res = await deleteFromCart(getCartItemId);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllCartItems();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      mainContent={
        cartItems && cartItems.length ? (
          <ul role="list" className="-my-6 divide-y divide-gray-300">
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={
                      cartItem &&
                      cartItem.productID &&
                      cartItem.productID.imageUrl
                    }
                    alt="Cart-Item"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a>
                          {cartItem &&
                            cartItem.productID &&
                            cartItem.productID.name}
                        </a>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      Rs.{" "}
                      {cartItem &&
                        cartItem.productID &&
                        cartItem.productID.price}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {cartItem && cartItem.quantity}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      className="font-medium text-red-400 sm:order-2"
                      onClick={() => handleDeleteCardItem(cartItem._id)}>
                      {componentLevelLoader &&
                      componentLevelLoader.loading &&
                      cartItem._id === componentLevelLoader.id ? (
                        <ComponentLevelLoader
                          text={"Removing..."}
                          color={"#fc8181"}
                          loading={
                            componentLevelLoader && componentLevelLoader.loading
                          }
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null
      }
      buttonComponent={
        <Fragment>
          <button
            type="button"
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
            onClick={() => {
              setShowCartModal(false);
              router.push("/cart");
            }}>
            Go To Cart
          </button>
          <button
            type="button"
            disabled={cartItems && cartItems.length === 0}
            onClick={() => {
              setShowCartModal(false);
              router.push("/checkout");
            }}
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50">
            Checkout
          </button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
            <button
              type="button"
              className="font-medium text-gray"
              onClick={() => {
                setShowCartModal(false);
                //router.push("/product/listing/all-products");
              }}>
              Continue Shopping
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </Fragment>
      }
    />
  );
}
