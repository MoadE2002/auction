"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartsProps {
  isAdmin: boolean;
  itemsCreatedByMonth: Record<string, number>;
  monthlyRevenue: Record<string, number>;
}

const PerformanceAdmin: React.FC<PerformanceChartsProps> = ({
  isAdmin,
  itemsCreatedByMonth,
  monthlyRevenue,
}) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Convert itemsCreatedByMonth into sorted data for the chart
  const itemsData = monthNames.map((month, index) => ({
    name: month,
    items: itemsCreatedByMonth[(index + 1).toString()] || 0, // Changed to match input data format
  }));

  // Convert monthlyRevenue into sorted data for the chart
  const revenueData = monthNames.map((month, index) => ({
    name: month,
    revenue: monthlyRevenue[(index + 1).toString()] || 0, // Changed to match input data format
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Items Created by Month */}
      <Card>
        <CardHeader>
          <CardTitle>Items Created by Month</CardTitle>
          <CardDescription>
            This chart shows the number of items created per month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={itemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="items"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>
            This chart shows the revenue generated each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAdmin;