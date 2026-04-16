"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  User,
  Heart,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Success Stories Data
const storiesData = [
  {
    id: 1,
    type: "Overseas Success",
    title: "From Colombo to Dubai: My Journey as a Construction Engineer",
    description:
      "How I landed my dream job in Dubai and built a successful career abroad. After years of hard work and dedication, I'm now leading major construction projects in the UAE.",
    author: "Rajesh Kumar",
    authorRole: "Construction Engineer",
    authorLocation: "Dubai, UAE",
    date: "2 days ago",
    readTime: "5 min read",
    category: "Construction",
    likes: 234,
    shares: 45,
    comments: 12,
    image: "/images/stories/rajesh.jpg",
    avatar: "/images/avatars/rajesh.jpg",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: 2,
    type: "Local Success",
    title: "Breaking Into Tech: My Career Switch Story",
    description:
      "From accountant to software developer - my journey of transformation. Learning to code changed my life and opened doors to opportunities I never imagined possible.",
    author: "Priya Fernando",
    authorRole: "Software Developer",
    authorLocation: "Colombo, Sri Lanka",
    date: "1 week ago",
    readTime: "4 min read",
    category: "Technology",
    likes: 156,
    shares: 28,
    comments: 8,
    image: "/images/stories/priya.jpg",
    avatar: "/images/avatars/priya.jpg",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    id: 3,
    type: "Overseas Success",
    title: "Nursing Career in the UK: Challenges and Triumphs",
    description:
      "My experience working as a registered nurse in London healthcare system. From adapting to a new culture to excelling in the NHS, this journey has been incredibly rewarding.",
    author: "Ayisha Perera",
    authorRole: "Registered Nurse",
    authorLocation: "London, UK",
    date: "2 weeks ago",
    readTime: "6 min read",
    category: "Healthcare",
    likes: 312,
    shares: 67,
    comments: 23,
    image: "/images/stories/ayisha.jpg",
    avatar: "/images/avatars/ayisha.jpg",
    color: "from-purple-500 to-purple-700",
  },
  {
    id: 4,
    type: "Local Success",
    title: "From Hospitality to Corporate: My Marketing Journey",
    description:
      "How I transitioned from hotel management to digital marketing. With determination and continuous learning, I now lead marketing campaigns for top brands in Sri Lanka.",
    author: "Nuwan Perera",
    authorRole: "Marketing Manager",
    authorLocation: "Kandy, Sri Lanka",
    date: "3 weeks ago",
    readTime: "4 min read",
    category: "Marketing",
    likes: 89,
    shares: 15,
    comments: 5,
    image: "/images/stories/nuwan.jpg",
    avatar: "/images/avatars/nuwan.jpg",
    color: "from-amber-500 to-amber-700",
  },
  {
    id: 5,
    type: "Overseas Success",
    title: "IT Professional's Journey to Singapore",
    description:
      "How I built a successful tech career in Southeast Asia's hub. From a junior developer to tech lead, Singapore offered the perfect platform for growth.",
    author: "Tharindu Silva",
    authorRole: "Tech Lead",
    authorLocation: "Singapore",
    date: "1 month ago",
    readTime: "7 min read",
    category: "Technology",
    likes: 178,
    shares: 34,
    comments: 11,
    image: "/images/stories/tharindu.jpg",
    avatar: "/images/avatars/tharindu.jpg",
    color: "from-indigo-500 to-indigo-700",
  },
  {
    id: 6,
    type: "Local Success",
    title: "Entrepreneurship: Building a Startup in Colombo",
    description:
      "From idea to execution - my journey as a first-time founder. Building a tech startup in Sri Lanka came with challenges, but the support from the local ecosystem made it possible.",
    author: "Dilini Jayawardena",
    authorRole: "Founder",
    authorLocation: "Colombo, Sri Lanka",
    date: "1 month ago",
    readTime: "8 min read",
    category: "Entrepreneurship",
    likes: 203,
    shares: 42,
    comments: 17,
    image: "/images/stories/dilini.jpg",
    avatar: "/images/avatars/dilini.jpg",
    color: "from-rose-500 to-rose-700",
  },
  {
    id: 7,
    type: "Overseas Success",
    title: "Teaching English in Japan: A Cultural Adventure",
    description:
      "My experience as an English teacher in the Japanese education system. Immersing myself in Japanese culture while teaching has been the adventure of a lifetime.",
    author: "Kasun Weerasinghe",
    authorRole: "English Teacher",
    authorLocation: "Tokyo, Japan",
    date: "2 months ago",
    readTime: "5 min read",
    category: "Education",
    likes: 145,
    shares: 23,
    comments: 9,
    image: "/images/stories/kasun.jpg",
    avatar: "/images/avatars/kasun.jpg",
    color: "from-red-500 to-red-700",
  },
  {
    id: 8,
    type: "Local Success",
    title: "Sustainable Farming: Returning to My Roots",
    description:
      "How I left my corporate job to start an organic farm in Sri Lanka. Now I'm not only producing healthy food but also creating jobs in my hometown.",
    author: "Chamari Ratnayake",
    authorRole: "Organic Farmer",
    authorLocation: "Kurunegala, Sri Lanka",
    date: "2 months ago",
    readTime: "6 min read",
    category: "Agriculture",
    likes: 267,
    shares: 89,
    comments: 31,
    image: "/images/stories/chamari.jpg",
    avatar: "/images/avatars/chamari.jpg",
    color: "from-green-500 to-green-700",
  },
  {
    id: 9,
    type: "Overseas Success",
    title: "Accounting Career in Australia",
    description:
      "From Sri Lanka to Sydney: My journey to becoming a CPA. The Australian accounting industry welcomed me with open arms and provided amazing growth opportunities.",
    author: "Saman Fernando",
    authorRole: "CPA Accountant",
    authorLocation: "Sydney, Australia",
    date: "3 months ago",
    readTime: "5 min read",
    category: "Finance",
    likes: 112,
    shares: 18,
    comments: 6,
    image: "/images/stories/saman.jpg",
    avatar: "/images/avatars/saman.jpg",
    color: "from-cyan-500 to-cyan-700",
  },
  {
    id: 10,
    type: "Local Success",
    title: "Graphic Design: Freelancing from Anywhere",
    description:
      "How I built a successful freelance design business in Sri Lanka. Working with international clients while enjoying the beauty of my home country.",
    author: "Nadeesha Gamage",
    authorRole: "Graphic Designer",
    authorLocation: "Galle, Sri Lanka",
    date: "3 months ago",
    readTime: "4 min read",
    category: "Design",
    likes: 98,
    shares: 21,
    comments: 7,
    image: "/images/stories/nadeesha.jpg",
    avatar: "/images/avatars/nadeesha.jpg",
    color: "from-pink-500 to-pink-700",
  },
  {
    id: 11,
    type: "Overseas Success",
    title: "Engineering Career in Germany",
    description:
      "My experience working as a mechanical engineer in Berlin. German engineering excellence and work-life balance have transformed my career perspective.",
    author: "Ravi de Silva",
    authorRole: "Mechanical Engineer",
    authorLocation: "Berlin, Germany",
    date: "4 months ago",
    readTime: "6 min read",
    category: "Engineering",
    likes: 134,
    shares: 27,
    comments: 14,
    image: "/images/stories/ravi.jpg",
    avatar: "/images/avatars/ravi.jpg",
    color: "from-yellow-500 to-yellow-700",
  },
  {
    id: 12,
    type: "Local Success",
    title: "Healthcare: Starting a Clinic in Rural Sri Lanka",
    description:
      "My mission to provide healthcare access to underserved communities. Every day I see the impact of bringing medical services to those who need it most.",
    author: "Dr. Kumari Silva",
    authorRole: "Medical Doctor",
    authorLocation: "Anuradhapura, Sri Lanka",
    date: "4 months ago",
    readTime: "7 min read",
    category: "Healthcare",
    likes: 423,
    shares: 156,
    comments: 47,
    image: "/images/stories/kumari.jpg",
    avatar: "/images/avatars/kumari.jpg",
    color: "from-teal-500 to-teal-700",
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

export default function StoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [likedStories, setLikedStories] = useState<number[]>([]);
  const storiesPerPage = 6; // 6 stories per page (2 rows of 3)
  const totalStories = storiesData.length;
  const totalPages = Math.ceil(totalStories / storiesPerPage);

  // Get current stories
  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = storiesData.slice(indexOfFirstStory, indexOfLastStory);

  const goToPage = (page: number) => {
    const newPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(newPage);
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLike = (storyId: number) => {
    setLikedStories((prev) =>
      prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId],
    );
  };

  const handleShare = (story: (typeof storiesData)[0]) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
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
          <span className="text-primary"> Stories</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Real experiences from job seekers who found their dream careers.
        </p>
      </motion.div> */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-4 py-8 px-4 sm:px-6 lg:px-8 border-b relative bg-linear-to-b from-rose-500 via-rose-600 to-rose-700 rounded-b-lg"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 relative text-background/90">
          ගොඩයන
          <span className="text-background/90"> Stories</span>
        </h1>
        <p className="text-background/80 relative">
          Real experiences from job seekers who found their dream careers.
        </p>
      </motion.div>

      {/* Stories Grid */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentStories.map((story) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group h-full"
            >
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col py-0">
                {/* Story Header with Gradient - Fixed height */}
                <div
                  className={`bg-gradient-to-r ${story.color} p-5 text-white min-h-[120px] flex flex-col justify-between`}
                >
                  <div className="flex items-start justify-between">
                    <Badge className="bg-white/20 text-white border-0">
                      {story.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-white/10 text-white border-white/20"
                    >
                      {story.category}
                    </Badge>
                  </div>
                  {/* Author Info - Single row with left text and right avatar */}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    {/* Left side - Author name and role */}
                    <div className="flex-col min-w-0">
                      <div className="pb-4">
                        <p className="font-bold text-lg truncate">
                          {story.author}
                        </p>
                        <p className="text-xs text-background/90 truncate">
                          {story.authorRole}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-md font-bold line-clamp-2">
                          {story.title}
                        </h5>
                      </div>
                    </div>

                    {/* Right side - Avatar */}
                    <Avatar className="h-30 w-30 border-2 border-background/50 shrink-0">
                      <AvatarFallback className="bg-background/20 text-background">
                        {story.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <CardContent className="px-5 flex flex-col flex-1">
                  {/* Full Description - Fixed height with scroll if needed */}
                  <div className="min-h-20 max-h-20 overflow-y-auto mb-4 pr-1 scrollbar-thin">
                    <p className="text-muted-foreground text-sm">
                      {story.description}
                    </p>
                  </div>

                  {/* Location and Date - Fixed height with auto margins */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 min-h-[20px]">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[120px]">
                        {story.authorLocation}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3" />
                      <span>{story.date}</span>
                    </div>
                  </div>

                  {/* Like & Share Buttons - Always at bottom */}
                  <div className="flex items-center justify-between py-3 border-t mt-auto">
                    <div className="flex items-center gap-4">
                      <motion.button
                        onClick={() => handleLike(story.id)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedStories.includes(story.id)
                              ? "fill-primary text-primary"
                              : ""
                          }`}
                        />
                        <span>
                          {story.likes +
                            (likedStories.includes(story.id) ? 1 : 0)}
                        </span>
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <motion.button
                        onClick={() => handleShare(story)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>{story.shares}</span>
                      </motion.button>
                      {/* <div className="flex gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{story.comments}</span>
                      </div> */}
                    </div>
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

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-8 w-8 rounded-full text-sm font-medium transition-all duration-300 ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                ),
              )}
            </div>

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

        {/* Stories Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Showing {indexOfFirstStory + 1}-
          {Math.min(indexOfLastStory, totalStories)} of {totalStories} success
          stories
        </motion.div>
      </div>
    </div>
  );
}
