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
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import eye icon
import { useAuthContext } from "../../../../hooks/useAuthContext";
import axiosInstance from "../../../../apicalls/axiosInstance";

const BidTable = () => {
  const { user } = useAuthContext();
  const [bids, setBids] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [showHighest, setShowHighest] = useState(false);

  // Fetch Bids for the user
  useEffect(() => {
    if (user?._id) {
      const endpoint = showHighest
        ? `/bids/user/highest?page=${page}&size=${rowsPerPage}`
        : `/bids/user?page=${page}&size=${rowsPerPage}`;

      axiosInstance
        .get(endpoint)
        .then((response) => {
          setBids(response.data.content);
          setTotalItems(response.data.totalElements);
        })
        .catch((error) => console.error("Error fetching bids:", error));
    }
  }, [user, page, rowsPerPage, showHighest]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleShowHighestBid = () => {
    setShowHighest(!showHighest);
  };

  return (
    <div className="mt-5">
      <Button variant="contained" onClick={handleShowHighestBid}>
        {showHighest ? "Show All Bids" : "Show Highest Bid Only"}
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Auction Title</TableCell>
              <TableCell>Bidder Username</TableCell>
              <TableCell>Bid Amount</TableCell>
              <TableCell>Bid Time</TableCell>
              <TableCell>Auction End Time</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>{bid.auctionTitle}</TableCell>
                <TableCell>{bid.bidderUsername}</TableCell>
                <TableCell>{`$${bid.amount}`}</TableCell>
                <TableCell>{new Date(bid.bidTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(bid.auctionEndTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Link
                    href={`/booking/${bid.auctionId}`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <VisibilityIcon style={{ marginRight: 4 }} />
                    View Auction
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

export default BidTable;
