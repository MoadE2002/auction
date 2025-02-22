"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import eye icon
import axiosInstance from "../../../apicalls/axiosInstance";
import { useAuthContext } from '../../../hooks/useAuthContext';
const AuctionTable = () => {
  const { user } = useAuthContext();
  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("startingPrice");
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Auctions for the user
  useEffect(() => {
    if (user?._id) {
      axiosInstance
        .get(
          `/auctions/user/${user._id}?page=${page}&size=${rowsPerPage}&sort=${orderBy},${order}`
        )
        .then((response) => {
          setAuctions(response.data.content);
          setTotalItems(response.data.totalElements);
        })
        .catch((error) => console.error("Error fetching auctions:", error));
    }
  }, [user, page, rowsPerPage, order, orderBy]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortData = (array) => {
    return array.sort((a, b) => {
      if (orderBy === "startingPrice") {
        return order === "asc"
          ? a.startingPrice - b.startingPrice
          : b.startingPrice - a.startingPrice;
      }
      return 0;
    });
  };

  return (
    <div className="mt-5">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "startingPrice"}
                  direction={orderBy === "startingPrice" ? order : "asc"}
                  onClick={() => handleRequestSort("startingPrice")}
                >
                  Starting Price
                </TableSortLabel>
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Highest Bidder</TableCell>
              <TableCell>Highest Bid</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(auctions).map((auction) => (
              <TableRow key={auction.id}>
                <TableCell>{auction.startingPrice}</TableCell>
                <TableCell>{auction.title}</TableCell>
                <TableCell>
                  {auction.currentHighestBidderUsername || "No Bids"}
                </TableCell>
                <TableCell>
                  {auction.currentHighestBid > 0
                    ? `$${auction.currentHighestBid}`
                    : "No Bids"}
                </TableCell>
                <TableCell>{auction.views}</TableCell>
                <TableCell>{new Date(auction.endTime).toLocaleString()}</TableCell>
                <TableCell>
                <Link
                  href={`/booking/${auction.id}`}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <VisibilityIcon style={{ marginRight: 4 }} />
                  See Product
                </Link>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AuctionTable;
