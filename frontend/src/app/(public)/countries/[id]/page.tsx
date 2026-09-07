// src/app/(public)/countries/[id]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CountryResponse } from "@/lib/api/endpoints/admin/adminContentEndpoints";
import publicContentEndpoints from "@/lib/api/endpoints/public/publicContentEndpoints";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function CountryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [country, setCountry] = useState<CountryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const countryId = params.id?.toString() || "0";
  // const pathname = usePathname();

  const fetchCountry = useCallback(async () => {
    // Prevent duplicate fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const response =
        await publicContentEndpoints.country.getCountryById(countryId);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCountry(apiResponse.data);

      } else {
        setError(apiResponse.message || "Failed to load country details");
        toast.error(apiResponse.message || "Failed to load country details");
      }
    } catch (error) {
      console.error("Error fetching country:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load country details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [countryId]);

  useEffect(() => {
    // Reset refs when countryId changes
    hasFetched.current = false;

    if (params.id) {
      fetchCountry();
    }

    return () => {
      hasFetched.current = false;
    };
  }, [params.id, fetchCountry]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 pt-16 xl:pt-24">
        <div className="pl-8 pt-6 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-0 flex items-center gap-4 justify-center cursor-pointer hover:bg-transparent group"
          >
            <div className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-all duration-300 group-hover:scale-110">
              <ArrowLeft
                className="text-primary"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            <h2 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
              Back
            </h2>
          </Button>
        </div>

        <div className="space-y-6 p-4">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="space-y-2 pt-16 xl:pt-24">
        <div className="pl-8 pt-6 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-0 flex items-center gap-4 justify-center cursor-pointer hover:bg-transparent group"
          >
            <div className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-all duration-300 group-hover:scale-110">
              <ArrowLeft
                className="text-primary"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
            <h2 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
              Back
            </h2>
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {error || "Country not found"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 pt-16 xl:pt-24">
      <div className="pl-8 pt-6 pb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-0 flex items-center gap-4 justify-center cursor-pointer hover:bg-transparent group"
        >
          <div className="bg-primary/10 hover:bg-primary/20 p-2 rounded-full transition-all duration-300 group-hover:scale-110">
            <ArrowLeft
              className="text-primary"
              style={{ width: "20px", height: "20px" }}
            />
          </div>
          <h2 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
            Back
          </h2>
        </Button>
      </div>

      <div className="px-4 md:px-16 pt-2">
        {/* Hero Header with Image Background */}
        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6">
          {country.imageUrl ? (
            <>
              <img
                src={country.imageUrl}
                alt={country.name}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-primary/20 transperent" />
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-r from-primary-600 via-primary-700 to-primary-900" />
          )}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-background">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                {country.name}
              </h1>
            </div>
            <p className="text-background/90 text-lg max-w-2xl drop-shadow-md">
              {country.shortDescription}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-card rounded-xl p-4 shadow-sm border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Salary Range
            </h3>
            <p className="text-xl font-bold text-primary">
              {country.salary || "N/A"}
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Visa Type
            </h3>
            <p className="text-xl font-bold">{country.visaType || "N/A"}</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Last Updated
            </h3>
            <p className="text-xl font-bold">{formatDate(country.updatedAt)}</p>
          </div>
        </div>

        {/* Description */}
        <Card className="bg-primary/4">
          <CardContent className="px-6 py-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              About {country.name}
            </h3>
            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: country.description || "No description provided.",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
