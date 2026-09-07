"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Briefcase,
  DollarSign,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import publicContentEndpoints from "@/lib/api/endpoints/public/publicContentEndpoints";
import { CountryResponse } from "@/lib/api/endpoints/admin/adminContentEndpoints";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 1, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Skeleton Card Component
function CountrySkeleton() {
  return (
    <Card className="h-full pt-0 overflow-hidden border-0">
      <div className="relative h-60 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="px-5 flex flex-col h-full pt-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-start gap-3 mb-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-start gap-3 mb-4">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        <div className="mt-auto pt-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function GatewayPage() {
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 12;

  // Fetch countries with pagination
  const fetchCountries = useCallback(
    async (page: number = 0, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await publicContentEndpoints.country.getCountries({
          page: page,
          size: pageSize,
        });
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const content = apiResponse.data.content || [];
          const totalPagesData = apiResponse.data.totalPages || 0;
          const totalElements = apiResponse.data.totalElements || 0;

          if (append) {
            setCountries((prev) => [...prev, ...content]);
          } else {
            setCountries(content);
          }

          setTotalPages(totalPagesData);
          setTotalItems(totalElements);
          setHasMore(page < totalPagesData - 1);
          setCurrentPage(page);
        } else {
          setError(apiResponse.message || "Failed to load countries");
          toast.error(apiResponse.message || "Failed to load countries");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load countries";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize],
  );

  // Initial load
  useEffect(() => {
    fetchCountries(0, false);
  }, [fetchCountries]);

  // Load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchCountries(currentPage + 1, true);
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <CountrySkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 pb-4 pt-24 xl:pt-28 sm:px-6 lg:px-8 border-b relative rounded-b-3xl text-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="">
          <Image
            src="/images/bg_short.PNG"
            alt="Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={() => console.log("Image failed to load")}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-blue-600/80 via-blue-600/50 to-blue-600/40 dark:from-blue-950/80 dark:via-blue-900/70 dark:to-blue-950/60" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white/80 dark:text-primary/80">
            <span className="font-fm-gamunu text-[40px] md:text-5xl">
              ගොඩයන{" "}
            </span>
            <span className="text-secondary/90">Countries</span>
          </h1>
          <p className="text-white/70">
            Explore global destinations and find the best fit for your future.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
          >
            {renderSkeletons()}
          </motion.div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fetchCountries(0, false)}
            >
              Try Again
            </Button>
          </div>
        ) : countries.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              No countries available
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later for new destinations
            </p>
          </div>
        ) : (
          <>
            {/* Countries Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
            >
              {countries.map((country) => (
                <motion.div
                  key={country.id}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3 },
                  }}
                  className="group max-h-90"
                >
                  <Card
                    className="h-full pt-0 overflow-hidden hover:shadow-2xl transition-all duration-300 border-0"
                    // onClick={() => window.location.href = `/countries/${country.id}`}
                  >
                    {/* Country Image with Overlay */}
                    <div className="relative h-60 overflow-hidden">
                      {country.imageUrl ? (
                        <>
                          <Image
                            src={country.imageUrl}
                            alt={country.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized={!country.imageUrl.startsWith("http")}
                          />
                          {/* Dark Gradient Overlay for better text visibility */}
                          <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-primary/10 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-primary-500 to-primary-700 opacity-90">
                          <div className="absolute inset-0 bg-primary/20" />
                        </div>
                      )}

                      {/* Country Name Overlay - Now with better contrast */}
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 z-10">
                        <h3 className="text-2xl font-bold text-background drop-shadow-lg">
                          {country.name}
                        </h3>
                      </div>

                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                      </div>
                    </div>

                    <CardContent className="px-5 flex flex-col h-full">
                      {/* Top Section - Takes available space */}
                      <div className="flex-1">
                        {/* Description */}
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {country.shortDescription}
                        </p>

                        {/* Salary */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Avg. Salary
                            </span>
                            <span className="text-sm font-semibold">
                              {country.salary}
                            </span>
                          </div>
                        </div>

                        {/* Visa Type */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Briefcase className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">
                              Visa Type
                            </span>
                            <span className="text-sm font-medium">
                              {country.visaType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section - Always at bottom */}
                      <div className="mt-auto pt-2">
                        {/* View Details Link */}
                        <Link
                          href={`/countries/${country.id}`}
                          className="inline-flex items-center text-primary hover:text-primary/80 font-medium group/link transition-colors"
                        >
                          <span>View Details</span>
                          <motion.span
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="inline-block ml-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.span>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2 min-w-50"
                  variant="outline"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Show More
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Total items count */}
            {totalItems > 0 && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                Showing {countries.length} of {totalItems} countries
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
