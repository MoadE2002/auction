"use client";

import StatsCards from "../../../components/stats-cards";
import { QuickSchedule } from "../../../components/quick-schedule";
import UpcomingAppointments from "../../../components/UpcomingAppointments";
import PerformanceCharts from "../../../components/performance-charts";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/apicalls/axiosInstance";

const Page: React.FC = () => {
  const isAdmin: boolean = false;
  const router = useRouter();
  const { user } = useAuthContext();

  // State for user statistics
  const [userStats, setUserStats] = useState<any>(null);

  // Fetch user statistics
  useEffect(() => {
    if (user) {
      axiosInstance
        .get(`/users/user-statistics/${user._id}`)
        .then((response) => {
          setUserStats(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user statistics:", error);
        });
    }
  }, [user]);

  // Calculate total revenue
  const calculateTotalRevenue = (monthlyRevenue: { [key: string]: number }) => {
    return Object.values(monthlyRevenue).reduce((sum, value) => sum + value, 0);
  };

  if (!user || !userStats) {
    return null;
  }

  // Destructure the statistics
  const { monthlyRevenue, itemsCreatedByMonth, unsoldItemsCount, totalItemsCreated, totalBids } = userStats;

  // Calculate total revenue
  const totalRevenue = calculateTotalRevenue(monthlyRevenue);

  return (
    <div className="container mx-auto p-4">
      <div className="w-full flex-row mb-14">
        <p className="text-xl text-gray-400 mb-5">Welcome to your space</p>

        {/* Pass data to StatsCards */}
        <StatsCards
          isAdmin={isAdmin}
          totalBids={totalBids}
          totalItemsCreated={totalItemsCreated}
          unsoldItemsCount={unsoldItemsCount}
          totalRevenue={totalRevenue}
        />
      </div>

      <PerformanceCharts
        isAdmin={isAdmin}
        monthlyRevenue={monthlyRevenue}
        itemsCreatedByMonth={itemsCreatedByMonth}
      />
    </div>
  );
};

export default Page;
