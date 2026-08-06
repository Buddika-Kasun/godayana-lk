// src/components/company/courses/CourseForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Plus,
  Upload,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import Image from "next/image";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import courseEndpoints, {
  CourseRequest,
  CourseResponse,
  Curriculum,
} from "@/lib/api/endpoints/company/companyCourseEndpoints";

interface CourseFormProps {
  initialData?: CourseResponse | null;
  isEditing?: boolean;
  courseId?: string;
  setIsLoadingFun?: (loading: boolean) => void;
  onSuccess?: () => void;
}

export function CourseForm({
  initialData,
  isEditing,
  courseId,
  setIsLoadingFun,
  onSuccess,
}: CourseFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!isEditing && !initialData);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [enrollType, setEnrollType] = useState<"online" | "physical">(
    initialData?.enrollType || "online",
  );

  // State for expanding sections in curriculum
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  // Requirements state
  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [],
  );
  const [currentRequirement, setCurrentRequirement] = useState("");

  // Learning Outcomes state
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(
    initialData?.learningOutcomes || [],
  );
  const [currentLearningOutcome, setCurrentLearningOutcome] = useState("");

  // Includes state
  const [includes, setIncludes] = useState<string[]>(
    initialData?.includes || [],
  );
  const [currentInclude, setCurrentInclude] = useState("");

  // Target Audience state
  const [targetAudience, setTargetAudience] = useState<string[]>(
    initialData?.targetAudience || [],
  );
  const [currentTargetAudience, setCurrentTargetAudience] = useState("");

  // Curriculum state
  const [curriculum, setCurriculum] = useState<Curriculum>({
    modules: initialData?.curriculum?.modules || [],
  });
  const [currentModuleTitle, setCurrentModuleTitle] = useState("");
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");
  const [currentLessonDuration, setCurrentLessonDuration] = useState("");
  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(
    null,
  );
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  const [courseImageUrl, setCourseImageUrl] = useState<string>(
    initialData?.courseImageUrl || "",
  );
  const [courseImageFileKey, setCourseImageFileKey] = useState<string>(
    initialData?.courseImageFileKey || "",
  );
  const [isImageChanged, setIsImageChanged] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    categoryLabel: initialData?.categoryLabel || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    instructor: initialData?.instructor || "",
    instructorBio: initialData?.instructorBio || "",
    instructorAvatar: initialData?.instructorAvatar || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    duration: initialData?.duration || "",
    schedule: initialData?.schedule || "",
    price: initialData?.price?.toString() || "",
    // originalPrice: initialData?.originalPrice?.toString() || "",
    maxStudents: initialData?.maxStudents?.toString() || "",
    enrolledStudents: initialData?.enrolledStudents?.toString() || "",
    // views: initialData?.views?.toString() || "",
    rating: initialData?.rating?.toString() || "",
    // reviews: initialData?.reviews?.toString() || "",
    certificate: initialData?.certificate || false,
    certificateType: initialData?.certificateType || "",
    // company: initialData?.company || "",
    // companyDescription: initialData?.companyDescription || "",
    // companyLogo: initialData?.companyLogo || "",
    // companyWebsite: initialData?.companyWebsite || "",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    postedDate: initialData?.postedDate || "",
    lastUpdated: initialData?.lastUpdated || "",
    isEnrolled: initialData?.isEnrolled || false,
    isSaved: initialData?.isSaved || false,
    courseImageFileKey: initialData?.courseImageFileKey || "",
  });

  // Fetch course data if editing and no initialData provided
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isEditing || !courseId || initialData) return;

      // setIsFetching(true);
      setIsLoadingFun && setIsLoadingFun(true);

      try {
        const response = await courseEndpoints.getCompanyCourseById(courseId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const course = apiResponse.data;
          // Populate form with fetched data
          setFormData({
            title: course.title || "",
            category: course.category || "",
            categoryLabel: course.categoryLabel || "",
            description: course.description || "",
            location: course.location || "",
            instructor: course.instructor || "",
            instructorBio: course.instructorBio || "",
            instructorAvatar: course.instructorAvatar || "",
            startDate: course.startDate?.split("T")[0] || "",
            endDate: course.endDate?.split("T")[0] || "",
            duration: course.duration || "",
            schedule: course.schedule || "",
            price: course.price?.toString() || "",
            // originalPrice: course.originalPrice?.toString() || "",
            maxStudents: course.maxStudents?.toString() || "",
            enrolledStudents: course.enrolledStudents?.toString() || "",
            // views: course.views?.toString() || "",
            rating: course.rating?.toString() || "",
            // reviews: course.reviews?.toString() || "",
            certificate: course.certificate || false,
            certificateType: course.certificateType || "",
            // company: course.company || "",
            // companyDescription: course.companyDescription || "",
            // companyLogo: course.companyLogo || "",
            // companyWebsite: course.companyWebsite || "",
            contactEmail: course.contactEmail || "",
            contactPhone: course.contactPhone || "",
            postedDate: course.postedDate || "",
            lastUpdated: course.lastUpdated || "",
            isEnrolled: course.isEnrolled || false,
            isSaved: course.isSaved || false,
            courseImageFileKey: course.courseImageFileKey || "",
          });
          setEnrollType(course.enrollType || "online");
          setRequirements(course.requirements || []);
          setLearningOutcomes(course.learningOutcomes || []);
          setIncludes(course.includes || []);
          setTargetAudience(course.targetAudience || []);
          setCurriculum(course.curriculum || { modules: [] });
          setCourseImageUrl(course.courseImageUrl || "");
          setCourseImageFileKey(course.courseImageFileKey || "");
        } else {
          toast.error(apiResponse.message || "Failed to load course data");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details");
      } finally {
        // setIsFetching(false);
        setIsLoadingFun && setIsLoadingFun(false);
      }
    };

    fetchCourseData();
  }, [isEditing, courseId, initialData, setIsLoadingFun]);

  // Requirements handlers
  const handleAddRequirement = () => {
    if (
      currentRequirement.trim() &&
      !requirements.includes(currentRequirement.trim())
    ) {
      setRequirements([...requirements, currentRequirement.trim()]);
      setCurrentRequirement("");
    }
  };

  const handleRemoveRequirement = (requirement: string) => {
    setRequirements(requirements.filter((r) => r !== requirement));
  };

  const handleRequirementKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  // Learning Outcomes handlers
  const handleAddLearningOutcome = () => {
    if (
      currentLearningOutcome.trim() &&
      !learningOutcomes.includes(currentLearningOutcome.trim())
    ) {
      setLearningOutcomes([...learningOutcomes, currentLearningOutcome.trim()]);
      setCurrentLearningOutcome("");
    }
  };

  const handleRemoveLearningOutcome = (outcome: string) => {
    setLearningOutcomes(learningOutcomes.filter((o) => o !== outcome));
  };

  const handleLearningOutcomeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLearningOutcome();
    }
  };

  // Includes handlers
  const handleAddInclude = () => {
    if (currentInclude.trim() && !includes.includes(currentInclude.trim())) {
      setIncludes([...includes, currentInclude.trim()]);
      setCurrentInclude("");
    }
  };

  const handleRemoveInclude = (include: string) => {
    setIncludes(includes.filter((i) => i !== include));
  };

  const handleIncludeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInclude();
    }
  };

  // Target Audience handlers
  const handleAddTargetAudience = () => {
    if (
      currentTargetAudience.trim() &&
      !targetAudience.includes(currentTargetAudience.trim())
    ) {
      setTargetAudience([...targetAudience, currentTargetAudience.trim()]);
      setCurrentTargetAudience("");
    }
  };

  const handleRemoveTargetAudience = (audience: string) => {
    setTargetAudience(targetAudience.filter((a) => a !== audience));
  };

  const handleTargetAudienceKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTargetAudience();
    }
  };

  // Curriculum handlers
  const handleAddModule = () => {
    if (currentModuleTitle.trim()) {
      setCurriculum({
        modules: [
          ...curriculum.modules,
          { title: currentModuleTitle.trim(), lessons: [] },
        ],
      });
      setCurrentModuleTitle("");
    }
  };

  const handleRemoveModule = (index: number) => {
    setCurriculum({
      modules: curriculum.modules.filter((_, i) => i !== index),
    });
    setExpandedModules(expandedModules.filter((i) => i !== index));
  };

  const handleToggleModule = (index: number) => {
    setExpandedModules(
      expandedModules.includes(index)
        ? expandedModules.filter((i) => i !== index)
        : [...expandedModules, index],
    );
  };

  const handleAddLesson = (moduleIndex: number) => {
    if (currentLessonTitle.trim() && currentLessonDuration.trim()) {
      const updatedModules = [...curriculum.modules];
      updatedModules[moduleIndex].lessons.push({
        title: currentLessonTitle.trim(),
        duration: currentLessonDuration.trim(),
        isPreview: false,
      });
      setCurriculum({ modules: updatedModules });
      setCurrentLessonTitle("");
      setCurrentLessonDuration("");
      setIsAddingLesson(false);
      setSelectedModuleIndex(null);
    }
  };

  const handleRemoveLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...curriculum.modules];
    updatedModules[moduleIndex].lessons = updatedModules[
      moduleIndex
    ].lessons.filter((_, i) => i !== lessonIndex);
    setCurriculum({ modules: updatedModules });
  };

  const handleToggleLessonPreview = (
    moduleIndex: number,
    lessonIndex: number,
  ) => {
    const updatedModules = [...curriculum.modules];
    updatedModules[moduleIndex].lessons[lessonIndex].isPreview =
      !updatedModules[moduleIndex].lessons[lessonIndex].isPreview;
    setCurriculum({ modules: updatedModules });
  };

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
      const response = await courseEndpoints.uploadCourseImage(file);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const { fileKey, fileUrl } = apiResponse.data;
        setCourseImageUrl(fileUrl);
        setCourseImageFileKey(fileKey);
        setIsImageChanged(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(apiResponse.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setCourseImageUrl("");
    setCourseImageFileKey("");
    setIsImageChanged(true);
  };

  // Helper function to validate form
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error("Course title is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Course category is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Course description is required");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Start date is required");
      return false;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return false;
    }
    if (formData.endDate <= formData.startDate) {
      toast.error("End date must be after start date");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!formData.maxStudents || parseInt(formData.maxStudents) < 1) {
      toast.error("Maximum students must be at least 1");
      return false;
    }
    if (!formData.contactEmail.trim()) {
      toast.error("Contact email is required");
      return false;
    }
    if (!formData.instructor.trim()) {
      toast.error("Instructor name is required");
      return false;
    }
    if (enrollType === "physical" && !formData.location?.trim()) {
      toast.error("Location is required for physical courses");
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent,
    action: "publish" | "draft",
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let fileKeyToSend: string | undefined;
      if (isImageChanged) {
        fileKeyToSend = courseImageFileKey || undefined;
      } else {
        fileKeyToSend = formData.courseImageFileKey || undefined;
      }

      const requestData: CourseRequest = {
        title: formData.title,
        category: formData.category,
        categoryLabel: formData.categoryLabel,
        description: formData.description,
        enrollType: enrollType,
        location: formData.location || undefined,
        instructor: formData.instructor,
        instructorBio: formData.instructorBio || undefined,
        instructorAvatar: formData.instructorAvatar || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        duration: formData.duration || undefined,
        schedule: formData.schedule || undefined,
        price: parseFloat(formData.price),
        // originalPrice: formData.originalPrice
        //   ? parseFloat(formData.originalPrice)
        //   : undefined,
        maxStudents: parseInt(formData.maxStudents),
        enrolledStudents: formData.enrolledStudents
          ? parseInt(formData.enrolledStudents)
          : undefined,
        // views: formData.views ? parseInt(formData.views) : undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        // reviews: formData.reviews ? parseInt(formData.reviews) : undefined,
        curriculum: curriculum.modules.length > 0 ? curriculum : undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        learningOutcomes:
          learningOutcomes.length > 0 ? learningOutcomes : undefined,
        includes: includes.length > 0 ? includes : undefined,
        targetAudience: targetAudience.length > 0 ? targetAudience : undefined,
        certificate: formData.certificate,
        certificateType: formData.certificateType || undefined,
        // company: formData.company || undefined,
        // companyDescription: formData.companyDescription || undefined,
        // companyLogo: formData.companyLogo || undefined,
        // companyWebsite: formData.companyWebsite || undefined,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        postedDate: formData.postedDate
          ? new Date(formData.postedDate).toISOString()
          : undefined,
        lastUpdated: formData.lastUpdated
          ? new Date(formData.lastUpdated).toISOString()
          : undefined,
        isEnrolled: formData.isEnrolled,
        isSaved: formData.isSaved,
        courseImageFileKey: fileKeyToSend,
        status: action === "publish" ? "pending" : "draft",
      };

      let response;
      if (isEditing && courseId) {
        response = await courseEndpoints.updateCourse(courseId, requestData);
        toast.success("Course updated successfully!");
      } else {
        response = await courseEndpoints.createCourse(requestData);
        toast.success(
          action === "publish"
            ? "Course published successfully!"
            : "Course saved as draft",
        );
      }

      if (onSuccess) {
        onSuccess();
      }

      router.push("/company/courses");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save course. Please try again.";
      console.error("Error saving course:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // if (isFetching) {
  //   return <SubLoadingScreen message="Loading course details..." />;
  // }

  // Helper to get category label
  const getCategoryLabel = (value: string) => {
    const labels: Record<string, string> = {
      programming: "Programming & Development",
      design: "Design & Creative",
      business: "Business & Management",
      marketing: "Digital Marketing",
      data: "Data Science & AI",
      language: "Language Learning",
    };
    return labels[value] || value;
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, "publish")} className="space-y-8">
      {/* Course Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Course Type</h3>
        <RadioGroup
          value={enrollType}
          onValueChange={(value) =>
            setEnrollType(value as "online" | "physical")
          }
          className="flex gap-4 lg:gap-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online" className="cursor-pointer">
              Online Course
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical" id="physical" />
            <Label htmlFor="physical" className="cursor-pointer">
              Physical Course
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Basic Course Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Course Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-semibold text-primary"
            >
              Course Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Advanced Web Development Bootcamp"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="category"
              className="text-sm font-semibold text-primary"
            >
              Course Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  category: value,
                  categoryLabel: getCategoryLabel(value),
                });
              }}
            >
              <SelectTrigger className="mt-1.5 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="programming">
                  Programming & Development
                </SelectItem>
                <SelectItem value="design">Design & Creative</SelectItem>
                <SelectItem value="business">Business & Management</SelectItem>
                <SelectItem value="marketing">Digital Marketing</SelectItem>
                <SelectItem value="data">Data Science & AI</SelectItem>
                <SelectItem value="language">Language Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        {enrollType === "physical" && (
          <div>
            <Label
              htmlFor="location"
              className="text-sm font-semibold text-primary"
            >
              Course Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., 123 Main Street, Colombo 03, Sri Lanka"
              className="mt-1.5"
            />
          </div>
        )}

        {/* Instructor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="instructor"
              className="text-sm font-semibold text-primary"
            >
              Instructor Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) =>
                setFormData({ ...formData, instructor: e.target.value })
              }
              placeholder="e.g., Dr. Sanath Jayasuriya"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="instructorBio"
              className="text-sm font-semibold text-primary"
            >
              Instructor Bio
            </Label>
            <Textarea
              id="instructorBio"
              value={formData.instructorBio}
              onChange={(e) =>
                setFormData({ ...formData, instructorBio: e.target.value })
              }
              placeholder="Brief bio of the instructor..."
              rows={2}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Course Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-semibold text-primary">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-primary">
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="duration"
              className="text-sm font-semibold text-primary"
            >
              Duration
            </Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              placeholder="e.g., 8 weeks"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <Label
            htmlFor="schedule"
            className="text-sm font-semibold text-primary"
          >
            Schedule
          </Label>
          <Input
            id="schedule"
            value={formData.schedule}
            onChange={(e) =>
              setFormData({ ...formData, schedule: e.target.value })
            }
            placeholder="e.g., Monday & Wednesday, 6:00 PM - 8:00 PM"
            className="mt-1.5"
          />
        </div>

        {/* Price and Capacity */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label
              htmlFor="price"
              className="text-sm font-semibold text-primary"
            >
              Price (LKR) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="0.00"
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Set 0 for free courses
            </p>
          </div>

          {/* <div>
            <Label
              htmlFor="originalPrice"
              className="text-sm font-semibold text-primary"
            >
              Original Price
            </Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData({ ...formData, originalPrice: e.target.value })
              }
              placeholder="0.00"
              className="mt-1.5"
            />
          </div> */}

          <div>
            <Label
              htmlFor="maxStudents"
              className="text-sm font-semibold text-primary"
            >
              Max Students <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxStudents"
              type="number"
              min="1"
              value={formData.maxStudents}
              onChange={(e) =>
                setFormData({ ...formData, maxStudents: e.target.value })
              }
              placeholder="e.g., 60"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="enrolledStudents"
              className="text-sm font-semibold text-primary"
            >
              Enrolled Students
            </Label>
            <Input
              id="enrolledStudents"
              type="number"
              min="0"
              value={formData.enrolledStudents}
              onChange={(e) =>
                setFormData({ ...formData, enrolledStudents: e.target.value })
              }
              placeholder="e.g., 45"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Course Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div>
            <Label
              htmlFor="views"
              className="text-sm font-semibold text-primary"
            >
              Views
            </Label>
            <Input
              id="views"
              type="number"
              min="0"
              value={formData.views}
              onChange={(e) =>
                setFormData({ ...formData, views: e.target.value })
              }
              placeholder="e.g., 320"
              className="mt-1.5"
            />
          </div> */}

          <div>
            <Label
              htmlFor="rating"
              className="text-sm font-semibold text-primary"
            >
              Rating
            </Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              placeholder="e.g., 4.8"
              className="mt-1.5"
            />
          </div>

          {/* <div>
            <Label
              htmlFor="reviews"
              className="text-sm font-semibold text-primary"
            >
              Reviews Count
            </Label>
            <Input
              id="reviews"
              type="number"
              min="0"
              value={formData.reviews}
              onChange={(e) =>
                setFormData({ ...formData, reviews: e.target.value })
              }
              placeholder="e.g., 127"
              className="mt-1.5"
            />
            </div> */}
        </div>
      </div>

      {/* Course Description */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Course Description</h3>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-semibold text-primary"
          >
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe what students will learn, course structure, prerequisites..."
            rows={8}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Learning Outcomes</h3>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={currentLearningOutcome}
              onChange={(e) => setCurrentLearningOutcome(e.target.value)}
              onKeyDown={handleLearningOutcomeKeyDown}
              placeholder="Type a learning outcome and press Enter"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddLearningOutcome}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-lg p-3 space-y-1.5 min-h-[60px] bg-muted/5">
          {learningOutcomes.map((outcome) => (
            <div
              key={outcome}
              className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md"
            >
              <span className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">{outcome}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveLearningOutcome(outcome)}
                className="text-muted-foreground group-hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {learningOutcomes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No learning outcomes added
            </p>
          )}
        </div>
      </div>

      {/* Curriculum */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Curriculum</h3>

        {/* Add Module */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={currentModuleTitle}
              onChange={(e) => setCurrentModuleTitle(e.target.value)}
              placeholder="Module title (e.g., Modern JavaScript Deep Dive)"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddModule}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Modules List */}
        {curriculum.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-3 bg-muted/10 cursor-pointer hover:bg-muted/20"
              onClick={() => handleToggleModule(moduleIndex)}
            >
              <div className="flex items-center gap-2">
                {expandedModules.includes(moduleIndex) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{module.title}</span>
                <span className="text-xs text-muted-foreground">
                  ({module.lessons.length} lessons)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveModule(moduleIndex);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {expandedModules.includes(moduleIndex) && (
              <div className="p-3 space-y-3">
                {/* Lessons List */}
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex items-center justify-between p-2 bg-muted/5 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {lesson.duration}
                      </span>
                      {lesson.isPreview && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleLessonPreview(moduleIndex, lessonIndex)
                        }
                        className="text-xs"
                      >
                        {lesson.isPreview ? "Remove Preview" : "Make Preview"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveLesson(moduleIndex, lessonIndex)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Lesson */}
                {selectedModuleIndex === moduleIndex && isAddingLesson ? (
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={currentLessonTitle}
                        onChange={(e) => setCurrentLessonTitle(e.target.value)}
                        placeholder="Lesson title"
                        className="text-sm"
                      />
                      <Input
                        value={currentLessonDuration}
                        onChange={(e) =>
                          setCurrentLessonDuration(e.target.value)
                        }
                        placeholder="Duration (e.g., 2 hours)"
                        className="text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAddLesson(moduleIndex)}
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsAddingLesson(false);
                          setSelectedModuleIndex(null);
                          setCurrentLessonTitle("");
                          setCurrentLessonDuration("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedModuleIndex(moduleIndex);
                      setIsAddingLesson(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Lesson
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}

        {curriculum.modules.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No modules added yet
          </p>
        )}
      </div>

      {/* Requirements */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Prerequisites / Requirements</h3>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              onKeyDown={handleRequirementKeyDown}
              placeholder="Type a requirement and press Enter"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddRequirement}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-lg p-3 space-y-1.5 min-h-[60px] bg-muted/5">
          {requirements.map((req) => (
            <div
              key={req}
              className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md"
            >
              <span className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">{req}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveRequirement(req)}
                className="text-muted-foreground group-hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {requirements.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No requirements added
            </p>
          )}
        </div>
      </div>

      {/* What's Included */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">What&apos;s Included</h3>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={currentInclude}
              onChange={(e) => setCurrentInclude(e.target.value)}
              onKeyDown={handleIncludeKeyDown}
              placeholder="Type an inclusion and press Enter"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddInclude}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-lg p-3 space-y-1.5 min-h-[60px] bg-muted/5">
          {includes.map((include) => (
            <div
              key={include}
              className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md"
            >
              <span className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">{include}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveInclude(include)}
                className="text-muted-foreground group-hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {includes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No inclusions added
            </p>
          )}
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Target Audience</h3>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={currentTargetAudience}
              onChange={(e) => setCurrentTargetAudience(e.target.value)}
              onKeyDown={handleTargetAudienceKeyDown}
              placeholder="Type a target audience and press Enter"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddTargetAudience}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-lg p-3 space-y-1.5 min-h-[60px] bg-muted/5">
          {targetAudience.map((audience) => (
            <div
              key={audience}
              className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md"
            >
              <span className="flex items-center gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">{audience}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveTargetAudience(audience)}
                className="text-muted-foreground group-hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {targetAudience.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No target audience added
            </p>
          )}
        </div>
      </div>

      {/* Certificate */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Certificate</h3>

        <div className="flex items-center space-x-3">
          <Switch
            id="certificate"
            checked={formData.certificate}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, certificate: checked })
            }
          />
          <Label htmlFor="certificate" className="cursor-pointer">
            Course provides certificate
          </Label>
        </div>

        {formData.certificate && (
          <div>
            <Label
              htmlFor="certificateType"
              className="text-sm font-semibold text-primary"
            >
              Certificate Type
            </Label>
            <Input
              id="certificateType"
              value={formData.certificateType}
              onChange={(e) =>
                setFormData({ ...formData, certificateType: e.target.value })
              }
              placeholder="e.g., Professional Certificate in Advanced Web Development"
              className="mt-1.5"
            />
          </div>
        )}
      </div>

      {/* Company Information */}
      {/* <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Company Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="company"
              className="text-sm font-semibold text-primary"
            >
              Company Name
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g., Tech Academy Sri Lanka"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="companyWebsite"
              className="text-sm font-semibold text-primary"
            >
              Company Website
            </Label>
            <Input
              id="companyWebsite"
              value={formData.companyWebsite}
              onChange={(e) =>
                setFormData({ ...formData, companyWebsite: e.target.value })
              }
              placeholder="https://example.com"
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="companyDescription"
            className="text-sm font-semibold text-primary"
          >
            Company Description
          </Label>
          <Textarea
            id="companyDescription"
            value={formData.companyDescription}
            onChange={(e) =>
              setFormData({ ...formData, companyDescription: e.target.value })
            }
            placeholder="Brief description of the company..."
            rows={3}
            className="mt-1.5"
          />
        </div>
      </div> */}

      {/* Contact Information */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="contactEmail"
              className="text-sm font-semibold text-primary"
            >
              Contact Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              placeholder="courses@example.com"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label
              htmlFor="contactPhone"
              className="text-sm font-semibold text-primary"
            >
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) =>
                setFormData({ ...formData, contactPhone: e.target.value })
              }
              placeholder="+94 11 234 5678"
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Course Image */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Course Image</h3>

        <div>
          <Label className="text-sm font-semibold text-primary">
            Course Image (Optional)
          </Label>
          <div className="mt-2">
            {courseImageUrl ? (
              <div className="relative inline-block">
                <div className="relative w-50 h-70">
                  <Image
                    src={courseImageUrl}
                    alt={formData.title || "Course"}
                    fill
                    className="rounded-lg object-cover border"
                    unoptimized={!courseImageUrl.startsWith("http")}
                    sizes="(max-width: 200px) 100vw, 200px"
                    priority={false}
                    loading="lazy"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  disabled={isUploadingImage}
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
                        Click to upload or drag and drop
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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t justify-end">
        <Button
          type="submit"
          disabled={isLoading || isUploadingImage}
          className="flex-1 max-w-2xl cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Publishing..."}
            </>
          ) : (
            <>{isEditing ? "Save Changes" : "Publish Course"}</>
          )}
        </Button>
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            disabled={isLoading || isUploadingImage}
            className="flex-1 max-w-2xl cursor-pointer"
            onClick={(e) => handleSubmit(e, "draft")}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as Draft"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
