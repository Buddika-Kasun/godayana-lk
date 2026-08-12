"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  BookOpen,
  Briefcase,
  Plane,
  ArrowRight,
  AlertCircle,
  FileText,
  Globe,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobileNav } from "@/context/MobileNavContext";
import toast from "react-hot-toast";
import seekerVisaGatewayEndpoints, {
  VisaConsultationRequest,
} from "@/lib/api/endpoints/seeker/seekerVisaGatewayEndpoints";
import { countryOptions } from "@/types/visa";
import adminContentEndpoints, {
  VisaGuideResponse,
} from "@/lib/api/endpoints/admin/adminContentEndpoints";
import contentEndpoints from "@/lib/api/endpoints/public/publicContentEndpoints";

// Types
interface VisaType {
  id: number;
  type: string;
  sinhala: string;
  description: string;
  cost: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  country?: never;
}

interface FormData {
  hasPassport: string;
  countryPlanning: string;
  otherCountry: string;
  previousRejection: string;
  targetTravelMonth: string;
  targetTravelYear: string;
  additionalNotes: string;
}

// Visa Types Data (Top Section)
const visaTypes: VisaType[] = [
  {
    id: 1,
    type: "Student Visa",
    sinhala: "ශිෂ්‍ය වීස",
    description: "Pursue higher education in top global universities.",
    cost: "LKR 1.5M - 4.5M",
    time: "4 - 12 Weeks",
    icon: BookOpen,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 2,
    type: "Work Visa",
    sinhala: "වැඩ වීසා",
    description: "Legal employment pathways for skilled and unskilled workers.",
    cost: "LKR 500k - 1.5M",
    time: "8 - 24 Weeks",
    icon: Briefcase,
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 3,
    type: "Visit Visa",
    sinhala: "සංචාරක වීසා",
    description: "Explore the world for tourism or family visits.",
    cost: "LKR 50k - 250k",
    time: "1 - 4 Weeks",
    icon: Plane,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
  },
];

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
function VisaGuideSkeleton() {
  return (
    <Card className="h-full overflow-hidden flex flex-col p-0">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-6 flex flex-col flex-1 space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function VisaPage() {
  const { isMobileNavOpen } = useMobileNav();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<
    VisaType | VisaGuideResponse | null
  >(null);

  // Visa guides state
  const [visaGuides, setVisaGuides] = useState<VisaGuideResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    hasPassport: "",
    countryPlanning: "",
    otherCountry: "",
    previousRejection: "",
    targetTravelMonth: "",
    targetTravelYear: new Date().getFullYear().toString(),
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Generate year options (current year to current year + 9)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Show more popup state
  const [showMorePopup, setShowMorePopup] = useState<{
    isOpen: boolean;
    guide: VisaGuideResponse | null;
  }>({
    isOpen: false,
    guide: null,
  });

  // Fetch visa guides with pagination
  const fetchVisaGuides = useCallback(
    async (page: number = 0, append: boolean = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await contentEndpoints.visa.getVisas({
          page: page,
          size: pageSize,
        });
        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data) {
          const content = apiResponse.data.content || [];
          const totalPagesData = apiResponse.data.totalPages || 0;
          const totalElements = apiResponse.data.totalElements || 0;

          if (append) {
            setVisaGuides((prev) => [...prev, ...content]);
          } else {
            setVisaGuides(content);
          }

          setTotalPages(totalPagesData);
          setTotalItems(totalElements);
          setHasMore(page < totalPagesData - 1);
          setCurrentPage(page);
        } else {
          toast.error(apiResponse.message || "Failed to load visa guides");
        }
      } catch (error) {
        console.error("Error fetching visa guides:", error);
        toast.error("Failed to load visa guides");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize],
  );

  // Initial load
  useEffect(() => {
    fetchVisaGuides(0, false);
  }, [fetchVisaGuides]);

  // Load more
  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchVisaGuides(currentPage + 1, true);
    }
  };

  const openShowMorePopup = (guide: VisaGuideResponse) => {
    setShowMorePopup({
      isOpen: true,
      guide: guide,
    });
  };

  const closeShowMorePopup = () => {
    setShowMorePopup({
      isOpen: false,
      guide: null,
    });
  };

  const openPopup = (visa: VisaType | VisaGuideResponse) => {
    setSelectedVisa(visa);
    setIsPopupOpen(true);
    // Reset form when opening
    setFormData({
      hasPassport: "",
      countryPlanning: visa.country
        ? countryOptions.includes(visa.country)
          ? visa.country
          : "Other"
        : "",
      otherCountry: countryOptions.includes(visa.country!) ? "" : visa.country!,
      previousRejection: "",
      targetTravelMonth: "",
      targetTravelYear: currentYear.toString(),
      additionalNotes: "",
    });
    setSubmitSuccess(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedVisa(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.hasPassport) {
      toast.error("Please select if you have a passport");
      return;
    }
    if (!formData.countryPlanning) {
      toast.error("Please select a country");
      return;
    }
    if (formData.countryPlanning === "Other" && !formData.otherCountry.trim()) {
      toast.error("Please specify your country");
      return;
    }
    if (!formData.previousRejection) {
      toast.error("Please select if you have had a previous visa rejection");
      return;
    }
    if (!formData.targetTravelMonth) {
      toast.error("Please select your target travel month");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare final country value
      const finalCountry =
        formData.countryPlanning === "Other"
          ? `other_${formData.otherCountry}`
          : formData.countryPlanning;

      // Map visa type to enum
      let visaType = "VISIT";
      if (selectedVisa) {
        const title = selectedVisa.type;
        if (title && title.includes("Student")) visaType = "STUDENT";
        else if (title && title.includes("Work")) visaType = "WORK";
        else if (title && title.includes("Visit")) visaType = "VISIT";
        else visaType = selectedVisa.type;
      }

      // Construct travel date
      const travelDate = new Date(
        `${formData.targetTravelMonth} 1, ${formData.targetTravelYear}`,
      );

      const requestData: VisaConsultationRequest = {
        type: visaType,
        country: finalCountry,
        visaRejection: formData.previousRejection === "yes",
        hasPassport: formData.hasPassport === "yes",
        travelDate: travelDate.toISOString(),
        note: formData.additionalNotes || undefined,
      };

      const response =
        await seekerVisaGatewayEndpoints.visa.createConsultation(requestData);

      if (response.data.success) {
        setSubmitSuccess(true);
        toast.success("Consultation request sent successfully!");

        // Close popup after 10 seconds on success
        setTimeout(() => {
          closePopup();
        }, 10000);
      } else {
        toast.error(response.data.message || "Failed to submit consultation");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit consultation";
      toast.error(errorMessage);
      console.error("Failed to submit consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get display text for selected visa
  const getVisaDisplayText = () => {
    if (!selectedVisa) return "";
    if ("country" in selectedVisa) {
      return `${capitalizeFirstLetter(selectedVisa.type)} Visa - ${selectedVisa.country}`;
    }
    return selectedVisa.type;
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <VisaGuideSkeleton key={`skeleton-${index}`} />
    ));
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
          <span className="text-background/90"> Visa</span>
        </h1>
        <p className="text-background/80 relative">
          Your comprehensive guide to global visa processes. We simplify the
          complex documentation for you.
        </p>
      </motion.div>

      {/* Visa Types Cards - Top Section */}
      <div className="flex-1 py-4 px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {visaTypes.map((visa) => (
            <motion.div
              key={visa.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="px-6 py-6 flex flex-col h-full">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${visa.color} bg-opacity-10 flex items-center justify-center shrink-0`}
                    >
                      <visa.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{visa.type}</h3>
                      <p className="text-sm text-muted-foreground font-bold">
                        {visa.sinhala}
                      </p>
                    </div>
                  </div>

                  {/* Description - Flex-1 to push button down */}
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm mb-4">
                      {visa.description}
                    </p>

                    {/* Cost and Time */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Est. Cost</span>
                        <span className="font-semibold">{visa.cost}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Proc. Time
                        </span>
                        <span className="font-semibold">{visa.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Book Consultation Button - Always at bottom */}
                  <div className="mt-auto pt-2">
                    <Button
                      onClick={() => openPopup(visa)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Visa Guides Cards Section */}
        <div className="">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Country Visa Guides
          </h2>

          {isLoading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {renderSkeletons()}
            </motion.div>
          ) : visaGuides.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No visa guides available
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Check back later for new guides
              </p>
            </div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visaGuides.map((guide) => (
                  <motion.div
                    key={guide.id}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    className="h-full"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col p-0">
                      {/* Image Section */}
                      <div className="relative h-48 w-full overflow-hidden">
                        {guide.imageUrl ? (
                          <Image
                            src={guide.imageUrl}
                            alt={guide.country}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5">
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Globe className="h-16 w-16 text-primary/30" />
                            </div>
                          </div>
                        )}

                        {/* Country Badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 text-lg">
                            {guide.country}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="px-6 pb-6 flex flex-col flex-1">
                        {/* Title */}
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {guide.title}
                        </h3>

                        {/* Description - 2 lines only */}
                        <div className="mb-4">
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {guide.description}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          {/* Documents Section - Preview */}
                          <div className="flex-1 mb-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-primary" />
                              Required Documents
                            </h4>
                            <ul className="space-y-1">
                              {guide.documents?.slice(0, 2).map((doc, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                  <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                                  <span className="truncate">{doc}</span>
                                </li>
                              ))}
                              {guide.documents?.length > 2 && (
                                <li className="text-xs text-primary">
                                  +{guide.documents.length - 2} more
                                </li>
                              )}
                            </ul>
                          </div>
                          {/* Common Mistakes Preview */}
                          <div className="flex-1 mb-4">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              Common Mistakes
                            </h4>
                            <ul className="space-y-1">
                              {guide.commonMistakes
                                ?.slice(0, 2)
                                .map((mistake, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                                    <span className="truncate">{mistake}</span>
                                  </li>
                                ))}
                              {guide.commonMistakes?.length > 2 && (
                                <li className="text-xs text-primary">
                                  +{guide.commonMistakes.length - 2} more
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Cost and Time Info */}
                        <div className="bg-muted/30 rounded-lg p-3 mb-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              Est. Cost
                            </span>
                            <span className="font-semibold text-sm">
                              {guide.cost}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Processing Time
                            </span>
                            <span className="font-semibold text-sm">
                              {guide.processingTime}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-1 mt-auto">
                          <Button
                            variant="link"
                            onClick={() => openShowMorePopup(guide)}
                            className="w-full text-primary cursor-pointer group gap-0"
                            size="sm"
                          >
                            <span>Show more details</span>
                            <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
                          <Button
                            onClick={() => openPopup(guide)}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group"
                            size="sm"
                          >
                            <span>Book Consultation</span>
                            <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                          </Button>
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
                  Showing {visaGuides.length} of {totalItems} visa guides
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Show More Popup - Same as before */}
      <AnimatePresence>
        {showMorePopup.isOpen && showMorePopup.guide && (
          // ... (keep the same show more popup code)
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeShowMorePopup}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {showMorePopup.guide.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {showMorePopup.guide.country} • {capitalizeFirstLetter(showMorePopup.guide.type)}{" "}
                      Visa
                    </p>
                  </div>
                  <button
                    onClick={closeShowMorePopup}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Full Description */}
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {showMorePopup.guide.description}
                    </p>
                  </div>

                  {/* All Documents */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Required Documents
                    </h3>
                    <ul className="space-y-2">
                      {showMorePopup.guide.documents?.map((doc, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-sm bg-muted/30 rounded-lg p-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* All Common Mistakes */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Common Mistakes to Avoid
                    </h3>
                    <ul className="space-y-2">
                      {showMorePopup.guide.commonMistakes?.map(
                        (mistake, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 text-sm bg-destructive/5 rounded-lg p-3 border border-destructive/20"
                          >
                            <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                            <span>{mistake}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* Cost and Time Details */}
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Cost</p>
                      <p className="font-semibold">
                        {showMorePopup.guide.cost}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Processing Time
                      </p>
                      <p className="font-semibold">
                        {showMorePopup.guide.processingTime}
                      </p>
                    </div>
                  </div>

                  {/* Book Consultation Button */}
                  <Button
                    onClick={() => {
                      closeShowMorePopup();
                      openPopup(showMorePopup.guide!);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Book Consultation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Consultation Popup Modal - Keep the same */}
      <AnimatePresence>
        {isPopupOpen && (
          // ... (keep the same consultation popup code)
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Book Consultation</h2>
                    <p className="text-sm text-muted-foreground">
                      {getVisaDisplayText()}
                    </p>
                  </div>
                  <button
                    onClick={closePopup}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form */}
                {submitSuccess ? (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Request Sent!
                    </h3>
                    <p className="text-muted-foreground">
                      Our visa expert will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Do you have a passport? */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Do you have a passport?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="hasPassport"
                            value="yes"
                            checked={formData.hasPassport === "yes"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                            required
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="hasPassport"
                            value="no"
                            checked={formData.hasPassport === "no"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {/* Which country are you planning for? */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Which country are you planning for?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="countryPlanning"
                        value={formData.countryPlanning}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        required
                      >
                        <option value="">Select a country</option>
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Other Country Input */}
                    <AnimatePresence>
                      {formData.countryPlanning === "Other" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label className="block text-sm font-medium mb-2">
                            Please specify country{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="otherCountry"
                            value={formData.otherCountry}
                            onChange={handleInputChange}
                            placeholder="Enter country name"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            required={formData.countryPlanning === "Other"}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Previous Visa Rejection? */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Previous Visa Rejection?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="previousRejection"
                            value="yes"
                            checked={formData.previousRejection === "yes"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                            required
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="previousRejection"
                            value="no"
                            checked={formData.previousRejection === "no"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-primary"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {/* Target Travel Month & Year */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Travel Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          name="targetTravelMonth"
                          value={formData.targetTravelMonth}
                          onChange={handleInputChange}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required
                        >
                          <option value="">Select Month</option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>

                        <select
                          name="targetTravelYear"
                          value={formData.targetTravelYear}
                          onChange={handleInputChange}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                          required
                        >
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                        placeholder="Any specific questions or requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Consultation Request"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
