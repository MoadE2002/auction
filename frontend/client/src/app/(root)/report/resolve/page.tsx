"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import axiosInstance from '../../../../apicalls/axiosInstance';

// Types for reports
interface Report {
  id: number;
  content: string;
  createdAt: string;
  resolved: boolean;
  userId: number;
  userEmail: string;
}

// Enum for Resolved Status
enum ResolvedStatus {
  ALL = 'ALL',
  RESOLVED = 'RESOLVED',
  UNRESOLVED = 'UNRESOLVED'
}

const ReportsManagementPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthContext();

  // Authentication check effect
  useEffect(() => {
    if (!user) {
      router.push("/user/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.push("/home"); 
      return;
    }
  }, [user, router]);

  // State declarations
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolvedFilter, setResolvedFilter] = useState<ResolvedStatus>(ResolvedStatus.ALL);
  const [loading, setLoading] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports function
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/reports/all');
      setReports(response.data);
    } catch (error) {
      setError('Failed to fetch reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Resolve report function
  const resolveReport = async (reportId: number) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.put(`/reports/resolve/${reportId}`);
      await fetchReports();
    } catch (error) {
      setError('Failed to resolve report');
      console.error('Error resolving report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete report function
  const deleteReport = async (reportId: number) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.delete(`/reports/delete/${reportId}`);
      setReportToDelete(null);
      await fetchReports();
    } catch (error) {
      setError('Failed to delete report');
      console.error('Error deleting report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch reports
  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchReports();
    }
  }, [user]);

  // Filter reports based on resolved status
  const filteredReports = reports.filter(report => {
    if (resolvedFilter === ResolvedStatus.ALL) return true;
    return resolvedFilter === ResolvedStatus.RESOLVED ? report.resolved : !report.resolved;
  });

  // Early return with loading state or null
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold">Reports Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={resolvedFilter} 
            onValueChange={(value: ResolvedStatus) => setResolvedFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Resolution Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ResolvedStatus.ALL}>All Status</SelectItem>
              <SelectItem value={ResolvedStatus.RESOLVED}>Resolved</SelectItem>
              <SelectItem value={ResolvedStatus.UNRESOLVED}>Unresolved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <div className="overflow-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Reports List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map(report => (
                    <TableRow key={report.id}>
                      <TableCell>{report.userEmail}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {report.content}
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={
                          report.resolved 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }>
                          {report.resolved ? 'Resolved' : 'Unresolved'}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedReport(report)}
                          disabled={loading}
                        >
                          View
                        </Button>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Details Dialog */}
      {selectedReport && (
        <Dialog 
          open={!!selectedReport} 
          onOpenChange={() => setSelectedReport(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                Detailed information about the report
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p><strong>User Email:</strong> {selectedReport.userEmail}</p>
              <p><strong>User ID:</strong> {selectedReport.userId}</p>
              <p><strong>Content:</strong> {selectedReport.content}</p>
              <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
              <p>
                <strong>Status:</strong> 
                <span className={
                  selectedReport.resolved 
                    ? 'text-green-600 ml-2' 
                    : 'text-red-600 ml-2'
                }>
                  {selectedReport.resolved ? 'Resolved' : 'Unresolved'}
                </span>
              </p>
            </div>
            <DialogFooter className="mt-4">
              {!selectedReport.resolved && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    resolveReport(selectedReport.id);
                    setSelectedReport(null);
                  }}
                  disabled={loading}
                >
                  Resolve Report
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => {
                  setReportToDelete(selectedReport);
                  setSelectedReport(null);
                }}
                disabled={loading}
              >
                Delete Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!reportToDelete}
        onOpenChange={() => setReportToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reportToDelete && deleteReport(reportToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportsManagementPage;