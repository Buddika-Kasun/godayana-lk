// src/app/admin/approvals/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Briefcase,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
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
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { formatDate } from "@/lib/utils/dateUtils";
import {
  CompanyCountsResponse,
} from "@/lib/api/endpoints/company/companyProfileEndpoints";
import { formatCategory } from "@/lib/utils/companyUtils";
import { OptimizedAvatar } from "@/components/ui/OptimizedAvatar";
import { adminCompanyProfileAPI, AdminCompanyParams, AdminCompanyProfileData } from "@/lib/api/endpoints/admin/adminCompanyProfileEndpoint";

// Status mapping: Frontend filter -> Backend status
const STATUS_MAP = {
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
} as const;

// Backend status -> Frontend display
const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  APPROVED: {
    label: "Approved",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function AdminApprovals() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [companies, setCompanies] = useState<AdminCompanyProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompanyUserId, setSelectedCompanyUserId] = useState<
    string | null
  >(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [companyCounts, setCompanyCounts] = useState<CompanyCountsResponse>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const itemsPerPage = 10;

  // Fetch company counts
  const fetchCompanyCounts = async () => {
    try {
      const response = await adminCompanyProfileAPI.getAdminCompanyCounts();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCompanyCounts(apiResponse.data);
      }
    } catch (error) {
      console.error("Error fetching company counts:", error);
    }
  };

  // Fetch companies with pagination and filter
  const fetchCompanies = async (
    filter: typeof activeFilter,
    page: number = 1,
  ) => {
    setIsLoading(true);
    try {
      const backendStatus = STATUS_MAP[filter];
      const params: AdminCompanyParams = {
        page: page - 1,
        size: itemsPerPage,
        status: backendStatus,
      };

      const response = await adminCompanyProfileAPI.getAdminCompanies(params);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCompanies(apiResponse.data.content);
        setTotalItems(apiResponse.data.totalElements);
        setTotalPages(apiResponse.data.totalPages);
      } else {
        toast.error(apiResponse.message || "Failed to load companies");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load companies";
      console.error("Error fetching companies:", errorMessage);
      toast.error(
        errorMessage || "Failed to load companies. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch when filter or page changes
  useEffect(() => {
    fetchCompanyCounts();
    fetchCompanies(activeFilter, currentPage);
  }, [activeFilter, currentPage]);

  useEffect(() => {
    setTotalItems(0);
  }, [activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleApprove = async () => {
    if (!selectedCompanyUserId) return;

    try {
      await adminCompanyProfileAPI.approveCompany(selectedCompanyUserId);

      toast.success("Company approved successfully");
      setSelectedCompanyUserId(null);
      setActionType(null);
      fetchCompanyCounts();
      fetchCompanies(activeFilter, currentPage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to approve company";
      console.error("Error approving company:", errorMessage);
      toast.error(errorMessage || "Failed to approve company");
    }
  };

  const handleReject = async () => {
    if (!selectedCompanyUserId) return;

    try {
      await adminCompanyProfileAPI.rejectCompany(selectedCompanyUserId);

      toast.success("Company rejected");
      setSelectedCompanyUserId(null);
      setActionType(null);
      fetchCompanyCounts();
      fetchCompanies(activeFilter, currentPage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject company";
      console.error("Error rejecting company:", errorMessage);
      toast.error(errorMessage || "Failed to reject company");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Review and approve company registrations
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center justify-between gap-1 flex-wrap">
              <button
                onClick={() => handleFilterChange("pending")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "pending"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Pending{" "}
                <span className="hidden md:inline-block">
                  ({companyCounts.pending})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("approved")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "approved"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Approved{" "}
                <span className="hidden md:inline-block">
                  ({companyCounts.approved})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("rejected")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeFilter === "rejected"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Rejected{" "}
                <span className="hidden md:inline-block">
                  ({companyCounts.rejected})
                </span>
              </button>
            </div>
          </div>

          {/* Companies List */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading companies..."
                  fullScreen={false}
                />
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "pending"
                    ? "No pending company registrations"
                    : activeFilter === "approved"
                      ? "No approved companies"
                      : "No rejected companies"}
                </p>
              </div>
            ) : (
              companies.map((company) => {
                const statusDisplay =
                  STATUS_DISPLAY[company.status || "PENDING"] ||
                  STATUS_DISPLAY.PENDING;

                return (
                  <div
                    key={company.userId}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left Section - Company Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <OptimizedAvatar
                            src={company.logoUrl}
                            alt={company.companyName || "Company"}
                            height={60}
                            width={60}
                            fallback={
                              company.companyName
                                ? company.companyName.charAt(0)
                                : "C"
                            }
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {company.companyName || "Unnamed Company"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {formatCategory(company.industry) ||
                                    "Industry not specified"}
                                </p>
                              </div>
                              <Badge className={statusDisplay.color}>
                                {statusDisplay.label}
                              </Badge>
                            </div>

                            {/* Contact Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Mail
                                  size={14}
                                  className="text-muted-foreground shrink-0"
                                />
                                <span className="text-muted-foreground truncate">
                                  {company.companyEmail || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User
                                  size={14}
                                  className="text-muted-foreground shrink-0"
                                />
                                <span className="text-muted-foreground">
                                  {company.contactPersonName || "N/A"}{" "}
                                  {company.designation
                                    ? `(${company.designation})`
                                    : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone
                                  size={14}
                                  className="text-muted-foreground shrink-0"
                                />
                                <span className="text-muted-foreground">
                                  {company.hotlineNumber || "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar
                                  size={14}
                                  className="text-muted-foreground shrink-0"
                                />
                                <span className="text-muted-foreground">
                                  {formatDate(company.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/approvals/${company.userId}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 cursor-pointer"
                          >
                            <Eye size={14} />
                            View Details
                          </Button>
                        </Link>
                        {(company.status === "PENDING" ||
                          company.status === "REJECTED") && (
                            <Button
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => {
                                setSelectedCompanyUserId(
                                  company.userId || null,
                                );
                                setActionType("approve");
                              }}
                            >
                              <CheckCircle size={14} />
                              Approve
                            </Button>
                          )}
                        {(company.status === "PENDING" ||
                          company.status === "APPROVED") && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1 cursor-pointer"
                              onClick={() => {
                                setSelectedCompanyUserId(
                                  company.userId || null,
                                );
                                setActionType("reject");
                              }}
                            >
                              <XCircle size={14} />
                              Reject
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t">
              <div className="flex justify-center items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer w-10"
                          >
                            {page}
                          </Button>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    },
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer"
                >
                  Next
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Showing{" "}
                {companies.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} companies
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} companies
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog
        open={actionType === "approve"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this company? They will be able
              to post jobs and access all features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700 cursor-pointer"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
        open={actionType === "reject"}
        onOpenChange={() => setActionType(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this company registration? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
