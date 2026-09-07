"use client";

import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  GraduationCap,
  DollarSign,
  ClipboardCheck,
  Globe,
  BookOpen,
  Briefcase,
  Heart,
  Users,
  X,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import seekerVisaGatewayEndpoints, {
  GatewayConsultationRequest,
} from "@/lib/api/endpoints/seeker/seekerVisaGatewayEndpoints";
import toast from "react-hot-toast";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";

// Animation
const fadeInUp: Variants = {
  hidden: { opacity: 1, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// Study Fields
const studyFields = [
  "Business & Management",
  "Information Technology (IT)",
  "Engineering",
  "Healthcare",
  "Hospitality & Tourism",
  "Education & Teaching",
  "Accounting & Finance",
  "Marketing",
  "Logistics & Supply Chain",
  "Skilled Trades (Construction, Caregiver, Automotive, etc.)",
  "Language Studies",
  "Postgraduate Studies",
  "Scholarship Programs",
  "Other",
];

// Study Levels
const studyLevels = [
  "Diploma",
  "Foundation",
  "Bachelor's Degree",
  "Postgraduate Diploma",
  "Master's Degree",
  "PhD",
  "Certificate Program",
];

// Intake Months
const intakes = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Countries
const countries = [
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

export default function GatewayPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isAuthenticated, isProfileComplete, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Form Data
  const [formData, setFormData] = useState<GatewayConsultationRequest>({
    // Study Preferences
    country: "",
    otherCountry: "",
    studyField: "",
    otherStudyField: "",
    studyLevel: "",
    intake: "",
    universityType: "",
    languageTestStatus: "",

    // Financial Planning
    budget: undefined,
    familySponsorship: "",
    educationLoan: "",

    // Readiness
    hasPassport: "",
    visaRejection: "",
    applyWithin: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    // Reset form when opening
    setFormData({
      // Study Preferences
      country: "",
      otherCountry: "",
      studyField: "",
      otherStudyField: "",
      studyLevel: "",
      intake: "",
      universityType: "",
      languageTestStatus: "",

      // Financial Planning
      budget: undefined,
      familySponsorship: "",
      educationLoan: "",

      // Readiness
      hasPassport: "",
      visaRejection: "",
      applyWithin: "",
    });
    // setSubmitSuccess(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response =
        await seekerVisaGatewayEndpoints.gateway.createConsultation(formData);

      if (response.data.success) {
        setSubmitSuccess(true);
        toast.success("Consultation request sent successfully!");

        setShowForm(false);
        setCurrentStep(1);

        openPopup();

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

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.country &&
        formData.studyField &&
        formData.studyLevel &&
        formData.intake &&
        formData.languageTestStatus &&
        (formData.country !== "Other" || formData.otherCountry) &&
        (formData.studyField !== "Other" || formData.otherStudyField)
      );
    }
    if (currentStep === 2) {
      return (
        formData.budget && formData.familySponsorship && formData.educationLoan
      );
    }
    if (currentStep === 3) {
      return (
        formData.hasPassport && formData.visaRejection && formData.applyWithin
      );
    }
    return true;
  };

  const handleApplyNowClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a consultation");
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!(user?.role == "seeker" || user?.role == "dev")) {
      toast.error("Only seekers can book a consultation");
      return;
    }

    if (!isProfileComplete) {
      // Show toast with action buttons
      toast(
        (t) => (
          <div className="flex flex-col gap-3 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">Profile Incomplete</p>
                <p className="text-sm text-muted-foreground">
                  Please complete your profile before booking a consultation
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.dismiss(t.id)}
                className="cursor-pointer"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push(
                    `/seeker/profile?redirect=${encodeURIComponent(pathname)}&type=gateway`,
                  );
                }}
                className="cursor-pointer bg-primary hover:bg-primary/90"
              >
                Go to Profile
              </Button>
            </div>
          </div>
        ),
        {
          duration: 10000, // 10 seconds
          position: "top-center",
          style: {
            padding: "16px",
            minWidth: "300px",
          },
        },
      );
      return;
    }

    setShowForm(true);
  };

  return (
    <div className="bg-background flex flex-col">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-2 py-8 pb-4 pt-24 xl:pt-28 sm:px-6 lg:px-8 border-b relative rounded-b-3xl text-center overflow-hidden"
      >
        {/* Background Image */}
        <div className="">
          <Image
            src="/images/bg_short.PNG"
            alt="Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={() => console.log("Image failed to load")}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-blue-600/80 via-blue-600/50 to-blue-600/40 dark:from-blue-950/80 dark:via-blue-900/70 dark:to-blue-950/60" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white/80 dark:text-primary/80">
            <span className="font-fm-gamunu text-[40px] md:text-5xl">
              ගොඩයන{" "}
            </span>
            <span className="text-secondary/90">Gateway</span>
          </h1>
          <p className="text-white/70">
            Your premium structured migration portal. Start your journey with a
            professional eligibility assessment.
          </p>
        </div>
      </motion.div>

      {/* Landing Section - Show before form */}
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center px-4 py-10"
          >
            <div className="text-center max-w-2xl mx-auto pt-8 pb-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <GraduationCap className="h-10 w-10 text-primary" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Your Global Education Journey
              </h2>

              <p className="text-xl text-primary font-semibold mb-8">
                Apply for Your Study Abroad Dream - Free
              </p>

              <Button
                onClick={handleApplyNowClick}
                size="lg"
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 cursor-pointer"
              >
                APPLY NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - Steps */}
                <div className="space-y-6">
                  <div className="bg-card border rounded-xl p-5 sticky top-24">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      Application Steps
                    </h3>

                    <div className="space-y-4 text-sm">
                      <div
                        className={`flex items-center gap-2 ${
                          currentStep >= 1
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            currentStep > 1
                              ? "bg-primary text-white"
                              : currentStep === 1
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > 1 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            1
                          )}
                        </div>
                        Study Preferences
                      </div>

                      <div
                        className={`flex items-center gap-2 ${
                          currentStep >= 2
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            currentStep > 2
                              ? "bg-primary text-white"
                              : currentStep === 2
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > 2 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            2
                          )}
                        </div>
                        Financial Planning
                      </div>

                      <div
                        className={`flex items-center gap-2 ${
                          currentStep >= 3
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            currentStep === 3
                              ? "bg-primary text-white"
                              : currentStep > 3
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {currentStep > 3 ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            3
                          )}
                        </div>
                        Readiness Check
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN - Form Steps */}
                <div className="lg:col-span-2">
                  <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Study Preferences */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step1"
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-5"
                        >
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            Study Preferences
                          </h2>

                          <div className="hidden md:flex flex-col md:flex-row gap-8">
                            {/* Preferred Country */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred Country{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.country}
                                onValueChange={(value) =>
                                  handleChange("country", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Preferred Study Field */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred Study Field{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.studyField}
                                onValueChange={(value) =>
                                  handleChange("studyField", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select study field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {studyFields.map((field) => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex md:hidden flex-col gap-4">
                            {/* Preferred Country */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred Country{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.country}
                                onValueChange={(value) =>
                                  handleChange("country", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Other Country Input */}
                            {formData.country === "Other" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="flex-1"
                              >
                                <Label className="text-sm mb-1 block">
                                  Please specify country{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  placeholder="Enter country name"
                                  value={formData.otherCountry}
                                  onChange={(e) =>
                                    handleChange("otherCountry", e.target.value)
                                  }
                                />
                              </motion.div>
                            )}

                            {/* Preferred Study Field */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred Study Field{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.studyField}
                                onValueChange={(value) =>
                                  handleChange("studyField", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select study field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {studyFields.map((field) => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Other Study Field Input */}
                            {formData.studyField === "Other" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="flex-1"
                              >
                                <Label className="text-sm mb-1 block">
                                  Please specify study field{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  placeholder="Enter study field name"
                                  value={formData.otherStudyField}
                                  onChange={(e) =>
                                    handleChange(
                                      "otherStudyField",
                                      e.target.value,
                                    )
                                  }
                                />
                              </motion.div>
                            )}
                          </div>

                          <div
                            className={`hidden flex-col md:flex-row gap-4 md:gap-8 ${formData.country !== "Other" && formData.studyField === "Other" ? "justify-end" : ""} ${formData.country === "Other" || formData.studyField === "Other" ? "md:flex" : ""}`}
                          >
                            {/* Other Country Input */}
                            {formData.country === "Other" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className={`${formData.studyField === "Other" ? "flex-1" : "w-[calc(50%-16px)]"}`}
                              >
                                <Label className="text-sm mb-1 block">
                                  Please specify country{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  placeholder="Enter country name"
                                  value={formData.otherCountry}
                                  onChange={(e) =>
                                    handleChange("otherCountry", e.target.value)
                                  }
                                />
                              </motion.div>
                            )}

                            {/* Other Study Field Input */}
                            {formData.studyField === "Other" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className={`${formData.country === "Other" ? "flex-1" : "w-[calc(50%-16px)]"}`}
                              >
                                <Label className="text-sm mb-1 block">
                                  Please specify study field{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  placeholder="Enter study field name"
                                  value={formData.otherStudyField}
                                  onChange={(e) =>
                                    handleChange(
                                      "otherStudyField",
                                      e.target.value,
                                    )
                                  }
                                />
                              </motion.div>
                            )}
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            {/* Preferred Study Level */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred Study Level{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.studyLevel}
                                onValueChange={(value) =>
                                  handleChange("studyLevel", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select study level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {studyLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Preferred Intake */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred Intake{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={formData.intake}
                                onValueChange={(value) =>
                                  handleChange("intake", value)
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select intake month" />
                                </SelectTrigger>
                                <SelectContent>
                                  {intakes.map((intake) => (
                                    <SelectItem key={intake} value={intake}>
                                      {intake}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            {/* Preferred University Type (Optional) */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Preferred University Type (If available)
                              </Label>
                              <Input
                                placeholder="e.g., Public University, Private University, etc."
                                value={formData.universityType}
                                onChange={(e) =>
                                  handleChange("universityType", e.target.value)
                                }
                              />
                            </div>

                            {/* Language Test Status */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Language Test Status{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <RadioGroup
                                value={formData.languageTestStatus}
                                onValueChange={(value) =>
                                  handleChange("languageTestStatus", value)
                                }
                                className="flex justify-between items-center py-2 md:p-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="completed"
                                    id="completed"
                                  />
                                  <Label
                                    htmlFor="completed"
                                    className="text-gray-500"
                                  >
                                    Completed
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="planning"
                                    id="planning"
                                  />
                                  <Label
                                    htmlFor="planning"
                                    className="text-gray-500"
                                  >
                                    Planning to do soon
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              onClick={handleNext}
                              disabled={!isStepValid()}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Financial Planning */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step2"
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-5"
                        >
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Financial Planning
                          </h2>

                          {/* Budget */}
                          <div>
                            <Label className="text-sm mb-1 block">
                              Budget (Annual - in LKR){" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              placeholder="e.g., 7500000"
                              value={formData.budget}
                              onChange={(e) =>
                                handleChange("budget", e.target.value)
                              }
                              type="number"
                            />
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            {/* Family Sponsorship */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Family Sponsorship Available?{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <RadioGroup
                                value={formData.familySponsorship}
                                onValueChange={(value) =>
                                  handleChange("familySponsorship", value)
                                }
                                className="flex gap-8 py-2 md:p-2 text-gray-500 justify-around"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="yes"
                                    id="sponsorshipYes"
                                  />
                                  <Label htmlFor="sponsorshipYes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="no"
                                    id="sponsorshipNo"
                                  />
                                  <Label htmlFor="sponsorshipNo">No</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Education Loan Interest */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Education Loan Interest?{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <RadioGroup
                                value={formData.educationLoan}
                                onValueChange={(value) =>
                                  handleChange("educationLoan", value)
                                }
                                className="flex gap-8 py-2 md:p-2 text-gray-500 justify-around"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="loanYes" />
                                  <Label htmlFor="loanYes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="loanNo" />
                                  <Label htmlFor="loanNo">No</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button
                              onClick={handleNext}
                              disabled={!isStepValid()}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Readiness Check */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step3"
                          variants={fadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="space-y-5"
                        >
                          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-primary" />
                            Readiness Check
                          </h2>

                          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="flex-1 flex flex-col gap-4">
                              {/* Passport Available */}
                              <div className="w-full">
                                <Label className="text-sm mb-1 block">
                                  Passport Available?{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup
                                  value={formData.hasPassport}
                                  onValueChange={(value) =>
                                    handleChange("hasPassport", value)
                                  }
                                  className="flex justify-around py-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="passportYes"
                                    />
                                    <Label htmlFor="passportYes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="passportNo"
                                    />
                                    <Label htmlFor="passportNo">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>

                              {/* Previous Visa Rejection */}
                              <div className="w-full">
                                <Label className="text-sm mb-1 block">
                                  Previous Visa Rejection?{" "}
                                  <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup
                                  value={formData.visaRejection}
                                  onValueChange={(value) =>
                                    handleChange("visaRejection", value)
                                  }
                                  className="flex justify-around py-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="yes"
                                      id="rejectionYes"
                                    />
                                    <Label htmlFor="rejectionYes">Yes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="no"
                                      id="rejectionNo"
                                    />
                                    <Label htmlFor="rejectionNo">No</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>

                            {/* Ready to Apply Within */}
                            <div className="flex-1">
                              <Label className="text-sm mb-1 block">
                                Ready to Apply Within?{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <RadioGroup
                                value={formData.applyWithin}
                                onValueChange={(value) =>
                                  handleChange("applyWithin", value)
                                }
                                className="flex flex-col gap-4 py-1"
                              >
                                <div className="flex justify-around">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="1month"
                                      id="1month"
                                    />
                                    <Label htmlFor="1month">
                                      1 Month&nbsp;&nbsp;
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="3months"
                                      id="3months"
                                    />
                                    <Label htmlFor="3months">3 Months</Label>
                                  </div>
                                </div>
                                <div className="flex justify-around">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value="6months"
                                      id="6months"
                                    />
                                    <Label htmlFor="6months">6 Months</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other">
                                      Other &nbsp; &nbsp; &nbsp; &nbsp;
                                    </Label>
                                  </div>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>

                          <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={handleBack}>
                              <ChevronLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={!isStepValid() || isSubmitting}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  Submit Application
                                  <CheckCircle className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Consultation Popup Modal */}
      <AnimatePresence>
        {isPopupOpen && (
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
                  </div>
                  <button
                    onClick={closePopup}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Form */}
                {submitSuccess && (
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
                      Our gateway expert will contact you within 24 hours.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
