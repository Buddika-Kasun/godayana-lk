"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Briefcase,
  Plane,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  FileText,
  Landmark,
  Languages,
  Heart,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMobileNav } from "@/context/MobileNavContext";

// Visa Types Data (Top Section)
const visaTypes = [
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
const visaGuides = [
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
  hidden: { opacity: 0, y: 20 },
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

export default function VisaPage() {
  const { isMobileNavOpen } = useMobileNav();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      {/* <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="py-8 mx-4 sm:mx-6 lg:mx-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          ගොඩයන
          <span className="text-primary"> Visa</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Your comprehensive guide to global visa processes. We simplify the
          complex documentation for you.
        </p>
      </motion.div> */}
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
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${visa.color} bg-opacity-10 flex items-center justify-center shrink-0`}
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
                    <Link href={`/visa/consultation/${visa.id}`}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group">
                        <span>Book Consultation</span>
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
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
            {visaGuides.map((guide, index) => (
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
                        className={`absolute inset-0 bg-gradient-to-br ${guide.color}`}
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
                      {/* <Link href={`/visa/guide/${guide.id}`} className="block">
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer group"
                          size="sm"
                        >
                          <span>View Full Guide</span>
                          <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link> */}
                      <Link
                        href={`/visa/consultation/${guide.id}`}
                        className="block"
                      >
                        <Button
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group"
                          size="sm"
                        >
                          <span>View Full Guide</span>
                          <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
