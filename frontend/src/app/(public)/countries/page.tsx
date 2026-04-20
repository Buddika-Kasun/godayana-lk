"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock Countries Data with flag emojis and images
const countriesData = [
  {
    id: 1,
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    description: "High demand for caregivers & factory workers.",
    salary: "LKR 280,000 - 450,000",
    visaType: "Specified Skilled Worker (SSW)",
    image: "/images/countries/japan.jpg",
    color: "from-red-500 to-red-700",
    opportunities: ["Caregivers", "Factory Workers", "IT Professionals"],
  },
  {
    id: 2,
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    description: "Great opportunities for healthcare and construction.",
    salary: "LKR 800,000 - 1,500,000",
    visaType: "Work / Skilled Migration",
    image: "/images/countries/australia.jpg",
    color: "from-blue-500 to-blue-700",
    opportunities: ["Healthcare", "Construction", "Engineering"],
  },
  {
    id: 3,
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    description: "Top destination for students and healthcare professionals.",
    salary: "LKR 700,000 - 1,200,000",
    visaType: "Student / Health & Care",
    image: "/images/countries/uk.jpg",
    color: "from-blue-600 to-blue-800",
    opportunities: ["Healthcare", "Education", "IT"],
  },
  {
    id: 4,
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    description: "Manufacturing and agriculture sectors are booming.",
    salary: "LKR 350,000 - 550,000",
    visaType: "E-9 / EPS",
    image: "/images/countries/south-korea.jpg",
    color: "from-indigo-500 to-indigo-700",
    opportunities: ["Manufacturing", "Agriculture", "Shipbuilding"],
  },
  {
    id: 5,
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    description: "Hospitality, retail and construction hub.",
    salary: "LKR 250,000 - 800,000",
    visaType: "Work Permit",
    image: "/images/countries/uae.jpg",
    color: "from-emerald-500 to-emerald-700",
    opportunities: ["Hospitality", "Retail", "Construction"],
  },
  {
    id: 6,
    code: "RO",
    name: "Romania",
    flag: "🇷🇴",
    description:
      "Growing demand for construction and factory workers in Europe.",
    salary: "LKR 200,000 - 350,000",
    visaType: "Work Visa",
    image: "/images/countries/romania.jpg",
    color: "from-yellow-500 to-yellow-700",
    opportunities: ["Construction", "Factory Workers", "Agriculture"],
  },
  {
    id: 7,
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    description: "Excellent opportunities in healthcare and engineering.",
    salary: "LKR 600,000 - 1,100,000",
    visaType: "Skilled Worker Visa",
    //image: "/images/countries/germany.jpg",
    color: "from-black to-gray-700",
    opportunities: ["Healthcare", "Engineering", "IT"],
  },
  {
    id: 8,
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    description: "Diverse opportunities across multiple sectors.",
    salary: "LKR 750,000 - 1,400,000",
    visaType: "Express Entry / PNP",
    //image: "/images/countries/canada.jpg",
    color: "from-red-500 to-red-700",
    opportunities: ["Healthcare", "IT", "Construction"],
  },
  {
    id: 9,
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    description:
      "Great work-life balance with high demand for skilled workers.",
    salary: "LKR 700,000 - 1,300,000",
    visaType: "Skilled Migrant",
    //image: "/images/countries/new-zealand.jpg",
    color: "from-green-500 to-green-700",
    opportunities: ["Healthcare", "Agriculture", "Construction"],
  },
  {
    id: 10,
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    description: "Financial and tech hub in Southeast Asia.",
    salary: "LKR 500,000 - 900,000",
    visaType: "Employment Pass",
    //image: "/images/countries/singapore.jpg",
    color: "from-red-600 to-red-800",
    opportunities: ["Finance", "IT", "Hospitality"],
  },
  {
    id: 11,
    code: "QA",
    name: "Qatar",
    flag: "🇶🇦",
    description: "Growing economy with construction and hospitality focus.",
    salary: "LKR 300,000 - 600,000",
    visaType: "Work Permit",
    //image: "/images/countries/qatar.jpg",
    color: "from-purple-500 to-purple-700",
    opportunities: ["Construction", "Hospitality", "Oil & Gas"],
  },
  {
    id: 12,
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    description: "Major opportunities in healthcare and construction.",
    salary: "LKR 280,000 - 550,000",
    visaType: "Work Visa",
    //image: "/images/countries/saudi.jpg",
    color: "from-green-600 to-green-800",
    opportunities: ["Healthcare", "Construction", "Engineering"],
  },
];

// Animation Variants
const fadeInUp: Variants = {
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

export default function GatewayPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 12; // Show all 12 countries
  const totalPages = Math.ceil(countriesData.length / countriesPerPage);

  // Get current countries
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = countriesData.slice(
    indexOfFirstCountry,
    indexOfLastCountry,
  );

  const goToPage = (page: number) => {
    const newPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          <span className="text-primary"> Countries</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore global destinations and find the best fit for your future.
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
          <span className="text-background/90"> Countries</span>
        </h1>
        <p className="text-background/80 relative">
          Explore global destinations and find the best fit for your future.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        {/* Countries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {currentCountries.map((country) => (
            <motion.div
              key={country.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="group max-h-90"
            >
              <Card className="h-full pt-0 overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                {/* Country Image with Overlay */}
                <div className="relative h-60 overflow-hidden">
                  {/* Image Placeholder with Gradient Background */}
                  {country.image ? (
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${country.color} opacity-90`}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  )}

                  {/* Country Code Badge */}
                  {/* <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-background/90 backdrop-blur-sm text-foreground/80 border-0 px-3 py-1 text-lg font-bold">
                      {country.flag} {country.code}
                    </Badge>
                  </div> */}

                  {/* Country Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-2 z-10 bg-linear-to-t from-background/90 via-background/50 to-transparent">
                    <h3 className="text-2xl font-bold dark:text-white/95 text-background drop-shadow-xl">
                      {country.name}
                    </h3>
                  </div>

                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                  </div>
                </div>

                <CardContent className="px-5 flex flex-col h-full">
                  {/* Top Section - Takes available space */}
                  <div className="flex-1">
                    {/* Description */}
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {country.description}
                    </p>

                    {/* Salary */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Avg. Salary
                        </span>
                        <span className="text-sm font-semibold">
                          {country.salary}
                        </span>
                      </div>
                    </div>

                    {/* Visa Type */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Visa Type
                        </span>
                        <span className="text-sm font-medium">
                          {country.visaType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Always at bottom */}
                  <div className="mt-auto pt-2">
                    {/* View Details Link */}
                    <Link
                      href={`/gateway/${country.id}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium group/link transition-colors"
                    >
                      <span>View Details</span>
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="inline-block ml-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.span
              key={currentPage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-sm px-4"
            >
              Page {currentPage} of {totalPages}
            </motion.span>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
