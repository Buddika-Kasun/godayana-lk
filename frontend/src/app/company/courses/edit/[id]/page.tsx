// src/app/company/courses/edit/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CourseForm } from "@/components/company/courses/CourseForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use, useState } from "react";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";

interface EditCoursePageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
    const { id } = use(params);
    const [isLoading, setIsLoading] = useState(true);
    // const [courseData, setCourseData] = useState<CourseData | null>(null);
  
    // useEffect(() => {
    //   const fetchCourse = async () => {
    //     try {
    //       const response = await courseEndpoints.getCompanyCourseById(id);
    //       const apiResponse = response.data;
  
    //       if (apiResponse.success && apiResponse.data) {
    //         const course = apiResponse.data;
    //         setCourseData({
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
    //         toast.error(apiResponse.message || "Failed to load course");
    //         router.push("/company/courses");
    //       }
    //     } catch (error) {
    //       console.error("Error fetching course:", error);
    //       toast.error("Failed to load course details");
    //       router.push("/company/courses");
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
  
    //   fetchCourse();
    // }, [id, router]);
  
    // if (isLoading) {
    //   return (
    //     <div className="relative">
    //       <SubLoadingScreen message="Loading course details..." />
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
        <h2 className="text-xl font-bold">Edit Course</h2>
      </div>

      <Card className="bg-primary/4 relative p-0">
        {isLoading && (
          <div className="absolute w-full backdrop-blur-xs h-full z-10 pt-60 md:pt-40">
            <SubLoadingScreen
              message="Loading course details..."
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
            <CourseForm
              initialData={null}
              isEditing={true}
              courseId={id}
              setIsLoadingFun={setIsLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
