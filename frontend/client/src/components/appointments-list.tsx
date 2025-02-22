"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/apicalls/axiosInstance";
import Link from "next/link"; // Import Link for navigation
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";

interface Auction {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  currentHighestBid: number;
  startTime: string;
  endTime: string;
  sellerUsername: string;
  category: string;
  brand: string;
  views: number;
}

interface Pagination {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
}

export function AuctionsList() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ pageNumber: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await axiosInstance.get("/auctions/all", {
          params: { page: pagination.pageNumber, size: 10 },
        });
        setAuctions(response.data.content);
        setPagination({
          pageNumber: response.data.pageable.pageNumber,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
        });
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuctions();
  }, [pagination.pageNumber]);

  const handlePageChange = (direction: "next" | "prev") => {
    setPagination((prev) => ({
      ...prev,
      pageNumber:
        direction === "next"
          ? Math.min(prev.pageNumber + 1, prev.totalPages - 1)
          : Math.max(prev.pageNumber - 1, 0),
    }));
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Current Bid</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Views</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : (
            auctions.map((auction) => (
              <TableRow key={auction.id}>
                <TableCell>
                  <Link href={`/booking/${auction.id}`} className="text-blue-600 hover:underline">
                    {auction.title}
                  </Link>
                </TableCell>
                <TableCell>{auction.category}</TableCell>
                <TableCell>{auction.currentHighestBid}</TableCell>
                <TableCell>{new Date(auction.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(auction.endTime).toLocaleString()}</TableCell>
                <TableCell>{auction.views}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button onClick={() => handlePageChange("prev")} disabled={pagination.pageNumber === 0}>
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={pagination.pageNumber === pagination.totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
