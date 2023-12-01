"use client";

import CommonCart from "@/components/CommonCart";
import PageLevelLoader from "@/components/Loader/PageLevelLoader";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

export default function Cart() {
  const { user, cartItems, setCartItems, setPageLevelLoader, pageLevelLoader,setComponentLevelLoader,componentLevelLoader } =
    useContext(GlobalContext);

  async function extractAllCartItems() {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setPageLevelLoader(false);
      setCartItems(res.data);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    }
  }

  useEffect(() => {
    if (user !== null) extractAllCartItems();
    else setPageLevelLoader(false);
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
    <>
      {pageLevelLoader ? (
        <PageLevelLoader loading={pageLevelLoader} />
      ) : (
        <CommonCart handleDeleteCardItem={handleDeleteCardItem} componentLevelLoader={componentLevelLoader} cartItems={cartItems} />
      )}
      <Notification/>
    </>
  );
}
