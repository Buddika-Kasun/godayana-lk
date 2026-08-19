"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Feature type definition
interface Feature {
  id: number;
  title: string;
  description: string;
  href: string;
  image: string;
}

// Props for FeatureCard component
interface FeatureCardProps {
  feature: Feature;
  index: number;
  isMobile: boolean;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Global Jobs",
    description:
      "Verified local and overseas job opportunities with direct employer connections.",
    href: "/jobs",
    image: "/images/features/jobs.png",
  },
  {
    id: 2,
    title: "Visa Guidance",
    description:
      "Step-by-step documentation help for Student, Work, and Visit visas.",
    href: "/visa",
    image: "/images/features/visa.png",
  },
  {
    id: 3,
    title: "Skill Courses",
    description:
      "IELTS, Japanese, and professional training to make you migration-ready.",
    href: "/courses",
    image: "/images/features/courses.png",
  },
  {
    id: 4,
    title: "Country Guides",
    description:
      "Detailed insights into living costs, salaries, and demand in top countries.",
    href: "/countries",
    image: "/images/features/countries.png",
  },
  {
    id: 5,
    title: "Migration Gateway",
    description:
      "Premium assessment and financial planning for your migration journey.",
    href: "/gateway",
    image: "/images/features/gateway.png",
  },
  {
    id: 6,
    title: "Success Stories",
    description:
      "Real stories from Sri Lankans who transformed their lives abroad.",
    href: "/stories",
    image: "/images/features/stories.png",
  },
];

export function Features() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background-cold overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Your Gateway to{" "}
            <span className="text-primary">Global Opportunities</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to start your international journey, from job
            search to settlement abroad.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              index={index}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium group"
          >
            <span>Explore All Services</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  isMobile,
}: FeatureCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link href={feature.href} className="block">
      <div className="group relative bg-card border rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] md:aspect-[4/3] lg:aspect-[16/11]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading={index < 3 ? "eager" : "lazy"}
            quality={80}
            priority={index < 2}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Dark Overlay - darker on hover */}
          {/* <div className="absolute inset-0 bg-black/50 transition-all duration-300 group-hover:bg-black/70" /> */}

          {/* Gradient Overlay for better text visibility */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /> */}
        </div>

        {/* Title - Always Visible */}
        {/* <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 z-10">
          <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
            {feature.title}
          </h3>
        </div> */}

        {/* View More - Only Visible on Hover (Desktop) or Always on Mobile */}
        <div
          className={`
          absolute inset-0 z-20 flex items-center justify-center
          transition-all duration-300
          ${
            isMobile
              ? "opacity-100 bg-primary/20"
              : "opacity-0 group-hover:opacity-100 bg-primary/50"
          }
        `}
        >
          <div className="flex-row items-center transform transition-transform duration-300 group-hover:scale-110 hidden lg:flex p-2 gap-2">
            <span className="text-white text-lg font-semibold">Visit</span>
            <ArrowRight className="w-5 md:h-5 md:w-5 font-bold text-white" />
          </div>
        </div>
        <div className="h-full md:hidden inset-0 relative">
          <div className="absolute top-4 right-4 bg-primary/80 rounded-full p-2">
            <ArrowRight className="w-6 h-6 font-bold text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
