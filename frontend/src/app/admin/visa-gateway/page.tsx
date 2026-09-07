// src/app/admin/visa-gateway/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Building2, Globe, Users, Book } from "lucide-react";
import Link from "next/link";
import {
  VisaConsultationParams,
  VisaGatewayCountResponse,
} from "@/lib/api/endpoints/seeker/seekerVisaGatewayEndpoints";
import adminVisaGatewayEndpoints, {
  CountryCountResponse,
} from "@/lib/api/endpoints/admin/adminVisaGatewayEndpoints";
import toast from "react-hot-toast";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { useSearchParams } from "next/navigation";

export default function AdminVisaGateway() {
  const searchParams = useSearchParams();
      const initialType = searchParams.get("type") as "visa" | "gateway" | null;
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<"visa" | "gateway">(
    initialType || "visa"
  );
  const [applications, setApplications] = useState<CountryCountResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [applicationCounts, setApplicationCounts] =
    useState<VisaGatewayCountResponse>({
      visaCount: 0,
      gatewayCount: 0,
    });
  const itemsPerPage = 10;

  // Fetch application counts
  const fetchCounts = async () => {
    try {
      const appCountRes =
        await adminVisaGatewayEndpoints.visa.countAdminConsultations();

      if (appCountRes.data.success && appCountRes.data.data) {
        setApplicationCounts(appCountRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Fetch visa consultations with pagination and filter
  const fetchVisaConsultations = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params: VisaConsultationParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        const response =
          await adminVisaGatewayEndpoints.visa.getAdminConsultations(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setApplications(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load enrollments");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load enrollments";
        console.error("Error fetching enrollments:", errorMessage);
        toast.error(
          errorMessage || "Failed to load enrollments. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  const fetchGatewayConsultations = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params: VisaConsultationParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        const response =
          await adminVisaGatewayEndpoints.gateway.getAdminConsultations(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setApplications(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load enrollments");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load enrollments";
        console.error("Error fetching enrollments:", errorMessage);
        toast.error(
          errorMessage || "Failed to load enrollments. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  // Initial load and refetch
  useEffect(() => {
    fetchCounts();
    if (activeFilter === "visa") {
      fetchVisaConsultations(currentPage);
    } else if (activeFilter === "gateway") {
      fetchGatewayConsultations(currentPage);
    }
  }, [
    activeFilter,
    currentPage,
    fetchVisaConsultations,
    fetchGatewayConsultations,
  ]);

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

  // Get navigation link based on post type
  const getNavigationLink = (country: string) => {
    if (activeFilter === "visa") {
      return `/admin/visa-gateway/visa/${country}`;
    } else {
      return `/admin/visa-gateway/gateway/${country}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              View and manage visa and gateway service applications
            </p>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex gap-4 mb-4 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              {/* <button
                onClick={() => {
                  setTypeFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  typeFilter === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                All <span className="hidden md:inline-block">({allCount})</span>
              </button> */}
              <button
                onClick={() => handleFilterChange("visa")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  activeFilter === "visa"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Book size={14} /> */}
                Visa{" "}
                <span className="hidden md:inline-block">
                  ({applicationCounts.visaCount})
                </span>
              </button>
              <button
                onClick={() => handleFilterChange("gateway")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold flex items-center gap-1 ${
                  activeFilter === "gateway"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                {/* <Globe size={14} /> */}
                Gateway{" "}
                <span className="hidden md:inline-block">
                  ({applicationCounts.gatewayCount})
                </span>
              </button>
            </div>
          </div>

          {/* Posts List - Country Cards */}
          <div className="flex-1 space-y-4">
            {isLoading ? (
              <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                <SubLoadingScreen
                  message="Loading consultations..."
                  fullScreen={false}
                />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "visa"
                    ? `No visa consultations found`
                    : activeFilter === "gateway"
                      ? `No gateway consultations found`
                      : "No consultations received yet"}
                </p>
              </div>
            ) : (
              applications.map((post) => (
                <div
                  key={post.country}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="gap-1">
                          {activeFilter === "visa" ? (
                            <Book size={14} />
                          ) : (
                            <Globe size={14} />
                          )}
                          {activeFilter === "visa"
                            ? "Visa Service"
                            : "Gateway Service"}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-xl mb-1">
                        {post.country}{" "}
                        {activeFilter === "visa" ? "Visa" : "Gateway"}
                      </h3>

                      {/* Post Stats */}
                      {/* <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={14} /> {post.count} applications
                      </span>
                    </div> */}
                    </div>

                    {/* View Applications Button with different navigation */}
                    <div className="flex flex-col gap-2 items-center md:items-end">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {post.count} applications
                        </span>
                      </div>
                      <Link href={getNavigationLink(post.country)}>
                        <Button
                          variant="default"
                          size="default"
                          className="gap-2 cursor-pointer bg-primary hover:bg-primary/90"
                        >
                          <Eye size={16} />
                          View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Empty State */}
            {applications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {activeFilter === "visa"
                    ? "No visa applications found"
                    : activeFilter === "gateway"
                      ? "No gateway applications found"
                      : "No applications found"}
                </p>
              </div>
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
                {applications.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} enrollments
              </div>
            </div>
          )}

          {totalPages <= 1 && totalItems > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
              Showing all {totalItems} applications
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
