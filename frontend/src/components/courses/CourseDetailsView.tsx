// src/components/company/courses/CourseDetailsView.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  Building2,
  Eye,
  Users,
  CheckCircle,
  ExternalLink,
  DollarSign,
  Award,
  Video,
  FileText,
  Globe,
  Mail,
  Phone,
  Star,
  MessageSquare,
  Send,
  User,
  Tag,
  GraduationCap,
  Briefcase,
  Plane,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  CourseResponse,
  ReviewResponse,
} from "@/lib/api/endpoints/company/companyCourseEndpoints";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatDate, formatPostedDate } from "@/lib/utils/dateUtils";
import courseEndpoints from "@/lib/api/endpoints/company/companyCourseEndpoints";
import {
  formatCourseCategory,
  formatCourseLevel,
  formatMigrationPath,
  formatMigrationPaths,
  formatRequirementLevel,
  getMigrationPathColor,
} from "@/lib/utils/courseUtils";
import { useAppliedCourses } from "@/lib/hooks/useAppliedCourses";
import { useSavedCourses } from "@/lib/hooks/useSavedCourses";

interface CourseDetailsViewProps {
  course: CourseResponse;
  isVisited?: boolean;
  isSaved?: boolean;
  hideButtons?: boolean;
  onEnroll?: (courseId: string) => void;
  onSave?: (courseId: string, status: boolean) => void;
  onShare?: () => void;
}

