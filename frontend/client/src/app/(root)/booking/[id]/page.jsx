"use client";
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AuctionInfoCard from '../../../../components/AuctionInfoCard';
import AuctionCard from "../../../../components/DoctorCard/DoctorCard";
import axiosInstance from "./.../../../../../../apicalls/axiosInstance";
import { useAuthContext } from "../../../../hooks/useAuthContext";

const ProductImagesCarousel = ({ mainImage, additionalImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [mainImage, ...(additionalImages || [])];
  const getImageUrl = (imageData) => `data:image/jpeg;base64,${imageData}`;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] md:aspect-[16/9] rounded-lg overflow-hidden">
        <img
          src={getImageUrl(images[currentIndex])}
          alt="Product view"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              currentIndex === index ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            <img
              src={getImageUrl(image)}
              alt={`Product thumbnail ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const SuggestedProducts = ({ products }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Produits suggérés</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(products || []).map((product) => (
          <AuctionCard
            key={product.id}
            id={product.id}
            productTitle={product.title}
            image={product.frontImage}  // The component will handle the base64 conversion
            about={product.description}
            price={product.currentHighestBid}
            category={product.category}
            completedSales={product.views}
          />
        ))}
      </div>
    </div>
  );
};

const formatClosingDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const AuctionProduct = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [product, setProduct] = useState(null);
  const [bidHistory, setBidHistory] = useState({ content: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customBid, setCustomBid] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const fetchBidHistory = async (auctionId) => {
    try {
      const { data } = await axiosInstance.get(`/bids/auction/${auctionId}`);
      setBidHistory(data);
    } catch (error) {
      console.error('Failed to fetch bid history:', error);
      setBidHistory({ content: [] });
    }
  };

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        setLoading(true);
        const { data: auctionData } = await axiosInstance.get(`/auctions/${id}`);
        setProduct(auctionData);
        
        await fetchBidHistory(id);
        
        try {
          const { data: suggestedData } = await axiosInstance.get(
            `/auctions/suggested?category=${auctionData.category}`
          );
          setSuggestedProducts(suggestedData || []);
        } catch (suggestedError) {
          console.error('Failed to fetch suggested products:', suggestedError);
          setSuggestedProducts([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch auction data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuctionData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Auction not found</div>
      </div>
    );
  }

  const transformedBidHistory = bidHistory.content.map(bid => ({
    userId: bid.bidderId,
    username: bid.bidderUsername,
    amount: bid.amount,
    time: new Date(bid.bidTime).toLocaleString(),
  }));

  const isUserSeller = user && user._id === product.sellerId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <h1 className="w-full text-2xl text-gray-500 font-extrabold text-end text-nowrap mb-8">
            {product.title} - {product.brand}
          </h1>
          <ProductImagesCarousel 
            mainImage={product.frontImage} 
            additionalImages={product.additionalImages} 
          />
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Description</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description || "No description available."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4">
          <AuctionInfoCard 
            product={{
              id : product.id, 
              currentBid: product.currentHighestBid || 0,
              reservePriceReached: false, // Add this if you have it in your API response
              expertName: product.sellerUsername || 'Unknown Seller',
              expertImage: product.sellerImage ? `/api/placeholder/48/48` : '/default-avatar.png', // Using a placeholder for now
              bidOptions: [],
              sellerId : product.sellerId ,  // Add your bid options array if available
              closingDate: formatClosingDate(product.endTime),
              totalBids: bidHistory.content.length,
              timeLeft: "Calculating...", // You might want to implement a countdown timer
              bidHistory: bidHistory.content.map(bid => ({
                userId: bid.bidderId,
                amount: bid.amount,
                time: new Date(bid.bidTime).toLocaleString()
              })),
              watchers: product.views || 0
            }}
            customBid={customBid}
            setCustomBid={setCustomBid}
          />
        </div>
      </div>

      {/* Suggested Products */}
      <SuggestedProducts products={suggestedProducts} />
    </div>
  );
};

export default AuctionProduct;