"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stories = [
  {
    id: 1,
    title: "Migration Success",
    description: "My journey to working as a Senior Nurse in the UK",
    image: "/images/story-1.jpg", // Replace with actual image
    name: "Kamala Perera",
    role: "Senior Nurse, NHS UK",
    delay: 0,
  },
  {
    id: 2,
    title: "Migration Success",
    description: "My journey to working as a Senior Nurse in the UK",
    image: "/images/story-2.jpg", // Replace with actual image
    name: "Nuwan Fernando",
    role: "Software Engineer, Google",
    delay: 0.2,
  },
  {
    id: 3,
    title: "Migration Success",
    description: "My journey to working as a Senior Nurse in the UK",
    image: "/images/story-3.jpg", // Replace with actual image
    name: "Priyani Jayawardena",
    role: "Marketing Manager, Dubai",
    delay: 0.4,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

export function SuccessStories() {
  return (
    <section className="py-10 md:py-16 bg-background-cold overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Success <span className="text-primary">Stories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Inspiring career journeys from our community
          </p>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {stories.map((story) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="group relative"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background py-0">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover"
                    /> 
                  </motion.div>

                  {/* Quote Icon Overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: story.delay + 0.3 }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg"
                  >
                    <Quote className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Content */}
                <CardContent className="px-6 pb-6">
                  {/* Title with gradient line */}
                  <div className="mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60px" }}
                      viewport={{ once: true }}
                      transition={{ delay: story.delay + 0.2, duration: 0.4 }}
                      className="h-0.5 bg-primary mb-3"
                    />
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {story.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4">
                    {story.description}
                  </p>

                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: story.delay + 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{story.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {story.role}
                      </p>
                    </div>

                    {/* Read More Link */}
                    <Link
                      href={`/stories/${story.id}`}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium group"
          >
            <span>View All Success Stories</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
