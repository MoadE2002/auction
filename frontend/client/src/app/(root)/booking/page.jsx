"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../../apicalls/axiosInstance";
import Imagefade from "../../../components/Imagefade/Imagefade";
import AuctionCard from "../../../components/DoctorCard/DoctorCard";
import SearchAuction from "../../../components/SearchDoctor/SearchDoctor";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { Typography } from "@mui/material";

const Page = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 12;  // This should match your backend pagination size

  const [filters, setFilters] = useState({
    title: "",
    category: [],
    priceRange: [0, 1000],
    brand: [],
  });

  useEffect(() => {
    setAuctions([]);
    setPage(0);
    setHasMore(true);
    loadAuctions(0);
  }, [filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 100 &&
        !loading &&
        hasMore &&
        page < totalPages - 1
      ) {
        loadAuctions(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, totalPages]);

  const loadAuctions = async (currentPage) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = {
        page: currentPage,
        size: itemsPerPage,
        title: filters.title || undefined,
        category: filters.category.length > 0 ? filters.category.join(",") : undefined,
        brand: filters.brand.length > 0 ? filters.brand.join(",") : undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1]
      };

      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await axiosInstance.get("/auctions/filtered", { params });
      console.log("this is data " + JSON.stringify(response.data));
      const { content, totalPages: total, empty, last } = response.data;

      if (content?.length) {
        setAuctions(prevAuctions =>
          currentPage === 0 ? content : [...prevAuctions, ...content]
        );
        setPage(currentPage);
        setTotalPages(total);
        setHasMore(!last);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <>
      <Imagefade />
      <div className="fixed top-24 right-6 z-50">
        <SearchAuction onFilterChange={handleFilterChange} initialFilters={filters} />
      </div>

      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction.id}>
              <Link href={`/booking/${auction.id}`} passHref>
                <div className="cursor-pointer h-full">
                  <AuctionCard
                    id={auction.id}
                    productTitle={auction.title}
                    image={auction.frontImage}
                    about={auction.description}
                    price={auction.currentHighestBid || auction.startingPrice}
                    category={auction.category}
                    completedSales={auction.views} 
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center mt-4">
            <CircularProgress />
          </div>
        )}

        {!hasMore && auctions.length === 0 && (
          <div className="text-center mt-4 text-gray-500">
            <Typography variant="h6">
              No auctions found matching your search criteria.
            </Typography>
          </div>
        )}

        {!hasMore && auctions.length > 0 && (
          <div className="text-center mt-4 text-gray-500">
            <Typography variant="body2">
              You've reached the end of the auction listings.
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;