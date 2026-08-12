// src/components/admin/content/VisaForm.tsx
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
import { X, Plus, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import adminContentAPI, {
    adminContentEndpoints,
  VisaGuideRequest,
  VisaGuideResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";
import {
  countryOptions,
  processingTimeOptions,
  visaTypeOptions,
} from "@/types/visa";

interface VisaFormProps {
  initialData?: VisaGuideResponse | null;
  isEditing?: boolean;
  visaId?: string;
  setIsLoadingFun?: (loading: boolean) => void;
}

export function VisaForm({
  initialData,
  isEditing,
  visaId,
  setIsLoadingFun,
}: VisaFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState<Partial<VisaGuideResponse>>({
    id: initialData?.id,
    country: initialData?.country || "",
    otherCountry: initialData?.otherCountry || "",
    type: initialData?.type || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    documents: initialData?.documents || [],
    commonMistakes: initialData?.commonMistakes || [],
    cost: initialData?.cost || "",
    processingTime: initialData?.processingTime || "",
    imageUrl: initialData?.imageUrl || "",
    imageFileKey: initialData?.imageFileKey || "",
  });

  const [currentDocument, setCurrentDocument] = useState("");
  const [currentMistake, setCurrentMistake] = useState("");
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);

  const [descriptionImageUrl, setDescriptionImageUrl] = useState<string>(
    initialData?.imageUrl || "",
  );
  const [descriptionImageFileKey, setDescriptionImageFileKey] =
    useState<string>(initialData?.imageFileKey || "");
  const [isImageChanged, setIsImageChanged] = useState(false);

  // Auto-generate title when country or type changes
  useEffect(() => {
    // Don't auto-generate if:
    // - Title was manually edited by user
    // - No country selected
    // - No type selected
    // - It's editing mode (editing should use existing title)
    if (isTitleManuallyEdited || isEditing) return;

    const country = formData.country;
    const type = formData.type;

    if (!country || !type) return;

    // Get the actual country name (handle "Other" case)
    let countryName = country;
    if (country === "Other" && formData.otherCountry) {
      countryName = formData.otherCountry;
    }

    // Get visa type label
    const typeLabel =
      visaTypeOptions.find((t) => t.value === type)?.label || type;

    // Generate title: "Country Visa Type Guide"
    const generatedTitle = `${countryName} ${typeLabel} Guide`;
    setFormData((prev) => ({ ...prev, title: generatedTitle }));
  }, [
    formData.country,
    formData.type,
    formData.otherCountry,
    isTitleManuallyEdited,
    isEditing,
  ]);

  // Fetch visa data if editing
  useEffect(() => {
    const fetchVisaData = async () => {
      if (!isEditing || !visaId || initialData) return;

      setIsLoadingFun && setIsLoadingFun(true);

      setIsLoading(true);
      try {
        const response = await adminContentEndpoints.visa.getVisaById(visaId);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const visa = apiResponse.data;
          setFormData(visa);
          setDescriptionImageUrl(visa.imageUrl || "");
          setDescriptionImageFileKey(visa.imageFileKey || "");
        } else {
          toast.error(apiResponse.message || "Failed to load visa post data");
        }

      } catch (error) {
        console.error("Error fetching visa:", error);
        toast.error("Failed to load visa details");
        router.push("/admin/content");
      } finally {
        setIsLoading(false);
        setIsLoadingFun && setIsLoadingFun(false);
      }
    };

    fetchVisaData();
  }, [isEditing, visaId, initialData, router]);

  const handleAddDocument = () => {
    if (currentDocument.trim()) {
      setFormData({
        ...formData,
        documents: [...(formData.documents || []), currentDocument.trim()],
      });
      setCurrentDocument("");
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: (formData.documents || []).filter((_, i) => i !== index),
    });
  };

  const handleAddMistake = () => {
    if (currentMistake.trim()) {
      setFormData({
        ...formData,
        commonMistakes: [
          ...(formData.commonMistakes || []),
          currentMistake.trim(),
        ],
      });
      setCurrentMistake("");
    }
  };

  const handleRemoveMistake = (index: number) => {
    setFormData({
      ...formData,
      commonMistakes: (formData.commonMistakes || []).filter(
        (_, i) => i !== index,
      ),
    });
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

      const response = await adminContentEndpoints.visa.uploadImage(file);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        const { fileKey, fileUrl } = apiResponse.data;
        setDescriptionImageUrl(fileUrl);
        setDescriptionImageFileKey(fileKey);
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

  const handleRemoveImage = () => {
    setDescriptionImageUrl("");
    setDescriptionImageFileKey("");
    setIsImageChanged(true);
    toast.success("Image removed");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTitleManuallyEdited(true);
    setFormData({ ...formData, title: e.target.value });
  };

  const validateForm = (): boolean => {
    if (!formData.country) {
      toast.error("Country is required");
      return false;
    }
    if (formData.country === "Other" && !formData.otherCountry) {
      toast.error("Please specify the country");
      return false;
    }
    if (!formData.type) {
      toast.error("Visa type is required");
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const finalCountry =
        formData.country === "Other" ? formData.otherCountry : formData.country;

      let fileKeyToSend: string | undefined;

      if (isImageChanged) {
        fileKeyToSend = descriptionImageFileKey || undefined;
      } else {
        fileKeyToSend = formData.imageFileKey || undefined;
      }

      const requestData: VisaGuideRequest = {
        country: formData.country!,
        otherCountry: finalCountry,
        type: formData.type!,
        title: formData.title!,
        description: formData.description!,
        documents: formData.documents!,
        commonMistakes: formData.commonMistakes!,
        cost: formData.cost!,
        processingTime: formData.processingTime!,
        image: fileKeyToSend!,
      };

      if (isEditing && visaId) {
        await adminContentEndpoints.visa.updateVisa(visaId, requestData);
      } else {
        await adminContentEndpoints.visa.createVisa(requestData);
      }

      toast.success(
        isEditing ? "Visa updated successfully!" : "Visa created successfully!",
      );

      router.push("/admin/content");
    } catch (error) {
      console.error("Error saving visa:", error);
      toast.error("Failed to save visa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    handler: () => void,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handler();
    }
  };

  //   if (isLoading) {
  //     return (
  //       <div className="flex items-center justify-center min-h-[400px]">
  //         <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //       </div>
  //     );
  //   }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-6">
        {/* Country */}
        <div className="flex-1">
          <Label className="text-sm font-semibold">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) => {
              setFormData({ ...formData, country: value });
              // Reset otherCountry if not "Other"
              if (value !== "Other") {
                setFormData((prev) => ({ ...prev, otherCountry: "" }));
              }
            }}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countryOptions.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden md:block flex-1">
          <Label className="text-sm font-semibold">
            Visa Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Select visa type" />
            </SelectTrigger>
            <SelectContent>
              {visaTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Other Country Input */}
      {formData.country === "Other" && (
        <div>
          <Label className="text-sm font-semibold">
            Other Country <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData.otherCountry || ""}
            onChange={(e) =>
              setFormData({ ...formData, otherCountry: e.target.value })
            }
            placeholder="Enter country name"
            className="mt-1.5"
          />
        </div>
      )}

      {/* Visa Type */}
      <div className="md:hidden">
        <Label className="text-sm font-semibold">
          Visa Type <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger className="mt-1.5 w-full">
            <SelectValue placeholder="Select visa type" />
          </SelectTrigger>
          <SelectContent>
            {visaTypeOptions.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title - Read Only / Auto-generated */}
      <div>
        <Label className="text-sm font-semibold">
          Title
          {/* <span className="text-red-500">*</span> */}
        </Label>
        <div className="relative">
          <Input
            value={formData.title || ""}
            onChange={handleTitleChange}
            placeholder="Auto-generated from country and type"
            className="mt-1.5 pr-20"
            // readOnly={true}
            disabled
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            Auto
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Title is auto-generated based on country and visa type
        </p>
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
          placeholder="Describe the visa guide..."
          rows={3}
          className="mt-1.5"
        />
      </div>

      {/* Documents */}
      <div>
        <Label className="text-sm font-semibold">Documents</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={currentDocument}
            onChange={(e) => setCurrentDocument(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddDocument)}
            placeholder="Type a document and press Enter"
          />
          <Button
            type="button"
            onClick={handleAddDocument}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 border rounded-lg p-2 space-y-1 min-h-[40px]">
          {formData.documents?.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md"
            >
              <span className="flex items-center gap-2 text-sm">
                <span className="text-primary">•</span>
                {doc}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveDocument(index)}
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {formData.documents?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-1">
              No documents added
            </p>
          )}
        </div>
      </div>

      {/* Common Mistakes */}
      <div>
        <Label className="text-sm font-semibold">Common Mistakes</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            value={currentMistake}
            onChange={(e) => setCurrentMistake(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleAddMistake)}
            placeholder="Type a mistake and press Enter"
          />
          <Button
            type="button"
            onClick={handleAddMistake}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 border rounded-lg p-2 space-y-1 min-h-[40px]">
          {formData.commonMistakes?.map((mistake, index) => (
            <div
              key={index}
              className="flex items-center justify-between group hover:bg-muted/50 px-2 py-1 rounded-md"
            >
              <span className="flex items-center gap-2 text-sm">
                <span className="text-red-500">•</span>
                {mistake}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveMistake(index)}
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {formData.commonMistakes?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-1">
              No mistakes added
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Cost */}
        <div className="flex-1">
          <Label className="text-sm font-semibold">Cost</Label>
          <Input
            value={formData.cost || ""}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="e.g., £1,500 - £2,000"
            className="mt-1.5"
          />
        </div>

        {/* Processing Time */}
        <div className="flex-1">
          <Label className="text-sm font-semibold">Processing Time</Label>
          <Select
            value={formData.processingTime || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, processingTime: value })
            }
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Select processing time" />
            </SelectTrigger>
            <SelectContent>
              {processingTimeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <Label className="text-sm font-semibold">Image</Label>
        <div className="mt-2">
          {descriptionImageUrl ? (
            <div className="relative inline-block">
              <div className="relative w-40 h-40">
                <Image
                  src={descriptionImageUrl}
                  alt="Visa guide"
                  fill
                  className="rounded-lg object-cover border"
                  unoptimized={!descriptionImageUrl.startsWith("http")}
                  //   sizes="(max-width: 200px) 100vw, 200px"
                  priority={false}
                  loading="lazy"
                  onError={() => {
                    console.error("Failed to load image:", descriptionImageUrl);
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully");
                  }}
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
                      Click to upload image
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

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading || isUploadingImage}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEditing ? "Update Visa Post" : "Create Visa Post"}</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/content")}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
