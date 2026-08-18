// src/components/admin/content/StoryForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Plus,
  Upload,
  Loader2,
  User,
  MapPin,
  Calendar,
  Heart,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import adminContentEndpoints, {
  StoryRequest,
  StoryResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";

// Story type options
const storyTypeOptions = [
  { value: "Overseas Success", label: "Overseas Success" },
  { value: "Local Success", label: "Local Success" },
  { value: "Student Success", label: "Student Success" },
  { value: "Career Change", label: "Career Change" },
  { value: "Entrepreneurship", label: "Entrepreneurship" },
];

// Category options
const categoryOptions = [
  "Technology",
  "Healthcare",
  "Construction",
  "Marketing",
  "Finance",
  "Education",
  "Engineering",
  "Design",
  "Agriculture",
  "Hospitality",
  "Other",
];

interface StoryFormProps {
  initialData?: StoryResponse | null;
  isEditing?: boolean;
  storyId?: string;
  setIsLoadingFun?: (loading: boolean) => void;
}

export function StoryForm({
  initialData,
  isEditing,
  storyId,
  setIsLoadingFun,
}: StoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState<Partial<StoryResponse>>({
    id: initialData?.id,
    type: initialData?.type || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    author: initialData?.author || "",
    authorRole: initialData?.authorRole || "",
    authorLocation: initialData?.authorLocation || "",
    category: initialData?.category || "",
    likes: initialData?.likes || 0,
    imageUrl: initialData?.imageUrl || "",
    imageKey: initialData?.imageKey || "",
    avatarUrl: initialData?.avatarUrl || "",
    avatarKey: initialData?.avatarKey || "",
  });

  // Image states
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [imageKey, setImageKey] = useState<string>(initialData?.imageKey || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    initialData?.avatarUrl || "",
  );
  const [avatarKey, setAvatarKey] = useState<string>(
    initialData?.avatarKey || "",
  );
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  // Fetch story data if editing
  useEffect(() => {
    const fetchStoryData = async () => {
      if (!isEditing || !storyId || initialData) return;

      setIsLoadingFun && setIsLoadingFun(true);
      setIsLoading(true);

      try {
        const response =
          await adminContentEndpoints.story.getStoryById(storyId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const story = apiResponse.data;
          setFormData(story);
          setImageUrl(story.imageUrl || "");
          setImageKey(story.imageKey || "");
          setAvatarUrl(story.avatarUrl || "");
          setAvatarKey(story.avatarKey || "");
        } else {
          toast.error(apiResponse.message || "Failed to load story");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
        toast.error("Failed to load story details");
        router.push("/admin/content");
      } finally {
        setIsLoading(false);
        setIsLoadingFun && setIsLoadingFun(false);
      }
    };

    fetchStoryData();
  }, [isEditing, storyId, initialData, router, setIsLoadingFun]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await adminContentEndpoints.story.uploadImage(file);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const { fileKey, fileUrl } = apiResponse.data;
        setImageUrl(fileUrl);
        setImageKey(fileKey);
        setIsImageChanged(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(apiResponse.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar size should be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = await adminContentEndpoints.story.uploadAvatar(file);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const { fileKey, fileUrl } = apiResponse.data;
        setAvatarUrl(fileUrl);
        setAvatarKey(fileKey);
        setIsAvatarChanged(true);
        toast.success("Avatar uploaded successfully");
      } else {
        toast.error(apiResponse.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageKey("");
    setIsImageChanged(true);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    setAvatarKey("");
    setIsAvatarChanged(true);
  };

  const validateForm = (): boolean => {
    if (!formData.type) {
      toast.error("Story type is required");
      return false;
    }
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.author?.trim()) {
      toast.error("Author name is required");
      return false;
    }
    if (!formData.authorRole?.trim()) {
      toast.error("Author role is required");
      return false;
    }
    if (!formData.authorLocation?.trim()) {
      toast.error("Author location is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const requestData: StoryRequest = {
        type: formData.type!,
        title: formData.title!,
        description: formData.description!,
        author: formData.author!,
        authorRole: formData.authorRole!,
        authorLocation: formData.authorLocation!,
        category: formData.category!,
        imageKey: imageKey || "",
        avatarKey: avatarKey || "",
      };

      if (isEditing && storyId) {
        await adminContentEndpoints.story.updateStory(storyId, requestData);
        toast.success("Story updated successfully!");
      } else {
        await adminContentEndpoints.story.createStory(requestData);
        toast.success("Story created successfully!");
      }

      router.push("/admin/content");
    } catch (error) {
      console.error("Error saving story:", error);
      toast.error("Failed to save story");
    } finally {
      setIsLoading(false);
    }
  };

  // Get gradient color based on story type
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

  // Preview data
  const previewData = {
    type: formData.type || "Success Story",
    title: formData.title || "Your Story Title",
    description:
      formData.description || "Your story description will appear here...",
    author: formData.author || "Author Name",
    authorRole: formData.authorRole || "Role",
    authorLocation: formData.authorLocation || "Location",
    category: formData.category || "Category",
    likes: Math.floor(Math.random() * 100) + 10,
    imageUrl: imageUrl,
    avatarUrl: avatarUrl,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Form */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Story Type & Category */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Label className="text-sm font-semibold">
                Story Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select story type" />
                </SelectTrigger>
                <SelectContent>
                  {storyTypeOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-sm font-semibold">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label className="text-sm font-semibold">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter story title"
              className="mt-1.5"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-semibold">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the success story..."
              rows={4}
              className="mt-1.5"
              maxLength={160}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">
                {formData.description?.length || 0}/160
              </span>
            </div>
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-semibold">
                Author Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.author || ""}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="e.g., John Doe"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold">
                Author Role <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.authorRole || ""}
                onChange={(e) =>
                  setFormData({ ...formData, authorRole: e.target.value })
                }
                placeholder="e.g., Software Engineer"
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Author Location */}
          <div>
            <Label className="text-sm font-semibold">
              Author Location <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.authorLocation || ""}
              onChange={(e) =>
                setFormData({ ...formData, authorLocation: e.target.value })
              }
              placeholder="e.g., Colombo, Sri Lanka"
              className="mt-1.5"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-sm font-semibold">Story Image</Label>
            <div className="mt-2">
              {imageUrl ? (
                <div className="relative inline-block">
                  <div className="relative w-40 h-40">
                    <Image
                      src={imageUrl}
                      alt="Story image"
                      fill
                      className="rounded-lg object-cover border"
                      unoptimized={!imageUrl.startsWith("http")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-primary/5 ${
                    isUploadingImage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload story image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Avatar Upload */}
          <div>
            <Label className="text-sm font-semibold">Author Avatar</Label>
            <div className="mt-2">
              {avatarUrl ? (
                <div className="relative inline-block">
                  <div className="relative w-20 h-20">
                    <Image
                      src={avatarUrl}
                      alt="Author avatar"
                      fill
                      className="rounded-full object-cover border-2 border-primary"
                      unoptimized={!avatarUrl.startsWith("http")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-full cursor-pointer hover:bg-primary/5 ${
                    isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="w-6 h-6 mb-1 text-primary animate-spin" />
                        <p className="text-xs text-muted-foreground">
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <User className="w-8 h-8 mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">
                          Upload Avatar
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || isUploadingImage || isUploadingAvatar}
              className="flex-1 cursor-pointer hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update Story" : "Create Story"}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/content")}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Card */}
      <div className="lg:w-85 shrink-0">
        <div className="sticky top-24">
          <Label className="text-sm font-semibold block mb-3">
            Live Preview
          </Label>
          <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col py-0">
            {/* Story Header with Gradient */}
            <div
              className={`relative overflow-hidden ${
                previewData.imageUrl
                  ? "bg-gradient-to-r from-black/60 to-black/40"
                  : `bg-linear-to-r ${getGradientColor(previewData.type)}`
              } p-5 text-white min-h-30 flex flex-col justify-between`}
            >
              {/* Background Image */}
              {previewData.imageUrl && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={previewData.imageUrl}
                    alt="Story background"
                    fill
                    className="object-cover"
                    unoptimized={!previewData.imageUrl.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
                </div>
              )}

              {/* Content - z-index to appear above background */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <Badge className="bg-white/20 text-white border-0">
                    {previewData.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-white/10 text-white border-white/20"
                  >
                    {previewData.category}
                  </Badge>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between gap-3 mt-4">
                  <div className="flex-col min-w-0 flex-1">
                    <div className="pb-4">
                      <p className="font-bold text-lg truncate">
                        {previewData.author}
                      </p>
                      <p className="text-xs text-white/90 truncate">
                        {previewData.authorRole}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-md font-bold line-clamp-2">
                        {previewData.title}
                      </h5>
                    </div>
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-30 w-30 border-2 border-white/50 shrink-0">
                    <AvatarImage src={previewData.avatarUrl} />
                    <AvatarFallback className="bg-white/20 text-white text-2xl">
                      {getInitials(previewData.author)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <CardContent className="px-5 flex flex-col flex-1 pt-4">
              {/* Full Description */}
              <div className="min-h-20 max-h-20 overflow-y-auto mb-4 pr-1 scrollbar-thin">
                <p className="text-muted-foreground text-sm">
                  {previewData.description}
                </p>
              </div>

              {/* Location and Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 min-h-[20px]">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[120px]">
                    {previewData.authorLocation}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Calendar className="h-3 w-3" />
                  <span>Just now</span>
                </div>
              </div>

              {/* Like & Share Buttons */}
              <div className="flex items-center justify-between py-3 border-t mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span>{previewData.likes}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
