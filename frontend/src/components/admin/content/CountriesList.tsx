// src/components/admin/content/CountriesList.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Globe,
  DollarSign,
  Briefcase,
  Clock,
  Calendar,
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
  CountryResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";
import { formatDate } from "@/lib/utils/dateUtils";

const visaTypeOptions = [
  { value: "STUDENT", label: "Student Visa" },
  { value: "WORK", label: "Work Visa" },
  { value: "VISIT", label: "Visit Visa" },
  { value: "SSW", label: "Specified Skilled Worker (SSW)" },
  { value: "BUSINESS", label: "Business Visa" },
  { value: "FAMILY", label: "Family Visa" },
  { value: "OTHER", label: "Other" },
];

const getVisaTypeLabel = (value: string) => {
  const found = visaTypeOptions.find((v) => v.value === value);
  return found?.label || value;
};

interface CountriesListProps {
  onCountChange?: () => void;
}

export function CountriesList({ onCountChange }: CountriesListProps) {
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const fetchCountries = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const params: PostParams = {
          page: page - 1,
          size: itemsPerPage,
        };

        const response =
          await adminContentEndpoints.country.getCountries(params);
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          setCountries(apiResponse.data.content || []);
          setTotalItems(apiResponse.data.totalElements || 0);
          setTotalPages(apiResponse.data.totalPages || 0);
        } else {
          toast.error(apiResponse.message || "Failed to load countries");
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  useEffect(() => {
    fetchCountries(currentPage);
  }, [fetchCountries, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!selectedCountryId) return;
    try {
      await adminContentEndpoints.country.deleteCountry(selectedCountryId);
      toast.success("Country deleted successfully");
      setShowDeleteDialog(false);
      setSelectedCountryId(null);
    } catch (error) {
      console.error("Error deleting country:", error);
      toast.error("Failed to delete country");
    } finally {
      onCountChange && onCountChange();
      fetchCountries(currentPage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-100 md:min-h-70 flex flex-col justify-center">
        <SubLoadingScreen message="Loading countries..." fullScreen={false} />
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No countries created yet.</p>
        <Link href="/admin/content/countries/create">
          <Button className="mt-4 gap-2">Create First Country Post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between flex-1">
      <div className="flex-1 space-y-4">
        {countries.map((country) => (
          <div
            key={country.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{country.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        {country.visaType
                          ? getVisaTypeLabel(country.visaType)
                          : "N/A"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {country.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} /> {country.salary || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} />{" "}
                    {country.visaType
                      ? getVisaTypeLabel(country.visaType)
                      : "N/A"}
                  </span>
                  {country.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-muted-foreground" />
                      {formatDate(country.createdAt!)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <Link href={`/admin/content/countries/${country.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 cursor-pointer flex-1 lg:flex-none"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/content/countries/edit/${country.id}`}>
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
                    setSelectedCountryId(country.id);
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
            {countries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            countries
          </div>
        </div>
      )}

      {totalPages <= 1 && totalItems > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
          Showing all {totalItems} countries
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              country guide.
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
