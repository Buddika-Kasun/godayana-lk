"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  User,
  Heart,
  Share2,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import contentEndpoints from "@/lib/api/endpoints/public/publicContentEndpoints";
import { StoryResponse } from "@/lib/api/endpoints/admin/adminContentEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 1, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Skeleton Card Component
function StorySkeleton() {
  return (
    <Card className="h-full overflow-hidden flex flex-col py-0">
      <div className="bg-muted p-5 min-h-30 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="flex-col min-w-0 flex-1">
            <div className="pb-4">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4 mt-1" />
            </div>
          </div>
          <Skeleton className="h-30 w-30 rounded-full shrink-0" />
        </div>
      </div>
      <CardContent className="px-5 flex flex-col flex-1 pt-4">
        <div className="min-h-20 max-h-20 overflow-y-auto mb-4 pr-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-1" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 min-h-[20px]">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center justify-between py-3 border-t mt-auto">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [likedStories, setLikedStories] = useState<string[]>([]);
  const [isLiking, setIsLiking] = useState(false);
  const pageSize = 6;

  // Fetch stories with pagination
  const fetchStories = useCallback(
    async (page: number = 0, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await contentEndpoints.story.getStories({
          page: page,
          size: pageSize,
        });
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const content = apiResponse.data.content || [];
          const totalPagesData = apiResponse.data.totalPages || 0;
          const totalElements = apiResponse.data.totalElements || 0;

          if (append) {
            setStories((prev) => [...prev, ...content]);
          } else {
            setStories(content);
          }

          setTotalPages(totalPagesData);
          setTotalItems(totalElements);
          setHasMore(page < totalPagesData - 1);
          setCurrentPage(page);
        } else {
          toast.error(apiResponse.message || "Failed to load stories");
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast.error("Failed to load stories");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize],
  );

  // Initial load
  useEffect(() => {
    fetchStories(0, false);
  }, [fetchStories]);

  // Load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchStories(currentPage + 1, true);
    }
  };

  const handleLike = async (storyId: string) => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const isLiked = likedStories.includes(storyId);

      if (isLiked) {
        await contentEndpoints.story.unlikeStory(storyId);
        setLikedStories((prev) => prev.filter((id) => id !== storyId));
        setStories((prev) =>
          prev.map((story) =>
            story.id === storyId
              ? { ...story, likes: Math.max((story.likes || 0) - 1, 0) }
              : story,
          ),
        );
      } else {
        await contentEndpoints.story.likeStory(storyId);
        setLikedStories((prev) => [...prev, storyId]);
        setStories((prev) =>
          prev.map((story) =>
            story.id === storyId
              ? { ...story, likes: (story.likes || 0) + 1 }
              : story,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async (story: StoryResponse) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: story.title,
          text: story.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error);
        toast.error("Failed to share");
      }
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <StorySkeleton key={`skeleton-${index}`} />
    ));
  };

  // Get initials from author name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get gradient color based on story type
  const getGradientColor = (type?: string) => {
    if (!type) return "from-blue-500 to-blue-700";
    const colors: Record<string, string> = {
      "Overseas Success": "from-blue-500 to-blue-700",
      "Local Success": "from-green-500 to-green-700",
      "Student Success": "from-purple-500 to-purple-700",
      "Career Change": "from-orange-500 to-orange-700",
    };
    return colors[type] || "from-blue-500 to-blue-700";
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 px-4 sm:px-6 lg:px-8 border-b relative bg-linear-to-b from-blue-400 via-blue-700 to-blue-900 rounded-b-lg text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90 ">
          <span className="font-fm-gamunu text-[40px] md:text-5xl">ගොඩයන </span>
          <span className="text-background/90"> Stories</span>
        </h1>
        <p className="text-background/80 relative">
          Real experiences from job seekers who found their dream careers.
        </p>
      </motion.div>

      {/* Stories Grid */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {renderSkeletons()}
          </motion.div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg">
              No stories available
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Check back later for new success stories
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
            >
              {stories.map((story) => (
                <motion.div
                  key={story.id}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col py-0">
                    {/* Story Header with Gradient */}
                    <div
                      className={`relative overflow-hidden p-5 text-white min-h-30 flex flex-col justify-between ${
                        story.imageUrl
                          ? ""
                          : `bg-linear-to-r ${getGradientColor(story.type)}`
                      }`}
                    >
                      {/* Background Image */}
                      {story.imageUrl && (
                        <>
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={story.imageUrl}
                              alt="Story background"
                              fill
                              className="object-cover"
                              unoptimized={!story.imageUrl.startsWith("http")}
                            />
                          </div>
                          <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
                        </>
                      )}

                      {/* Content - z-index to appear above background */}
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between">
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {story.type || "Success Story"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                          >
                            {story.category || "General"}
                          </Badge>
                        </div>
                        {/* Author Info */}
                        <div className="flex items-center justify-between gap-3 mt-4">
                          <div className="flex-col min-w-0 flex-1">
                            <div className="pb-4">
                              <p className="font-bold text-lg truncate drop-shadow-md">
                                {story.author || "Anonymous"}
                              </p>
                              <p className="text-xs text-white/90 truncate drop-shadow-md">
                                {story.authorRole || "Professional"}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-md font-bold line-clamp-2 drop-shadow-md">
                                {story.title}
                              </h5>
                            </div>
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-30 w-30 border-2 border-white/50 shrink-0 shadow-lg">
                            <AvatarImage src={story.avatarUrl} />
                            <AvatarFallback className="bg-white/20 text-white text-2xl backdrop-blur-sm">
                              {getInitials(story.author || "User")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>

                    <CardContent className="px-5 flex flex-col flex-1">
                      {/* Full Description */}
                      <div className="min-h-20 max-h-20 overflow-y-auto mb-4 pr-1 scrollbar-thin">
                        <p className="text-muted-foreground text-sm">
                          {story.description}
                        </p>
                      </div>

                      {/* Location and Date */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 min-h-[20px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[120px]">
                            {story.authorLocation || "Location"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(story.createdAt!)}</span>
                        </div>
                      </div>

                      {/* Like & Share Buttons */}
                      <div className="flex items-center justify-between py-3 border-t mt-auto">
                        <div className="flex items-center gap-4">
                          <motion.button
                            onClick={() => handleLike(story.id)}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLiking}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                likedStories.includes(story.id)
                                  ? "fill-red-500 text-red-500"
                                  : ""
                              }`}
                            />
                            <span>{story.likes || 0}</span>
                          </motion.button>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <motion.button
                            onClick={() => handleShare(story)}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Share2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="gap-2 min-w-[200px]"
                  variant="outline"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Show More
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Total items count */}
            {totalItems > 0 && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                Showing {stories.length} of {totalItems} success stories
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
