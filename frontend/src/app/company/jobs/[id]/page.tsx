// src/app/company/jobs/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { JobDetailsView } from "@/components/jobs/JobDetailsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import companyJobEndpoints, { JobResponse } from "@/lib/api/endpoints/company/companyJobEndpoints";
import toast from "react-hot-toast";

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const jobId = params.id?.toString() || "0";
        const response = await companyJobEndpoints.getCompanyJobById(jobId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setJob(apiResponse.data);
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
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-2">
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
          <h2 className="text-xl font-bold">View Job Post</h2>
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
      <div className="space-y-2">
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
          <h2 className="text-xl font-bold">View Job Post</h2>
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
    <div className="space-y-2">
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
        <h2 className="text-xl font-bold">View Job Post</h2>
      </div>

      <div className="bg-primary/4 rounded-4xl p-4 border border-primary/14">
        <JobDetailsView job={job} hideButtons={true} />
      </div>
    </div>
  );
}
