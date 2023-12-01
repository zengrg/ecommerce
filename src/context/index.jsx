"use client";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);
export const initalCheckoutFormData = {
  shippingAddress: {},
  paymentMethod: "",
  totalPrice: 0,
  isPaid: false,
  paidAt: new Date(),
  isProcessing: true,
};

export default function GlobalState({ children }) {
  const [showNavModal, setShowNavModal] = useState(false);
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [currentUpdatedAddress, setCurrentUpdatedAddress] = useState(null);
  const [checkoutFormData, setCheckoutFormData] = useState(
    initalCheckoutFormData
  );
  const [allOrdersForUser, setAllOrdersForUser] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [allOrdersForAllUsers, setAllOrdersForAllUsers] = useState(null);

  const protectedRoutes = [
    "cart",
    "checkout",
    "account",
    "orders",
    "admin-view",
  ];
  const protectedAdminRoutes = [
    "/admin-view",
    "/admin-view/add-product",
    "/admin-view/all-products",
  ];
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (Cookies.get("token") !== undefined) {
      setIsAuthUser(true);
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setUser(userData);
      setCartItems(getCartItems);
    } else {
      setIsAuthUser(false);
      setUser({}); //unauthenticated user
    }
  }, [Cookies]);

  useEffect(() => {
    const paths = pathName.split("/");

    if (
      user &&
      Object.keys(user).length === 0 &&
      protectedRoutes.includes(paths[1])
    )
      router.push("/login");
    if (user?.role !== "Admin" && protectedAdminRoutes.includes(paths[1]))
      router.push("/404");
  }, [user, pathName]);

  return (
    <GlobalContext.Provider
      value={{
        showNavModal,
        setShowNavModal,
        componentLevelLoader,
        setComponentLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        pageLevelLoader,
        setPageLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
        showCartModal,
        setShowCartModal,
        cartItems,
        setCartItems,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        currentUpdatedAddress,
        setCurrentUpdatedAddress,
        checkoutFormData,
        setCheckoutFormData,
        allOrdersForUser,
        setAllOrdersForUser,
        orderDetails,
        setOrderDetails,
        allOrdersForAllUsers,
        setAllOrdersForAllUsers,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}
