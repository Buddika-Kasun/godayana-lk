// src/app/(public)/courses/[id]/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CourseDetailsView } from "@/components/courses/CourseDetailsView";
import { CourseResponse } from "@/lib/api/endpoints/company/companyCourseEndpoints";
import publicCourseEndpoints from "@/lib/api/endpoints/public/publicCourseEndpoints";
import { useVisitedCourses } from "@/lib/hooks/useVisitedCourses";
import { useSavedCourses } from "@/lib/hooks/useSavedCourses";
import { useAppliedCourses } from "@/lib/hooks/useAppliedCourses";

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

  // Visited jobs hook
  const { isCourseVisited, markCourseAsVisited } = useVisitedCourses();

  // Saved jobs hook - DISABLE autoFetch to prevent duplicate API calls
  const { savedCourseIds, toggleSaveCourse } = useSavedCourses({
    courseId,
    autoFetch: false,
  });

  const { isCourseApplied, applyCourse } = useAppliedCourses();

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

      const isVisited =
        isCourseVisited(courseId) ||
        isCourseApplied(courseId) ||
        false;

      const response = await publicCourseEndpoints.getCourseById(courseId, {
        isVisited,
      });
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setCourse(apiResponse.data);

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
        error instanceof Error
          ? error.message
          : "Failed to load course details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [courseId, markCourseAsVisited]);

  useEffect(() => {
    // Reset refs when jobId changes
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

  if (error || !course) {
    return (
      <div className="space-y-2">
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
