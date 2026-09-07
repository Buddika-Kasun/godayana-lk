// src/app/admin/content/countries/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Globe,
  Briefcase,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import adminContentEndpoints, {
  CountryResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";

const visaTypeOptions = [
  { value: "STUDENT", label: "Student Visa" },
  { value: "WORK", label: "Work Visa" },
  { value: "VISIT", label: "Visit Visa" },
  { value: "SSW", label: "Specified Skilled Worker (SSW)" },
  { value: "BUSINESS", label: "Business Visa" },
  { value: "FAMILY", label: "Family Visa" },
  { value: "OTHER", label: "Other" },
];

const getVisaTypeLabel = (value: string) => {
  const found = visaTypeOptions.find((v) => v.value === value);
  return found?.label || value;
};

interface ViewCountryPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewCountryPage({ params }: ViewCountryPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [country, setCountry] = useState<CountryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      setIsLoading(true);
      try {
        const response = await adminContentEndpoints.country.getCountryById(id);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setCountry(apiResponse.data);
        } else {
          toast.error(apiResponse.message || "Failed to load country");
        }
      } catch (error) {
        console.error("Error fetching country:", error);
        toast.error("Failed to load country details");
        router.push("/admin/content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountry();
  }, [id, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
        <SubLoadingScreen
          message="Loading country details..."
          fullScreen={false}
        />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Country not found</p>
        <Link href="/admin/content">
          <Button className="mt-4">Back to Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Back Button */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">Country Details</h2>
      </div>

      <Card className="bg-primary/4 overflow-hidden p-0">
        {/* Hero Header with Image Background */}
        <div className="relative h-64 w-full">
          {country.imageUrl ? (
            <>
              <img
                src={country.imageUrl}
                alt={country.name}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900" />
          )}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                {country.name}
              </h1>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <Globe className="h-3 w-3 mr-1" />
                {country.visaType ? getVisaTypeLabel(country.visaType) : "N/A"}
              </Badge>
            </div>
            <p className="text-white/90 text-lg max-w-2xl drop-shadow-md">
              {country.shortDescription}
            </p>
          </div>
        </div>

        <CardContent className="px-6 py-6">
          <div className="space-y-6">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Salary Range
                </h3>
                <p className="text-lg font-medium flex items-center gap-2">
                  <DollarSign size={16} className="text-muted-foreground" />
                  {country.salary || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Visa Type
                </h3>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Briefcase size={16} className="text-muted-foreground" />
                  {country.visaType
                    ? getVisaTypeLabel(country.visaType)
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Created At
                </h3>
                <p className="text-lg font-medium flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  {formatDate(country.createdAt)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Detailed Description
              </h3>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: country.description || "No description provided.",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
