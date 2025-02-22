"use client"
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ProductImagesCarousel({ product }) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-1 p-4">
        {product.otherImages?.map((image, index) => (
          <figure key={index} className="shrink-0">
            <div className="overflow-hidden rounded-md w-[180px] h-[180px]">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
