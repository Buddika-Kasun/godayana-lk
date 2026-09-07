// src/app/(public)/jobs/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import { JobDetailsView } from "@/components/jobs/JobDetailsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobResponse } from "@/lib/api/endpoints/company/companyJobEndpoints";
import toast from "react-hot-toast";
import { publicJobAPI } from "@/lib/api/endpoints/public/publicJobEndpoints";
import { useVisitedJobs } from "@/lib/hooks/useVisitedJobs";
import { useSavedJobs } from "@/lib/hooks/useSavedJobs";
import { useAppliedJobs } from "@/lib/hooks/useAppliedJobs";
import { useAuth } from "@/lib/hooks/useAuth";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempViseted, setTempVisited] = useState<boolean>(false);
  const hasFetched = useRef(false);
  const hasMarkedVisited = useRef(false);
  const { isAuthenticated, isProfileComplete, user } = useAuth();
  const pathname = usePathname();

  const jobId = params.id?.toString() || "0";

  // Visited jobs hook
  const { isJobVisited, markJobAsVisited } = useVisitedJobs();

  // Saved jobs hook - DISABLE autoFetch to prevent duplicate API calls
  const { savedJobIds, toggleSaveJob } = useSavedJobs({
    jobId,
    autoFetch: false,
  });

  const { isJobApplied, applyJob } = useAppliedJobs();

  const isSaved = savedJobIds.includes(jobId);

  useEffect(() => {
    setTempVisited(isJobVisited(jobId) || isSaved);
  }, [isJobVisited, jobId, isSaved]);

  const fetchJob = useCallback(async () => {
    // Prevent duplicate fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const isVisited = isJobVisited(jobId) || isJobApplied(jobId) || false;

      const response = await publicJobAPI.getJobById(jobId, { isVisited });
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setJob(apiResponse.data);
        // Mark as visited only once
        if (!hasMarkedVisited.current) {
          hasMarkedVisited.current = true;
          markJobAsVisited(jobId);
        }
      } else {
        setError(apiResponse.message || "Failed to load job details");
        toast.error(apiResponse.message || "Failed to load job details");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load job details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobId, markJobAsVisited]);

  useEffect(() => {
    // Reset refs when jobId changes
    hasFetched.current = false;
    hasMarkedVisited.current = false;

    if (params.id) {
      fetchJob();
    }

    return () => {
      hasFetched.current = false;
      hasMarkedVisited.current = false;
    };
  }, [params.id, fetchJob]);

  // Handle save/unsave
  const handleSaveJob = async (jobId: string, status: boolean) => {
    if (!isAuthenticated) {
      toast.error("Please login to save jobs");
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    await toggleSaveJob(jobId, status);
  };

  const handleApply = async (jobId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for jobs");
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!(user?.role == "seeker" || user?.role == "dev")) {
      toast.error("Only seekers can apply for jobs");
      return;
    }

    if (!isProfileComplete) {
      // Show toast with action buttons
      toast(
        (t) => (
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Profile Incomplete</p>
                <p className="text-sm text-muted-foreground">
                  Please complete your profile before applying for jobs
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.dismiss(t.id)}
                className="cursor-pointer"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push(
                    `/seeker/profile?redirect=${encodeURIComponent(pathname)}&type=job`,
                  );
                }}
                className="cursor-pointer bg-primary hover:bg-primary/90"
              >
                Go to Profile
              </Button>
            </div>
          </div>
        ),
        {
          duration: 10000, // 10 seconds
          position: "top-center",
          style: {
            padding: "16px",
            minWidth: "300px",
          },
        },
      );
      return;
    }

    await applyJob(jobId);
  };

  console.log("User is complete profile:", isProfileComplete);
  console.log("User isCompleteProfile:", user?.isProfileComplete);
  console.log("User role:", user?.role);

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

  if (error || !job) {
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
          <p className="text-muted-foreground">{error || "Job not found"}</p>
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

      <div className="px-4 md:px-16 pt-2 pb-16">
        <JobDetailsView
          job={job}
          isVisited={tempViseted}
          isSaved={isSaved}
          onSave={handleSaveJob}
          onApply={handleApply}
        />
      </div>
    </div>
  );
}
