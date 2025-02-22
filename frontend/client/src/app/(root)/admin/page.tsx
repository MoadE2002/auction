"use client";

import { Card } from "@/components/ui/card";
import StatsAdmin from "../../../components/StatsAdmin";
import PerformanceAdmin from "../../../components/PerformanceAdmin";
import { AuctionsList } from "../../../components/appointments-list";
import DoctorsList from "../../../components/DoctorsList";
import Link from "next/link";
import { IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import axiosInstance from "@/apicalls/axiosInstance";

interface Statistics {
  totalBids: number;
  totalItemsCreated: number;
  unsoldItemsCount: number;
  totalRevenue: number;
  monthlyAuctionItemCounts: {
    [key: string]: number;
  };
  monthlyRevenue: {
    [key: string]: number;
  };
}

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/statistics');
        const transformedData: Statistics = {
          totalBids: response.data.totalClients, 
          totalItemsCreated: response.data.totalAuctionItems,
          unsoldItemsCount: response.data.totalUnsoldAuctionItems,
          totalRevenue: response.data.totalRevenue,
          monthlyAuctionItemCounts: response.data.monthlyAuctionItemCounts,
          monthlyRevenue: response.data.monthlyRevenue
        };
        setStatistics(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>;
  }

  if (error) {
    return <div className="flex-1 space-y-4 p-8 pt-6">Error: {error}</div>;
  }

  // Transform monthlyRevenue data to use numeric keys
  const transformedMonthlyRevenue: Record<string, number> = {};
  if (statistics?.monthlyRevenue) {
    const monthMap: { [key: string]: string } = {
      'JANUARY': '1', 'FEBRUARY': '2', 'MARCH': '3', 'APRIL': '4',
      'MAY': '5', 'JUNE': '6', 'JULY': '7', 'AUGUST': '8',
      'SEPTEMBER': '9', 'OCTOBER': '10', 'NOVEMBER': '11', 'DECEMBER': '12'
    };
    
    Object.entries(statistics.monthlyRevenue).forEach(([month, value]) => {
      transformedMonthlyRevenue[monthMap[month]] = value;
    });
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <StatsAdmin 
        isAdmin={true}
        totalBids={statistics?.totalBids ?? 0}
        totalItemsCreated={statistics?.totalItemsCreated ?? 0}
        unsoldItemsCount={statistics?.unsoldItemsCount ?? 0}
        totalRevenue={statistics?.totalRevenue ?? 0}
      />
      <PerformanceAdmin 
        isAdmin={true}
        itemsCreatedByMonth={statistics?.monthlyAuctionItemCounts ?? {}}
        monthlyRevenue={transformedMonthlyRevenue}
      />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="flex flex-col h-[450px] p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Auction Item</h2>
            <AuctionsList isAdmin={true} />
          </div>
        </Card>
        <Card className="col-span-3">
          <DoctorsList />
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7 min-h-[350px] w-full">
        <div className="h-full w-full ">
          <Link href="/report/resolve">
            <Card className="w-full col-span-1 h-1/2 flex items-center justify-center p-6 transition duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-105">
              <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Manage Report</h2>
                <IconButton aria-label="go to report">
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}