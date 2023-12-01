"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function ProductTile({ item }) {
  const router = useRouter()
  return (
    <div onClick={()=>router.push(`/product/${item._id}`)}>
      <div className="overflow-hidden aspect-w-1 aspect-h-1 h-52 max-h-52 min-h-52">
        <img
          src={item.imageUrl}
          alt="Product Image"
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-125"
        />
      </div>
      {item.onSale === "Yes" ? (
        <div className="absolute top-0 m-2 rounded-full bg-black">
          <p className="rounded-full bg-black p-1 text-[8px] font-bold uppercase tracking-wide text-white sm:py-1 sm:px-3">
            Sale
          </p>
        </div>
      ) : null}
      <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
        <div className="mb-2 flex flex-col flex-grow">
          <>
            <p className="mr-3 text-xl font-semibold">{`Rs. ${Math.ceil(
              ((100 - item.priceDrop) / 100) *
              item.price
            )}`}</p>

            <div className="mb-2 flex min-h-[15px]">
              <p
                className={`mr-3 text-xs font-semibold ${
                  item.onSale === "Yes" ? "line-through text-red-600" : "hidden"
                }`}>{`Rs ${Math.ceil(item.price)}`}</p>
              <p
                className={`mr-3 text-xs font-semibold ${
                  item.onSale !== "Yes" ? "hidden" : ""
                }`}>{` -${item.priceDrop}%`}</p>
            </div>
          </>
        </div>
        <h3 className="md-2 text-gray-600 font-bold text-lg max-h-[30px] overflow-hidden">
          {item.name}
        </h3>
      </div>
    </div>
  );
}
