"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, AppleIcon, Clock, TrendingUp, History } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "sonner";
import axiosInstance from "../apicalls/axiosInstance";

const AuctionInfoCard = ({ product, customBid, setCustomBid }) => {
  const { user } = useAuthContext();
  const isUserSeller = user && user._id === product.sellerId;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateBid = (bidAmount) => {
    const amount = parseFloat(bidAmount);

    
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid bid amount");
      return false;
    }

    if (amount <= product.currentBid) {
      toast.error(`Bid must be higher than the current bid (€${product.currentBid.toLocaleString()})`);
      return false;
    }

    return true;
  };

  const handlePlaceBid = async () => {
    if (!user) {
      toast.error("Please log in to place a bid");
      return;
    }

    if (!validateBid(customBid)) {
      return;
    }

    try {
      console.log("this is  product id "  + product.id)
      setIsSubmitting(true);
      await axiosInstance.post(`/bids/${product.id}`, {
        amount: parseFloat(customBid)
      });

      toast.success("Bid placed successfully!");
      setCustomBid(''); // Reset bid input
      
      // You might want to add a callback to refresh the auction data
      // if provided by the parent component
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Main Bidding Card */}
      <Card className="h-fit top-4">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-blue-600">
              € {(product.currentBid || 0).toLocaleString()}
            </h2>
            <p className="text-gray-500 text-lg">
              <span className="font-medium">Prix de réserve : </span>
              <span className={product.reservePriceReached ? "text-green-600" : "text-red-600"}>
                {product.reservePriceReached ? "Atteint" : "Non atteint"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{product.expertName?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-700 font-semibold">Sélectionné par</p>
              <p className="text-gray-500 text-sm">{product.expertName}</p>
            </div>
          </div>

          {!isUserSeller ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="customBid" className="block text-sm font-medium text-gray-700">
                  Enter your bid (Minimum: €{((product.currentBid || 0) + 1).toLocaleString()})
                </label>
                <Input
                  id="customBid"
                  type="number"
                  value={customBid}
                  onChange={(e) => setCustomBid(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full"
                  min={product.currentBid + 1}
                  step="0.01"
                  disabled={isSubmitting}
                />
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handlePlaceBid}
                disabled={isSubmitting || !customBid}
              >
                {isSubmitting ? "Placing bid..." : "Placez votre offre"}
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-center">
                Vous êtes le vendeur de cette enchère
              </p>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Clôture des enchères :</strong> {product.closingDate}
            </p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <p>
                Frais de protection des acheteurs : <strong>9% + €3</strong>
              </p>
              <p>Livraison : Non disponible pour le Maroc</p>
            </div>

            <div className="flex gap-3">
              <CreditCard className="w-6 h-6 text-gray-700" />
              <CreditCard className="w-6 h-6 text-gray-700" />
              <CreditCard className="w-6 h-6 text-gray-700" />
              <AppleIcon className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auction Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Auction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auction Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Total Bids</p>
                <p className="font-semibold">{product.totalBids || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Time Left</p>
                <p className="font-semibold">{product.timeLeft || "Calculating..."}</p>
              </div>
            </div>
          </div>

          {/* Bid History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Bids
              </h3>
            </div>
            <div className="space-y-3">
              {(product.bidHistory || []).map((bid, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">User_{bid.userId}</span>
                  <span className="font-semibold">€ {bid.amount.toLocaleString()}</span>
                  <span className="text-gray-500 text-xs">{bid.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
              <span>Watching</span>
              <span>{product.watchers || 0} users</span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>New bid placed 2 minutes ago</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>5 new watchers in the last hour</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Reserve price almost reached</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionInfoCard;