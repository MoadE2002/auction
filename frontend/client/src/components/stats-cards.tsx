"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, DollarSign } from "lucide-react";

const StatsCards = ({
  isAdmin,
  totalBids,
  totalItemsCreated,
  unsoldItemsCount,
  totalRevenue,
}: {
  isAdmin: boolean;
  totalBids: number;
  totalItemsCreated: number;
  unsoldItemsCount: number;
  totalRevenue: number;
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Not completed Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Not Completed Bids</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBids}</div>
          <p className="text-xs text-muted-foreground">+2 from yesterday</p>
        </CardContent>
      </Card>

      {/* Upcoming Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items Created</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItemsCreated}</div>
          <p className="text-xs text-muted-foreground">+8 this month</p>
        </CardContent>
      </Card>

      {/* Total Appointment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unsold Items</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unsoldItemsCount}</div>
          <p className="text-xs text-muted-foreground">Items not sold</p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Earnings from completed items
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
