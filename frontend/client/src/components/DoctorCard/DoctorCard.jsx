"use client";
import React from "react";

const AuctionCard = ({
  id,
  productTitle,
  image,
  about,
  price,
  category,
  completedSales,
}) => {
  // Ensure about is defined before splitting it
  const description = about ? about.split(" ").slice(0, 100).join(" ") + "..." : "No description available.";

  // Format base64 image URL
  const getImageUrl = (imageData) => {
    if (!imageData) return "";
    // Check if the image is already a complete data URL
    if (imageData.startsWith('data:image/')) {
      return imageData;
    }
    // If it's just the base64 string, add the proper prefix
    return `data:image/jpeg;base64,${imageData}`;
  };

  return (
    <div
      className="card border border-black shadow-black h-[340px] w-full group gap-[0.5em] rounded-[1.5em] relative flex justify-end flex-col p-[1.5em] z-[1] overflow-hidden bg-white"
      style={{
        marginTop: "",
        backgroundImage: `url(${getImageUrl(image)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40 z-[0]"></div>

      <div className="container text-black z-[2] relative font-nunito flex flex-col gap-[0.5em]">
        {/* Product Title */}
        <div className="h-fit w-full">
          <h1
            className="card_heading text-black text-[1.5em] tracking-[.2em] cursor-pointer"
            style={{
              fontWeight: 900,
              WebkitTextFillColor: "transparent",
              WebkitTextStrokeWidth: "1px",
              textShadow: "0 0 7px #fff",
            }}
          >
            {productTitle}
          </h1>
        </div>

        {/* Category */}
        <p
          className="text-[1.2em] cursor-pointer"
          style={{
            fontWeight: 900,
            WebkitTextFillColor: "transparent",
            WebkitTextStrokeWidth: "1px",
            textShadow: "0 0 7px #fff",
          }}
        >
          {category}
        </p>

        {/* Price and Completed Sales */}
        <div className="flex justify-start items-center h-fit w-full gap-[1.5em]">
          <div className="w-fit h-fit text-yellow-600 font-nunito text-[1.2em] font-extrabold">
            <p>${price}</p>
          </div>

          <div className="w-fit h-fit text-gray-600 font-nunito text-[1em]">
            <p>{completedSales} Views</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-nunito block text-white font-light relative h-[0em] group-hover:h-[7em] leading-[1.2em] duration-500 overflow-hidden">
        {description}
      </p>
    </div>
  );
};

export default AuctionCard;