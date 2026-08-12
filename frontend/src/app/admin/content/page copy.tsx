// src/app/admin/content/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Globe,
  Briefcase,
  Clock,
  MapPin,
  FileText,
  X,
  Upload,
  Loader2,
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
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import Image from "next/image";

// Types
interface VisaGuide {
  id: string;
  country: string;
  otherCountry?: string;
  type: string;
  title: string;
  description: string;
  documents: string[];
  commonMistakes: string[];
  cost: string;
  processingTime: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mock data
const mockVisas: VisaGuide[] = [
  {
    id: "1",
    country: "United Kingdom",
    type: "STUDENT",
    title: "UK Student Visa Guide",
    description: "Complete guide for UK student visa application",
    documents: ["CAS Letter", "IELTS Results", "Bank Statement"],
    commonMistakes: ["Insufficient funds", "Gap in education"],
    cost: "£1,500 - £2,000",
    processingTime: "3 - 6 weeks",
    image: "",
  },
  {
    id: "2",
    country: "Australia",
    type: "WORK",
    title: "Australia Work Visa Guide",
    description: "Complete guide for Australia work visa application",
    documents: ["Job Offer", "Skills Assessment", "English Test"],
    commonMistakes: ["Wrong visa type", "Incomplete documents"],
    cost: "AUD 30,000 - 45,000",
    processingTime: "4 - 8 weeks",
    image: "",
  },
];

// Country options
const countryOptions = [
  "United Kingdom",
  "Australia",
  "Canada",
  "USA",
  "Germany",
  "Japan",
  "France",
  "Italy",
  "New Zealand",
  "Ireland",
  "Netherlands",
  "Sweden",
  "Other",
];

// Visa type options
const visaTypeOptions = [
  { value: "STUDENT", label: "Student Visa" },
  { value: "WORK", label: "Work Visa" },
  { value: "VISIT", label: "Visit Visa" },
];

// Processing time options
const processingTimeOptions = [
  "1 - 2 weeks",
  "2 - 4 weeks",
  "3 - 6 weeks",
  "4 - 8 weeks",
  "6 - 12 weeks",
  "8 - 16 weeks",
  "12 - 24 weeks",
];

const getStatusColor = (type: string) => {
  const colors: Record<string, string> = {
    STUDENT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    WORK: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    VISIT:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
};

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<"visas" | "countries" | "stories">(
    "visas",
  );
  const [visas, setVisas] = useState<VisaGuide[]>(mockVisas);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVisaId, setSelectedVisaId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<VisaGuide>>({
    country: "",
    otherCountry: "",
    type: "",
    title: "",
    description: "",
    documents: [],
    commonMistakes: [],
    cost: "",
    processingTime: "",
    image: "",
  });

  // Document and mistake input states
  const [currentDocument, setCurrentDocument] = useState("");
  const [currentMistake, setCurrentMistake] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch visas (mock for now)
  const fetchVisas = useCallback(async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // const response = await adminContentAPI.getVisas();
      // setVisas(response.data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setVisas(mockVisas);
    } catch (error) {
      console.error("Error fetching visas:", error);
      toast.error("Failed to load visas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "visas") {
      fetchVisas();
    }
  }, [activeTab, fetchVisas]);

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