export function CourseDetailsView({
  course,
  isVisited,
  isSaved: initialIsSaved,
  hideButtons = false,
  onEnroll,
  onSave,
  onShare,
}: CourseDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const { savedCourseIds, toggleSaveCourse, isToggling } = useSavedCourses();
  // Determine if course is saved from Redux state or prop
  const isCourseSaved = initialIsSaved ?? savedCourseIds.includes(course.id);
  const [saved, setSaved] = useState(isCourseSaved);

  const { appliedCourseIds, applyCourse, isApplying } = useAppliedCourses();
  const isApplied = appliedCourseIds.includes(course.id);

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, [course.id]);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const response = await courseEndpoints.reviews.getReviewsByCourse(
        course.id,
      );
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setReviews(apiResponse.data.content || []);
        // Calculate average rating
        const allReviews = apiResponse.data.content || [];
        if (allReviews.length > 0) {
          const total = allReviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          );
          setAverageRating(total / allReviews.length);
          setTotalReviews(allReviews.length);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const formatDateStart = (dateString?: string) => {
    if (!dateString) return "Not specified";
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

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes === 0) return "Just now";
        if (diffMinutes === 1) return "1 minute ago";
        return `${diffMinutes} minutes ago`;
      }
      if (diffHours === 1) return "1 hour ago";
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      if (weeks === 1) return "1 week ago";
      return `${weeks} weeks ago`;
    }
    if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      if (months === 1) return "1 month ago";
      return `${months} months ago`;
    }
    const years = Math.floor(diffDays / 365);
    if (years === 1) return "1 year ago";
    return `${years} years ago`;
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return "Free";
    return `LKR ${price.toLocaleString()}`;
  };

  const formatLocation = (location?: string) => {
    if (!location) return "N/A";
    const parts = location.split(",").map((part) => part.trim());
    const lastTwo = parts.slice(-2);
    return lastTwo.join(", ");
  };

  const getEnrollTypeConfig = (type?: "online" | "physical") => {
    if (!type)
      return {
        label: "Online",
        icon: <Globe className="h-4 w-4" />,
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      };
    return {
      online: {
        label: "Online Course",
        icon: <Globe className="h-4 w-4" />,
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      physical: {
        label: "Physical Course",
        icon: <MapPin className="h-4 w-4" />,
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      },
    }[type];
  };

  const handleSave = async () => {
    const newStatus = !saved;
    setSaved(newStatus);

    if (onSave) {
      onSave(course.id, saved);
    }
  };

  // const handleShare = () => {
  //   if (onShare) {
  //     onShare();
  //   } else {
  //     navigator.clipboard.writeText(window.location.href);
  //     toast.success("Link copied to clipboard");
  //   }
  // };
  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Get the base URL without any path
      const origin = window.location.origin;
      // Always return the public courses path
      const publicUrl =  `${origin}/courses/${course.id}`;

      // Implement share functionality
      if (navigator.share) {
        navigator.share({
          title: course.title + ` (${course.companyName}) ` + " - Godayana.lk",
          text: "Godayana.lk",
          url: publicUrl,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(publicUrl);
        toast.success("Link copied to clipboard");
      }
    }
  };

  const handleEnroll = () => {
    if (onEnroll) {
      onEnroll(course.id);
    } else {
      toast.success("Successfully enrolled in the course!");
    }
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!userReview.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await courseEndpoints.reviews.createReview({
        courseId: course.id,
        rating: userRating,
        comment: userReview.trim(),
      });

      const apiResponse = response.data;
      if (apiResponse.success) {
        toast.success("Review submitted successfully!");
        fetchReviews(); // Refresh reviews after submission
        setUserRating(0);
        setUserReview("");
      } else {
        toast.error(apiResponse.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const enrollTypeConfig = getEnrollTypeConfig(course.enrollType);
  const isFull = (course.enrolledStudents || 0) >= (course.maxStudents || 0);

  // Build requirements array
  const requirements = [
    course.requirements && course.requirements.length > 0 && "Requirements:",
    ...(course.requirements || []).map((req) => `  • ${req}`),
    course.learningOutcomes &&
      course.learningOutcomes.length > 0 &&
      "Learning Outcomes:",
    ...(course.learningOutcomes || []).map((outcome) => `  • ${outcome}`),
  ].filter(Boolean) as string[];

  const benefitsList = course.benefits || [];

  // Get migration paths
  const migrationPaths = course.migrationPaths || [];
  const hasMigrationPaths = migrationPaths.length > 0;

  let flag = "Viewed";
  if (saved) {
    flag = "Saved";
  }
  if (isApplied) {
    flag = "Enrolled";
  }

  const isDisabled = isFull || isApplied || hideButtons;

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Visited badge */}
          {isVisited && (
            <div className="absolute top-0 left-0 rounded-br-full px-4 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 font-semibold text-xs">
              {flag}
            </div>
          )}
          <Badge variant="secondary" className="bg-white/20 text-white">
            {formatCourseCategory(course.category)}
          </Badge>
          <Badge className={enrollTypeConfig.color}>
            <span className="flex items-center gap-1">
              {enrollTypeConfig.icon}
              {enrollTypeConfig.label}
            </span>
          </Badge>
          {course.certificate && (
            <Badge variant="secondary" className="bg-white/20 text-white gap-1">
              <Award className="h-3 w-3" />
              Certificate Included
            </Badge>
          )}
          {course.rating && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              Level {formatCourseLevel(course.rating)}
            </Badge>
          )}
          {course.requirementLevel && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              <GraduationCap className="h-3 w-3 mr-1" />
              {formatRequirementLevel(course.requirementLevel)}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-lg opacity-90 mt-2">
          By {course.instructor || "Instructor"} •{" "}
          {course.company?.companyName || course.companyName || "Company"}
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> Starts: {formatDateStart(course.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> Posted: {formatDate(course.createdAt)}
          </span>
          {averageRating > 0 && (
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          )}
        </div>
        {/* Migration Paths in Hero */}
        {hasMigrationPaths && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/20">
            <span className="text-sm opacity-80 flex items-center gap-1">
              <Plane className="h-4 w-4" />
              Destinations:
            </span>
            {migrationPaths.map((path) => (
              <Badge
                key={path}
                variant="secondary"
                className="bg-white/20 text-white"
              >
                {formatMigrationPath(path)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:pr-10">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* Mobile Sticky Bar */}
          <div className="md:hidden block sticky top-14">
            <div className="bg-card rounded-xl shadow-xl border py-2 mb-4">
              <div className="px-4 py-2 space-y-3">
                <Button
                  onClick={handleEnroll}
                  disabled={isDisabled}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold"
                  size="lg"
                >
                  {isFull
                    ? "Course Full"
                    : isApplied
                      ? "ALREADY ENROLLED"
                      : "ENROLL NOW"}
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    className="flex-1 gap-2"
                  >
                    {saved ? (
                      <BookmarkCheck size={16} className="text-primary" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                    {saved ? "Saved" : "Save Course"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`cursor-pointer pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("curriculum")}
                className={`cursor-pointer pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "curriculum"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Instructor & Curriculum
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`cursor-pointer pb-3 px-1 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Reviews ({totalReviews})
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Course Details Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Migration Paths */}
                {hasMigrationPaths && (
                  <div className="bg-card rounded-xl p-4 shadow-sm border">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Plane className="h-4 w-4 text-primary" />
                      Migration Destinations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {migrationPaths.map((path) => (
                        <Badge
                          key={path}
                          className={getMigrationPathColor(path)}
                        >
                          {formatMigrationPath(path)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirement Level */}
                {course.requirementLevel && (
                  <div className="bg-card rounded-xl p-4 shadow-sm border">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Requirement Level
                    </h3>
                    <Badge variant="outline" className="text-sm">
                      {formatRequirementLevel(course.requirementLevel)}
                    </Badge>
                  </div>
                )}

                {/* Course Level */}
                {course.rating && (
                  <div className="bg-card rounded-xl p-4 shadow-sm border">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      Course Level
                    </h3>
                    <Badge variant="outline" className="text-sm">
                      {formatCourseLevel(course.rating)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="rounded-xl px-6 py-2">
                <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                  Course Description
                </h2>
                <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {course.description || "No description provided."}
                </div>
              </div>

              {/* Benefits */}
              {benefitsList.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    What You&apos;ll Learn / Benefits
                  </h2>
                  <ul className="space-y-3">
                    {benefitsList.map((benefit, i) => (
                      <li key={i} className="flex gap-3">
                        <CheckCircle
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    Requirements & Learning Outcomes
                  </h2>
                  <ul className="space-y-3">
                    {requirements.map((item, i) => {
                      if (item.startsWith("  • ")) {
                        return (
                          <li key={i} className="flex gap-3 pl-6">
                            <CheckCircle
                              size={18}
                              className="text-primary mt-0.5 shrink-0"
                            />
                            <span className="text-muted-foreground">
                              {item.replace("  • ", "")}
                            </span>
                          </li>
                        );
                      }
                      if (
                        item === "Requirements:" ||
                        item === "Learning Outcomes:"
                      ) {
                        return (
                          <li
                            key={i}
                            className="flex gap-3 font-semibold text-primary pt-2"
                          >
                            <span>{item}</span>
                          </li>
                        );
                      }
                      return (
                        <li key={i} className="flex gap-3">
                          <CheckCircle
                            size={18}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Includes */}
              {course.includes && course.includes.length > 0 && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    This Course Includes
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.includes.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <CheckCircle
                          size={18}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule for Physical Courses */}
              {course.enrollType === "physical" && course.schedule && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    Class Schedule
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        {formatDateStart(course.startDate)} -{" "}
                        {formatDateStart(course.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{course.schedule}</span>
                    </div>
                    {course.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{formatLocation(course.location)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Course Image */}
              {course.courseImageUrl && (
                <div className="bg-card rounded-xl p-6 shadow-sm border">
                  <h2 className="text-xl font-bold mb-4 uppercase text-primary">
                    Course Image
                  </h2>
                  <div className="relative w-full">
                    <Image
                      src={course.courseImageUrl}
                      alt="Course image"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full h-auto rounded-lg object-contain"
                      unoptimized={!course.courseImageUrl.startsWith("http")}
                      onError={() => {
                        console.error(
                          "Failed to load course image:",
                          course.courseImageUrl,
                        );
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === "curriculum" && (
            <>
              <Card>
                <CardContent className="px-6 py-2">
                  <div className="flex gap-4">
                    {course.instructorAvatar ? (
                      <Image
                        src={course.instructorAvatar}
                        alt={course.instructor || "Instructor"}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {course.instructor || "Instructor"}
                      </h3>
                      {course.instructorBio && (
                        <p className="text-muted-foreground mt-2">
                          {course.instructorBio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {course.curriculum?.modules &&
                course.curriculum.modules.length > 0 ? (
                  course.curriculum.modules.map((module, moduleIdx) => (
                    <Card key={moduleIdx}>
                      <CardContent className="px-4">
                        <h3 className="font-semibold mb-3">
                          Module {moduleIdx + 1}: {module.title}
                        </h3>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIdx) => (
                            <div
                              key={lessonIdx}
                              className="flex items-center justify-between p-2 hover:bg-muted rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isPreview ? (
                                  <Video className="h-4 w-4 text-primary" />
                                ) : (
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">
                                  {lesson.duration}
                                </span>
                                {lesson.isPreview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No curriculum available for this course.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Add Review */}
              <Card>
                <CardContent className="px-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare size={18} />
                    Write a Review
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Rating</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={
                                star <= userRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"
                              }
                            />
                          </button>
                        ))}
                        {userRating > 0 && (
                          <span className="text-sm text-muted-foreground ml-2">
                            {userRating}/5
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review" className="text-sm font-medium">
                        Your Review
                      </Label>
                      <Textarea
                        id="review"
                        value={userReview}
                        onChange={(e) => setUserReview(e.target.value)}
                        placeholder="Share your experience with this course..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={
                        isSubmittingReview ||
                        userRating === 0 ||
                        !userReview.trim()
                      }
                      className="gap-2"
                    >
                      {isSubmittingReview ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Submit Review
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className="space-y-4">
                {isLoadingReviews ? (
                  <div className="text-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Loading reviews...
                    </p>
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={review.userAvatar}
                            alt={review.userName}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {review.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="font-semibold">{review.userName}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={14}
                                    className={
                                      star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to review this course!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 hidden md:block md:-top-50 relative">
          {/* Desktop Sticky Actions */}
          <div className="md:sticky md:top-22 z-12 pb-2">
            <div className="flex w-full gap-3 justify-between items-center px-2">
              <Button
                onClick={handleEnroll}
                disabled={isDisabled}
                className="px-6 bg-primary hover:bg-primary/80 cursor-pointer text-white font-semibold"
                size="lg"
              >
                {isFull
                  ? "Course Full"
                  : isApplied
                    ? "ALREADY ENROLLED"
                    : "ENROLL NOW"}
              </Button>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  onClick={handleSave}
                  disabled={hideButtons}
                  className="text-white h-8 w-8 cursor-pointer bg-primary rounded-full"
                >
                  {saved ? (
                    <BookmarkCheck size={16} className="text-white" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleShare}
                  className="text-white h-8 w-8 cursor-pointer bg-primary rounded-full"
                >
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Course Card */}
          <div className="bg-card shadow-xl rounded-t-xl overflow-visible relative top-20 pb-22 border">
            <div className="px-6 py-2 space-y-4">
              <div className="w-30 h-30 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-xl absolute -top-10 shadow-xl z-10">
                {course.company?.logoUrl ? (
                  <Image
                    src={course.company.logoUrl}
                    alt={course.company?.companyName || "Company"}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover w-full h-full"
                  />
                ) : (
                  (course.title || "C").charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>

          <div className="bg-card border-l border-r border-b rounded-b-md relative md:sticky md:top-20 z-1 pt-12 pb-2">
            <div className="px-6 pt-2 space-y-4">
              <div className="pb-2 border-b">
                <h3 className="font-bold text-lg">{course.title}</h3>
                <Badge className="mb-2">
                  {formatCourseLevel(course.rating)}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {course.instructor || "Instructor"} •{" "}
                  {course.company?.companyName ||
                    course.companyName ||
                    "Company"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card relative shadow-xl overflow-visible border-l border-r border-b rounded-b-md">
            <div className="px-6 pb-2 pt-4 space-y-4">
              {/* Price */}
              <div className="text-center py-2 border-b">
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(course.price)}
                </p>
              </div>

              {/* Quick Info */}
              <div className="text-sm space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>Starts: {formatDateStart(course.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>{course.duration || "Not specified"}</span>
                </div>
                {course.enrollType === "physical" && course.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    <span>{formatLocation(course.location)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-primary" />
                  <span>{enrollTypeConfig.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-primary" />
                  <span>{formatCourseCategory(course.category)}</span>
                </div>
                {course.rating && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" />
                    <span>Level: {formatCourseLevel(course.rating)}</span>
                  </div>
                )}
                {course.requirementLevel && (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-primary" />
                    <span>
                      Req: {formatRequirementLevel(course.requirementLevel)}
                    </span>
                  </div>
                )}
              </div>

              {/* Migration Paths in Sidebar */}
              {hasMigrationPaths && (
                <div className="border-t pt-3">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Plane size={14} className="text-primary" />
                    Destinations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {migrationPaths.map((path) => (
                      <Badge key={path} variant="outline" className="text-xs">
                        {formatMigrationPath(path)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 py-2 border-t">
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Users size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">
                    {course.enrolledStudents || 0}/{course.maxStudents || "∞"}
                  </p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
                <div className="text-center p-2 bg-muted/30 rounded-lg">
                  <Eye size={16} className="mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{course.viewCount || 0}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>

              {/* Instructor Info in Sidebar */}
              <div className="border-t pt-3">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  Instructor
                </h4>
                <div className="flex items-center gap-3 pb-2">
                  {course.instructorAvatar ? (
                    <Image
                      src={course.instructorAvatar}
                      alt={course.instructor || "Instructor"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {course.instructor || "Instructor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Info Card */}
          <Card className="rounded-xl shadow-sm my-8">
            <CardContent className="px-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Course Provider
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {course.company?.companyName ||
                      course.companyName ||
                      "Company"}
                  </p>
                </div>
                {course.company?.description && (
                  <p className="text-xs text-muted-foreground">
                    {course.company.description.substring(0, 100)}...
                  </p>
                )}
                {course.company?.website && (
                  <Link
                    href={course.company.website}
                    target="_blank"
                    className="flex items-center gap-1 text-primary hover:underline text-xs"
                  >
                    Visit Website <ExternalLink size={12} />
                  </Link>
                )}
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-xs">
                    <Mail size={12} className="text-primary" />
                    <span>
                      {course.contactEmail || course.confirmationEmail || "N/A"}
                    </span>
                  </div>
                  {course.contactPhone && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <Phone size={12} className="text-primary" />
                      <span>{course.contactPhone}</span>
                    </div>
                  )}
                  {course.company?.location && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <MapPin size={12} className="text-primary" />
                      <span>{formatLocation(course.company.location)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Info */}
          {course.certificate && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                Certificate of Completion
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                {course.certificateType || "Professional Certificate"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
