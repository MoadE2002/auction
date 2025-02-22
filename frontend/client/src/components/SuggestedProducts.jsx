"use client"
import React from "react";
import PropTypes from "prop-types";

const SuggestedProducts = ({ products }) => {
  const auctionExample = {
    id: 1,
    title: "Vintage Rolex Watch",
    year: 1985,
    mainImage: "https://via.placeholder.com/600x400",
    description: "A classic vintage Rolex watch in pristine condition.",
    currentBid: 2500,
    reservePriceReached: true,
    estimatedMin: 2000,
    estimatedMax: 3000,
    expertImage: "https://via.placeholder.com/100",
    expertName: "John Doe",
    bidOptions: [2600, 2700, 2800],
    closingDate: "2025-01-15",
    suggestedProducts: [
      {
        id: 2,
        title: "Omega Seamaster",
        mainImage: "https://via.placeholder.com/600x400",
        currentBid: 1500,
      },
      {
        id: 3,
        title: "Tag Heuer Carrera",
        mainImage: "https://via.placeholder.com/600x400",
        currentBid: 1800,
      },
      {
        id: 4,
        title: "Breitling Navitimer",
        mainImage: "https://via.placeholder.com/600x400",
        currentBid: 2200,
      },
      {
        id: 5,
        title: "Cartier Tank Watch",
        mainImage: "https://via.placeholder.com/600x400",
        currentBid: 2000,
      },
    ],
  };


  const fallbackProducts = auctionExample.suggestedProducts;
  const displayedProducts = products && products.length > 0 ? products : fallbackProducts;

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-semibold mb-4">Other Products from this Seller</h3>
      {displayedProducts.length === 0 ? (
        <p className="text-center mt-10">No other products from this seller.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={product.mainImage}
                alt={product.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg">{product.title}</h4>
                <p className="text-gray-600">€ {product.currentBid}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// PropTypes validation
SuggestedProducts.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      mainImage: PropTypes.string.isRequired,
      currentBid: PropTypes.number.isRequired,
    })
  ),
};

export default SuggestedProducts;