    setIsUploadingImage(true);
    try {
      // Replace with actual upload API
      // const response = await adminContentAPI.uploadImage(file);
      // setFormData({ ...formData, image: response.data.url });
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: fakeUrl });
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.country) {
      toast.error("Country is required");
      return;
    }
    if (formData.country === "Other" && !formData.otherCountry) {
      toast.error("Please specify the country");
      return;
    }
    if (!formData.type) {
      toast.error("Visa type is required");
      return;
    }
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description) {
      toast.error("Description is required");
      return;
    }

    setIsLoading(true);
    try {
      const finalCountry =
        formData.country === "Other" ? formData.otherCountry : formData.country;

      const newVisa: VisaGuide = {
        id: isEditing ? formData.id! : Date.now().toString(),
        country: finalCountry || "",
        otherCountry: formData.otherCountry,
        type: formData.type || "",
        title: formData.title || "",
        description: formData.description || "",
        documents: formData.documents || [],
        commonMistakes: formData.commonMistakes || [],
        cost: formData.cost || "",
        processingTime: formData.processingTime || "",
        image: formData.image || "",
      };

      if (isEditing) {
        setVisas(visas.map((v) => (v.id === newVisa.id ? newVisa : v)));
        toast.success("Visa updated successfully");
      } else {
        setVisas([newVisa, ...visas]);
        toast.success("Visa created successfully");
      }

      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving visa:", error);
      toast.error("Failed to save visa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedVisaId) return;
    try {
      setVisas(visas.filter((v) => v.id !== selectedVisaId));
      toast.success("Visa deleted successfully");
      setShowDeleteDialog(false);
      setSelectedVisaId(null);
    } catch (error) {
      console.error("Error deleting visa:", error);
      toast.error("Failed to delete visa");
    }
  };

  const handleEdit = (visa: VisaGuide) => {
    setFormData(visa);
    setIsEditing(true);
    setShowCreateDialog(true);
  };

  const resetForm = () => {
    setFormData({
      country: "",
      otherCountry: "",
      type: "",
      title: "",
      description: "",
      documents: [],
      commonMistakes: [],
      cost: "",
      processingTime: "",
      image: "",
    });
    setIsEditing(false);
    setCurrentDocument("");
    setCurrentMistake("");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/4 min-h-[calc(100vh-7rem)] flex flex-col">
        <CardContent className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mt-1">
              Manage visa guides, country information, and success stories
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-3">
            <div className="bg-primary/10 p-1 rounded-lg w-full lg:w-fit flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setActiveTab("visas")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "visas"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Visas ({visas.length})
              </button>
              <button
                onClick={() => setActiveTab("countries")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "countries"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Countries
              </button>
              <button
                onClick={() => setActiveTab("stories")}
                className={`px-3 lg:px-4 py-1.5 text-sm rounded-md transition-all cursor-pointer font-semibold ${
                  activeTab === "stories"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-black dark:hover:text-white"
                }`}
              >
                Stories
              </button>
            </div>
            {activeTab === "visas" && (
              <Button
                onClick={() => {
                  resetForm();
                  setShowCreateDialog(true);
                }}
                className="gap-2 cursor-pointer w-full lg:w-auto"
              >
                <Plus size={16} />
                Create Visa
              </Button>
            )}
          </div>

          {/* Visa List */}
          {activeTab === "visas" && (
            <div className="flex-1 space-y-4">
              {isLoading ? (
                <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
                  <SubLoadingScreen
                    message="Loading visas..."
                    fullScreen={false}
                  />
                </div>
              ) : visas.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No visas created yet.</p>
                </div>
              ) : (
                visas.map((visa) => (
                  <div
                    key={visa.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">
                                {visa.title}
                              </h3>
                              <Badge className={getStatusColor(visa.type)}>
                                {visaTypeOptions.find(
                                  (t) => t.value === visa.type,
                                )?.label || visa.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Globe className="h-3 w-3 mr-1" />
                                {visa.country}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {visa.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText size={14} /> {visa.documents?.length || 0}{" "}
                            documents
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText size={14} />{" "}
                            {visa.commonMistakes?.length || 0} mistakes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {visa.processingTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} /> {visa.cost}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 cursor-pointer flex-1 lg:flex-none"
                          onClick={() => handleEdit(visa)}
                        >
                          <Edit size={14} />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1 cursor-pointer flex-1 lg:flex-none"
                          onClick={() => {
                            setSelectedVisaId(visa.id);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Countries Tab - Empty */}
          {activeTab === "countries" && (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Countries content coming soon...
              </p>
            </div>
          )}

          {/* Stories Tab - Empty */}
          {activeTab === "stories" && (
            <div className="flex-1 flex items-center justify-center py-12">
              <p className="text-muted-foreground">
                Stories content coming soon...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Visa" : "Create Visa"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Country */}
            <div>
              <Label className="text-sm font-semibold">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value })
                }
              >
                <SelectTrigger className="mt-1.5">
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
            <div>
              <Label className="text-sm font-semibold">
                Visa Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="mt-1.5">
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
                placeholder="e.g., UK Student Visa Guide"
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDocument();
                    }
                  }}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMistake();
                    }
                  }}
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

            {/* Cost */}
            <div>
              <Label className="text-sm font-semibold">Cost</Label>
              <Input
                value={formData.cost || ""}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                placeholder="e.g., £1,500 - £2,000"
                className="mt-1.5"
              />
            </div>

            {/* Processing Time */}
            <div>
              <Label className="text-sm font-semibold">Processing Time</Label>
              <Select
                value={formData.processingTime || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, processingTime: value })
                }
              >
                <SelectTrigger className="mt-1.5">
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

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-semibold">Image</Label>
              <div className="mt-2">
                {formData.image ? (
                  <div className="relative inline-block">
                    <div className="relative w-40 h-40">
                      <Image
                        src={formData.image}
                        alt="Visa guide"
                        fill
                        className="rounded-lg object-cover border"
                        unoptimized={!formData.image.startsWith("http")}
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
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Visa" : "Create Visa"}</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              visa guide.
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
