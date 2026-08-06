"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMobileNav } from "@/context/MobileNavContext";
import toast from "react-hot-toast";
import seekerVisaGatewayEndpoints, {
  VisaConsultationRequest,
} from "@/lib/api/endpoints/seeker/seekerVisaGatewayEndpoints";

// Types
interface VisaType {
  id: number;
  title: string;
  sinhala: string;
  description: string;
  cost: string;
  time: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  country?: never;
}

interface VisaGuide {
  id: number;
  country: string;
  title: string;
  description: string;
  documents: string[];
  commonMistakes: string[];
  cost: string;
  processingTime: string;
  image: string;
  color: string;
  flag: string;
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
    title: "Student Visa",
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
    title: "Work Visa",
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
    title: "Visit Visa",
    sinhala: "සංචාරක වීසා",
    description: "Explore the world for tourism or family visits.",
    cost: "LKR 50k - 250k",
    time: "1 - 4 Weeks",
    icon: Plane,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
  },
];

// Visa Guides Data (Now as Cards)
const visaGuides: VisaGuide[] = [
  {
    id: 1,
    country: "UK",
    title: "UK Student Visa Guide",
    description:
      "Everything you need to know about studying in the United Kingdom from Sri Lanka.",
    documents: [
      "CAS Letter",
      "IELTS Result (6.5+)",
      "Bank Statement (6 months)",
      "TB Test Certificate",
    ],
    commonMistakes: [
      "Insufficient Funds",
      "Gap in Education",
      "Weak Statement of Purpose",
    ],
    cost: "£1,500 - £2,000",
    processingTime: "3 - 6 weeks",
    image: "/images/test.jpg",
    color: "from-blue-600 to-blue-800",
    flag: "🇬🇧",
  },
  {
    id: 2,
    country: "Australia",
    title: "Australia Student Visa Guide",
    description:
      "Complete guide for Sri Lankan students applying to Australian universities.",
    documents: [
      "Confirmation of Enrollment",
      "IELTS/PTE Results",
      "Genuine Student Check",
      "Health Insurance (OSHC)",
    ],
    commonMistakes: [
      "GTE Statement Issues",
      "Incorrect Financials",
      "Health Requirements",
    ],
    cost: "AUD 30,000 - 45,000",
    processingTime: "4 - 8 weeks",
    image: "/images/test.jpg",
    color: "from-blue-600 to-blue-800",
    flag: "🇦🇺",
  },
  {
    id: 3,
    country: "Canada",
    title: "Canada Student Visa Guide",
    description:
      "Step-by-step guide for Canadian study permit applications from Sri Lanka.",
    documents: [
      "Letter of Acceptance",
      "IELTS Results",
      "GIC Account",
      "Medical Exam",
    ],
    commonMistakes: [
      "Missing Biometrics",
      "Insufficient Funds",
      "Purpose of Visit",
    ],
    cost: "CAD 20,000 - 35,000",
    processingTime: "8 - 12 weeks",
    image: "/images/test.jpg",
    color: "from-red-500 to-red-700",
    flag: "🇨🇦",
  },
  {
    id: 4,
    country: "USA",
    title: "USA Student Visa Guide",
    description:
      "Comprehensive F-1 visa guide for Sri Lankan students heading to America.",
    documents: [
      "I-20 Form",
      "SEVIS Fee Receipt",
      "TOEFL/IELTS",
      "Financial Affidavits",
    ],
    commonMistakes: [
      "Visa Interview Prep",
      "SEVIS Payment",
      "Ties to Home Country",
    ],
    cost: "USD 25,000 - 50,000",
    processingTime: "2 - 4 weeks",
    image: "/images/test.jpg",
    color: "from-indigo-500 to-indigo-700",
    flag: "🇺🇸",
  },
  {
    id: 5,
    country: "Germany",
    title: "Germany Student Visa Guide",
    description:
      "Complete guide for German student visa applications from Sri Lanka.",
    documents: [
      "University Admission",
      "Blocked Account",
      "Health Insurance",
      "CV & SOP",
    ],
    commonMistakes: [
      "Blocked Account Amount",
      "APS Certificate",
      "Language Requirements",
    ],
    cost: "EUR 10,000 - 15,000",
    processingTime: "6 - 12 weeks",
    image: "/images/test.jpg",
    color: "from-yellow-600 to-yellow-800",
    flag: "🇩🇪",
  },
  {
    id: 6,
    country: "Japan",
    title: "Japan Student Visa Guide",
    description:
      "Everything Sri Lankan students need for Japanese study visas.",
    documents: ["COE", "JLPT/NAT Results", "Bank Statements", "Study Plan"],
    commonMistakes: [
      "Language Proficiency",
      "Financial Proof",
      "Document Translation",
    ],
    cost: "JPY 1.5M - 2.5M",
    processingTime: "4 - 8 weeks",
    image: "/images/test.jpg",
    color: "from-red-500 to-red-700",
    flag: "🇯🇵",
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

// Country options for dropdown
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

export default function VisaPage() {
  const { isMobileNavOpen } = useMobileNav();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<VisaType | VisaGuide | null>(
    null,
  );

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

  const openPopup = (visa: VisaType | VisaGuide) => {
    setSelectedVisa(visa);
    setIsPopupOpen(true);
    // Reset form when opening
    setFormData({
      hasPassport: "",
      countryPlanning: "",
      otherCountry: "",
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
        const title = selectedVisa.title;
        if (title.includes("Student")) visaType = "STUDENT";
        else if (title.includes("Work")) visaType = "WORK";
        else if (title.includes("Visit")) visaType = "VISIT";
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
    } 
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit consultation";
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
      return `${selectedVisa.title} - ${selectedVisa.country}`;
    }
    return selectedVisa.title;
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
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
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
                      <h3 className="text-xl font-bold mb-1">{visa.title}</h3>
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

        {/* Visa Guides Cards Section - Now as Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Country Visa Guides
          </h2>

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
                    {guide.image ? (
                      <Image
                        src={guide.image}
                        alt={guide.country}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${guide.color}`}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Globe className="h-16 w-16 text-white/30" />
                        </div>
                      </div>
                    )}

                    {/* Country Flag Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0 text-lg">
                        {guide.flag} {guide.country}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {guide.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {guide.description}
                    </p>

                    <div className="flex justify-between px-1">
                      {/* Documents Section */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          Required Documents
                        </h4>
                        <ul className="space-y-1">
                          {guide.documents.slice(0, 3).map((doc, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <div className="w-1 h-1 rounded-full bg-primary" />
                              <span className="line-clamp-1">{doc}</span>
                            </li>
                          ))}
                          {guide.documents.length > 3 && (
                            <li className="text-xs text-primary">
                              +{guide.documents.length - 3} more
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Common Mistakes Preview */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          Common Mistakes
                        </h4>
                        <ul className="space-y-1">
                          {guide.commonMistakes
                            .slice(0, 2)
                            .map((mistake, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 text-xs text-muted-foreground"
                              >
                                <div className="w-1 h-1 rounded-full bg-destructive" />
                                <span className="line-clamp-1">{mistake}</span>
                              </li>
                            ))}
                          {guide.commonMistakes.length > 2 && (
                            <li className="text-xs text-primary">
                              +{guide.commonMistakes.length - 2} more
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Cost and Time Info */}
                    <div className="bg-muted/30 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Est. Cost</span>
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
                    <div className="mt-auto space-y-2">
                      <Button
                        onClick={() => openPopup(guide)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group"
                        size="sm"
                      >
                        <span>View Full Guide</span>
                        <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

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

                    {/* Other Country Input - Shows when "Other" is selected */}
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

                    {/* Target Travel Month & Year - Side by Side */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Target Travel Date{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Month Selector */}
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

                        {/* Year Selector */}
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
