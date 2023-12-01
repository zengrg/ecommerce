"use client";

import { GlobalContext } from "@/context";
import { deleteProduct } from "@/services/product";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import ComponentLevelLoader from "@/components/Loader/ComponentLevelLoader";
import { addToCart } from "@/services/cart";

export default function ProductButton({ item }) {
  const {
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    isAuthUser,
    showCartModal,
    setShowCartModal,
    user,
  } = useContext(GlobalContext);
  const router = useRouter();
  const pathName = usePathname();
  const isAdminView = pathName.includes("admin-view");

  async function handleAddToCart(getItem) {
    if (isAuthUser) {
      setComponentLevelLoader({ loading: true, id: getItem._id });
      const res = await addToCart({ productID: getItem._id, userID: user._id });

      if (res.success) {
        toast.success(res.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setComponentLevelLoader({ loading: false, id: "" });
        setShowCartModal(true);
      } else {
        toast.error(res.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setComponentLevelLoader({ loading: false, id: "" });
        setShowCartModal(true);
      }
    } else {
      toast.error("You are not authenticated!!! Please log in", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }

  async function handleDeleteProduct(item) {
    setComponentLevelLoader({ loading: true, id: item._id });
    const res = await deleteProduct(item._id);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      router.refresh();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return isAdminView ? (
    <>
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product");
        }}
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
        update
      </button>
      <button
        onClick={() => handleDeleteProduct(item)}
        className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={"Deleting product"}
            color={"#ffffff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "delete"
        )}
      </button>
    </>
  ) : (
    <button
      onClick={() => handleAddToCart(item)}
      className="mt-1.5 flex w-full justify-center bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
      {componentLevelLoader &&
      componentLevelLoader.loading &&
      item._id === componentLevelLoader.id ? (
        <ComponentLevelLoader
          text={"Adding to cart"}
          color={"#ffffff"}
          loading={componentLevelLoader && componentLevelLoader.loading}
        />
      ) : (
        "Add to cart"
      )}
    </button>
  );
}
