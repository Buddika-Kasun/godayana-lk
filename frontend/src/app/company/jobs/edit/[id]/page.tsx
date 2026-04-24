// src/app/company/jobs/edit/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { JobForm } from "@/components/company/jobs/JobForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data fetch - replace with API call
const getJobData = (id: number) => {
  return {
    id,
    jobTitle: "Senior Software Engineer",
    category: "it",
    location: "colombo",
    type: "local" as "local" | "overseas",
    skills: ["JavaScript", "React", "Node.js"],
    salaryMin: "250000",
    salaryMax: "350000",
    salaryNegotiable: false,
    educationLevel: "bachelors",
    minExperience: "3",
    employmentType: "full-time",
    fieldOfStudy: "Computer Science",
    minAge: "25",
    maxAge: "40",
    jobDescription:
      "We are looking for a Senior Software Engineer to join our team. You will be responsible for building and maintaining web applications.",
    workingHours: "9:00 AM - 5:00 PM",
    benefits: "Health insurance, Performance bonus, Flexible working hours",
    applicationDeadline: "2024-12-31",
    confirmationEmail: "hr@techcorp.com",
    descriptionImage: "",
    cvDeliveryOption: "direct",
  };
};

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = parseInt(params.id as string);
  const jobData = getJobData(jobId);

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

      <Card className="bg-primary/4">
        <CardContent className="px-6 pb-6">
          <JobForm initialData={jobData} isEditing />
        </CardContent>
      </Card>
    </div>
  );
}
