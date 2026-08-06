"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { JobData, JobForm } from "@/components/company/jobs/JobForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import toast from "react-hot-toast";
import companyJobEndpoints from "@/lib/api/endpoints/company/companyJobEndpoints";

interface EditJobPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  // const [jobData, setJobData] = useState<JobData | null>(null);

  // useEffect(() => {
  //   const fetchJob = async () => {
  //     try {
  //       const response = await jobEndpoints.getCompanyJobById(id);
  //       const apiResponse = response.data;

  //       if (apiResponse.success && apiResponse.data) {
  //         const job = apiResponse.data;
  //         setJobData({
  //           id: job.id,
  //           jobTitle: job.jobTitle,
  //           category: job.category,
  //           location: job.location,
  //           salaryMin: job.salaryMin?.toString(),
  //           salaryMax: job.salaryMax?.toString(),
  //           salaryNegotiable: job.salaryNegotiable,
  //           educationLevel: job.educationLevel,
  //           minExperience: job.minExperience,
  //           employmentType: job.employmentType,
  //           fieldOfStudy: job.fieldOfStudy,
  //           minAge: job.minAge?.toString(),
  //           maxAge: job.maxAge?.toString(),
  //           jobDescription: job.jobDescription,
  //           // workingHours: job.workingHours,
  //           startTime: job.startTime,
  //           endTime: job.endTime,
  //           benefits: job.benefits,
  //           applicationDeadline: job.applicationDeadline?.split("T")[0],
  //           confirmationEmail: job.confirmationEmail,
  //           type: job.type,
  //           skills: job.skills || [],
  //           descriptionImageFileKey: job.descriptionImageFileKey,
  //           descriptionImageUrl: job.descriptionImageUrl,
  //           cvDeliveryOption: job.cvDeliveryOption || "direct",
  //           matchingCriteria: job.matchingCriteria || {
  //             skills: true,
  //             experience: false,
  //             education: false,
  //             location: false,
  //           },
  //         });
  //       } else {
  //         toast.error(apiResponse.message || "Failed to load job");
  //         router.push("/company/jobs");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching job:", error);
  //       toast.error("Failed to load job details");
  //       router.push("/company/jobs");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchJob();
  // }, [id, router]);

  // if (isLoading) {
  //   return (
  //     <div className="relative">
  //       <SubLoadingScreen message="Loading job details..." />
  //     </div>
  //   );
  // }

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
        <h2 className="text-xl font-bold">Edit Job</h2>
      </div>

      <Card className="bg-primary/4 relative p-0">
        {isLoading && (
          <div className="absolute w-full backdrop-blur-xs h-full z-10 pt-60 md:pt-40">
            <SubLoadingScreen
              message="Loading job details..."
              fullScreen={false}
            />
          </div>
        )}
        <CardContent className="px-6 py-6">
          <div className="relative min-h-60">
            {/* {
              isLoading ? (
                <SubLoadingScreen message="Loading job details..." />
              ) : (
                <JobForm initialData={jobData} isEditing={true} jobId={id} />
              )
            } */}
            <JobForm
              initialData={null}
              isEditing={true}
              jobId={id}
              setIsLoadingFun={setIsLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
