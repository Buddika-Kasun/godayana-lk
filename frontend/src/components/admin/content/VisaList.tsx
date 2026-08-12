// src/components/admin/content/VisaList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Globe,
  FileText,
  Clock,
  Briefcase,
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
import adminContentEndpoints, {
  PostParams,
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

interface VisaListProps {
  onCountChange?: () => void;
}

export function VisaList({ onCountChange }: VisaListProps) {
  const [visas, setVisas] = useState<VisaGuideResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVisaId, setSelectedVisaId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const fetchVisas = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: PostParams = {
        page: page - 1,
        size: itemsPerPage,
      };

      const response = await adminContentEndpoints.visa.getVisas(params);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setVisas(apiResponse.data.content);
        setTotalItems(apiResponse.data.totalElements);
        setTotalPages(apiResponse.data.totalPages);
      } else {
        toast.error(apiResponse.message || "Failed to load jobs");
      }
    } catch (error) {
      console.error("Error fetching visas:", error);
      toast.error("Failed to load visas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisas(currentPage);
  }, [fetchVisas]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!selectedVisaId) return;
    try {
      await adminContentEndpoints.visa.deleteVisa(selectedVisaId);
      toast.success("Visa deleted successfully");
      setShowDeleteDialog(false);
      setSelectedVisaId(null);
    } catch (error) {
      console.error("Error deleting visa:", error);
      toast.error("Failed to delete visa");
    } finally {
      onCountChange && onCountChange();
      fetchVisas(currentPage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
        <SubLoadingScreen message="Loading visas..." fullScreen={false} />
      </div>
    );
  }

  if (visas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No visas created yet.</p>
        <Link href="/admin/content/visas/create">
          <Button className="mt-4 gap-2">Create First Visa Post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between flex-1">
      <div className="flex-1 space-y-4">
        {visas.map((visa) => (
          <div
            key={visa.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{visa.title}</h3>
                      <Badge className={getStatusColor(visa.type)}>
                        {visaTypeOptions.find((t) => t.value === visa.type)
                          ?.label || visa.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        {visa.country}
                      </Badge>
                    </div>
                    {/* <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {visa.description}
                    </p> */}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText size={14} /> {visa.documents?.length || 0}{" "}
                    documents
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText size={14} /> {visa.commonMistakes?.length || 0}{" "}
                    mistakes
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
                <Link href={`/admin/content/visas/${visa.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer flex-1 lg:flex-none"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/content/visas/edit/${visa.id}`}>
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
            {visas.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            jobs
          </div>
        </div>
      )}

      {totalPages <= 1 && totalItems > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
          Showing all {totalItems} jobs
        </div>
      )}

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
