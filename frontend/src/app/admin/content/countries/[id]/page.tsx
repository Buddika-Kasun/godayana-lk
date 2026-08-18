// src/app/admin/content/visas/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Globe,
  Clock,
  Briefcase,
  FileText,
  Edit,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { SubLoadingScreen } from "@/components/ui/SubLoadingScreen";
import { SquareAvatar } from "@/components/ui/SquareAvatar";
import adminContentEndpoints, {
  VisaGuideResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";

const visaTypeOptions = [
  { value: "STUDENT", label: "Student Visa" },
  { value: "WORK", label: "Work Visa" },
  { value: "VISIT", label: "Visit Visa" },
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

interface ViewVisaPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewVisaPage({ params }: ViewVisaPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [visa, setVisa] = useState<VisaGuideResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisa = async () => {
      setIsLoading(true);
      try {
        const response = await adminContentEndpoints.visa.getVisaById(id);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setVisa(apiResponse.data);
        } else {
          toast.error(apiResponse.message || "Failed to load visa details");
        }
      } catch (error) {
        console.error("Error fetching visa:", error);
        toast.error("Failed to load visa details");
        router.push("/admin/content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisa();
  }, [id, router]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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
        <h2 className="text-xl font-bold">Visa Details</h2>
      </div>

      <Card className="bg-primary/4 p-0">
        <CardContent className="px-6 py-6">
          {isLoading ? (
            <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
              <SubLoadingScreen
                message="Loading visa details..."
                fullScreen={false}
              />
            </div>
          ) : !visa ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Visa not found</p>
              <Link href="/admin/content">
                <Button className="mt-4">Back to Content</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header with Image */}
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold truncate">
                          {visa.title}
                        </h1>
                        <Badge className={getStatusColor(visa.type)}>
                          {visaTypeOptions.find((t) => t.value === visa.type)
                            ?.label || visa.type}
                        </Badge>
                        <Badge variant="outline" className="whitespace-nowrap">
                          <Globe className="h-3 w-3 mr-1" />
                          {visa.country}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/content/visas/edit/${visa.id}`}>
                        <Button variant="outline" className="gap-2">
                          <Edit size={16} />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                {/* Image */}
                <div className="">
                  <SquareAvatar
                    src={visa.imageUrl}
                    alt={visa.title || "Visa"}
                    fallback={visa.title ? visa.title.charAt(0) : "V"}
                    size={180}
                  />
                </div>
                <p className="text-muted-foreground">
                  {visa.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-muted-foreground">
                    Cost
                  </h3>
                  <p className="text-base font-medium flex items-center gap-2">
                    <Briefcase size={16} className="text-muted-foreground" />
                    {visa.cost || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-muted-foreground">
                    Processing Time
                  </h3>
                  <p className="text-base font-medium flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    {visa.processingTime || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-muted-foreground">
                    Created At
                  </h3>
                  <p className="text-base font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    {formatDate(visa.createdAt)}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  Required Documents
                </h3>
                {visa.documents?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {visa.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No documents listed
                  </p>
                )}
              </div>

              {/* Common Mistakes */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  Common Mistakes to Avoid
                </h3>
                {visa.commonMistakes?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {visa.commonMistakes.map((mistake, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30"
                      >
                        <span className="text-red-500 font-bold">•</span>
                        <span className="text-sm">{mistake}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No common mistakes listed
                  </p>
                )}
              </div>

              {/* Additional Info */}
              {(visa.updatedAt || visa.createdAt) && (
                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                    {visa.createdAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Created: {formatDate(visa.createdAt)}
                      </span>
                    )}
                    {visa.updatedAt && visa.updatedAt !== visa.createdAt && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Last Updated: {formatDate(visa.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
