// src/app/admin/content/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { VisaList } from "@/components/admin/content/VisaList";
import { CountriesList } from "@/components/admin/content/CountriesList";
import { StoriesList } from "@/components/admin/content/StoriesList";
import adminContentEndpoints, {
  PostCountsResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"visas" | "countries" | "stories">(
    "visas",
  );
  const [postCounts, setPostCounts] = useState<PostCountsResponse>({
    visaCount: 0,
    countryCount: 0,
    storyCount: 0,
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);
  const isInitialMount = useRef(true);

  // Fetch post counts
  const fetchPostCounts = useCallback(async () => {
    setIsLoadingCounts(true);
    try {
      const response = await adminContentEndpoints.visa.getPostCounts();
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setPostCounts(apiResponse.data);
      }
    } catch (error) {
      console.error("Error fetching post counts:", error);
    } finally {
      setIsLoadingCounts(false);
    }
  }, []);

  // Initial load only on mount
  useEffect(() => {
    fetchPostCounts();
  }, [fetchPostCounts]);

  // Refetch when tab changes, but skip the initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchPostCounts();
  }, [activeTab, fetchPostCounts]);

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Manage visa guides, country information, and success stories
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setActiveTab("visas")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "visas"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Visas{" "}
                <span className="hidden md:inline-block">
                  ({postCounts.visaCount})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("countries")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "countries"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Countries{" "}
                <span className="hidden md:inline-block">
                  ({postCounts.countryCount})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("stories")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "stories"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Stories{" "}
                <span className="hidden md:inline-block">
                  ({postCounts.storyCount})
                </span>
              </button>
            </div>
            <div className="flex gap-2">
              {activeTab === "visas" && (
                <Link href="/admin/content/visas/create">
                  <Button className="gap-2 cursor-pointer w-full lg:w-auto">
                    <Plus size={16} />
                    Create Visa Post
                  </Button>
                </Link>
              )}
              {activeTab === "countries" && (
                <Link href="/admin/content/countries/create">
                  <Button className="gap-2 cursor-pointer w-full lg:w-auto">
                    <Plus size={16} />
                    Create Country Post
                  </Button>
                </Link>
              )}
              {activeTab === "stories" && (
                <Link href="/admin/content/stories/create">
                  <Button className="gap-2 cursor-pointer w-full lg:w-auto">
                    <Plus size={16} />
                    Create Story Post
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          {activeTab === "visas" && (
            <VisaList onCountChange={fetchPostCounts} />
          )}
          {activeTab === "countries" && (
            <CountriesList  />
          )}
          {activeTab === "stories" && (
            <StoriesList  />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
