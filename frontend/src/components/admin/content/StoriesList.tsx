// src/components/admin/content/StoriesList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  User,
  MapPin,
  Calendar,
  Heart,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import adminContentEndpoints, {
  PostParams,
  StoryResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";

// Story type options for display
const storyTypeOptions = [
  { value: "Overseas Success", label: "Overseas Success" },
  { value: "Local Success", label: "Local Success" },
  { value: "Student Success", label: "Student Success" },
  { value: "Career Change", label: "Career Change" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
];

const getStoryTypeLabel = (type: string) => {
  const found = storyTypeOptions.find((t) => t.value === type);
  return found?.label || type;
};

const getGradientColor = (type?: string) => {
  if (!type) return "from-blue-500 to-blue-700";
  const colors: Record<string, string> = {
    "Overseas Success": "from-blue-500 to-blue-700",
    "Local Success": "from-green-500 to-green-700",
    "Student Success": "from-purple-500 to-purple-700",
    "Career Change": "from-orange-500 to-orange-700",
    Entrepreneurship: "from-amber-500 to-amber-700",
  };
  return colors[type] || "from-blue-500 to-blue-700";
};

const getInitials = (name: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface StoriesListProps {
  onCountChange?: () => void;
}

export function StoriesList({ onCountChange }: StoriesListProps) {
  const [stories, setStories] = useState<StoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryResponse | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const fetchStories = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params: PostParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        const response = await adminContentEndpoints.story.getStories(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setStories(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load stories");
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast.error("Failed to load stories");
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  useEffect(() => {
    fetchStories(currentPage);
  }, [fetchStories, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (story: StoryResponse) => {
    setSelectedStory(story);
    setShowViewDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedStoryId) return;
    try {
      await adminContentEndpoints.story.deleteStory(selectedStoryId);
      toast.success("Story deleted successfully");
      setShowDeleteDialog(false);
      setSelectedStoryId(null);
      onCountChange && onCountChange();
      fetchStories(currentPage);
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  // const formatDate = (dateString?: string) => {
  //   if (!dateString) return "N/A";
  //   try {
  //     return new Date(dateString).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     });
  //   } catch {
  //     return dateString;
  //   }
  // };

  if (isLoading) {
    return (
      <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
        <SubLoadingScreen message="Loading stories..." fullScreen={false} />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No stories created yet.</p>
        <Link href="/admin/content/stories/create">
          <Button className="mt-4 gap-2">Create First Story</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between flex-1">
      <div className="flex-1 space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{story.title}</h3>
                      <Badge className={getGradientColor(story.type)}>
                        {getStoryTypeLabel(story.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {story.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User size={14} /> {story.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {story.authorLocation}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={14} /> {story.likes || 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {formatDate(story.createdAt!)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 cursor-pointer flex-1 lg:flex-none"
                  onClick={() => handleView(story)}
                >
                  <Eye size={14} />
                  View
                </Button>
                <Link href={`/admin/content/stories/edit/${story.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer flex-1 lg:flex-none"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 cursor-pointer flex-1 lg:flex-none"
                  onClick={() => {
                    setSelectedStoryId(story.id);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              Previous
            </Button>

            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer w-10"
                      >
                        {page}
                      </Button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2">
                        ...
                      </span>
                    );
                  }
                  return null;
                },
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Showing{" "}
            {stories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            stories
          </div>
        </div>
      )}

      {totalPages <= 1 && totalItems > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
          Showing all {totalItems} stories
        </div>
      )}

      {/* View Story Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Story Details</DialogTitle>
          </DialogHeader>
          {selectedStory && (
            <div className="space-y-6">
              {/* Story Header with Image */}
              <div
                className={`relative overflow-hidden p-5 text-white min-h-40 flex flex-col justify-between rounded-lg ${
                  selectedStory.imageUrl
                    ? ""
                    : `bg-linear-to-r ${getGradientColor(selectedStory.type)}`
                }`}
              >
                {/* Background Image */}
                {selectedStory.imageUrl && (
                  <>
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={selectedStory.imageUrl}
                        alt="Story background"
                        fill
                        className="object-cover"
                        unoptimized={!selectedStory.imageUrl.startsWith("http")}
                      />
                    </div>
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
                  </>
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      {getStoryTypeLabel(selectedStory.type)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                    >
                      {selectedStory.category}
                    </Badge>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <div className="flex-col min-w-0 flex-1">
                      <div className="pb-4">
                        <p className="font-bold text-lg truncate drop-shadow-md">
                          {selectedStory.author}
                        </p>
                        <p className="text-xs text-white/90 truncate drop-shadow-md">
                          {selectedStory.authorRole}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-xl font-bold line-clamp-2 drop-shadow-md">
                          {selectedStory.title}
                        </h5>
                      </div>
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-30 w-30 border-2 border-white/50 shrink-0 shadow-lg">
                      <AvatarImage src={selectedStory.avatarUrl} />
                      <AvatarFallback className="bg-white/20 text-white text-2xl backdrop-blur-sm">
                        {getInitials(selectedStory.author)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {selectedStory.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Author</p>
                  <p className="font-medium flex items-center gap-2">
                    <User size={14} className="text-muted-foreground" />
                    {selectedStory.author}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedStory.authorRole}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    {selectedStory.authorLocation}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <Badge variant="outline">{selectedStory.category}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p className="font-medium flex items-center gap-2">
                    <Heart size={14} className="text-red-500" />
                    {selectedStory.likes || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    {formatDate(selectedStory.createdAt!)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Link
                  href={`/admin/content/stories/edit/${selectedStory.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Edit size={16} />
                    Edit Story
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={() => {
                    setShowViewDialog(false);
                    setSelectedStoryId(selectedStory.id);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 size={16} />
                  Delete Story
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              story.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
