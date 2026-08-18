// src/app/seeker/enrollments/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { JobDetailsView } from "@/components/jobs/JobDetailsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CourseResponse } from "@/lib/api/endpoints/company/companyCourseEndpoints";
import { useVisitedCourses } from "@/lib/hooks/useVisitedCourses";
import { useAppliedCourses } from "@/lib/hooks/useAppliedCourses";
import { publicCourseAPI } from "@/lib/api/endpoints/public/publicCourseEndpoints";
import { CourseDetailsView } from "@/components/courses/CourseDetailsView";
import { useSavedCourses } from "@/lib/hooks/useSavedCourses";

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempViseted, setTempVisited] = useState<boolean>(false);
  const hasFetched = useRef(false);
  const hasMarkedVisited = useRef(false);

  const courseId = params.id?.toString() || "0";

  // Visited courses hook
  const { isCourseVisited, markCourseAsVisited } = useVisitedCourses();

  // Saved courses hook - DISABLE autoFetch to prevent duplicate API calls
  const { savedCourseIds, toggleSaveCourse } = useSavedCourses({
    courseId,
    autoFetch: false,
  });

  const { applyCourse } = useAppliedCourses();

  const isSaved = savedCourseIds.includes(courseId);

  useEffect(() => {
    setTempVisited(isCourseVisited(courseId) || isSaved);
  }, [isCourseVisited, courseId, isSaved]);

  const fetchCourse = useCallback(async () => {
    // Prevent duplicate fetches
    if (hasFetched.current) return;
    hasFetched.current = true;

    try {
      setLoading(true);
      setError(null);

      const response = await publicCourseAPI.getCourseById(courseId);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCourse(apiResponse.data);
        // Mark as visited only once
        if (!hasMarkedVisited.current) {
          hasMarkedVisited.current = true;
          markCourseAsVisited(courseId);
        }
      } else {
        setError(apiResponse.message || "Failed to load course details");
        toast.error(apiResponse.message || "Failed to load course details");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load job details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [courseId, markCourseAsVisited]);

  useEffect(() => {
    // Reset refs when courseId changes
    hasFetched.current = false;
    hasMarkedVisited.current = false;

    if (params.id) {
      fetchCourse();
    }

    return () => {
      hasFetched.current = false;
      hasMarkedVisited.current = false;
    };
  }, [params.id, fetchCourse]);

  // Handle save/unsave
  const handleSaveCourse = async (courseId: string, status: boolean) => {
    await toggleSaveCourse(courseId, status);
  };

  const handleEnroll = async (courseId: string) => {
    await applyCourse(courseId);
  };

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
          <h2 className="text-xl font-bold">View Course</h2>
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

  if (error || !course) {
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
          <h2 className="text-xl font-bold">View Course</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error || "Course not found"}</p>
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
        <h2 className="text-xl font-bold">View Course</h2>
      </div>

      <div className="bg-primary/4 rounded-4xl p-4 border border-primary/14">
        <CourseDetailsView
          course={course}
          isVisited={tempViseted}
          isSaved={isSaved}
          onSave={handleSaveCourse}
          onEnroll={handleEnroll}
        />
      </div>
    </div>
  );
}
