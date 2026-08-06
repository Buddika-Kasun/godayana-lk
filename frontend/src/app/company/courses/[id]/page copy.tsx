// src/app/company/courses/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CourseDetailsView } from "@/components/courses/CourseDetailsView";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the CourseDetails interface
interface CourseDetails {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  enrollType: "online" | "physical";
  location?: string;
  instructor: string;
  instructorBio?: string;
  instructorAvatar?: string;
  price: number;
  originalPrice?: number;
  startDate: string;
  endDate: string;
  duration: string;
  schedule?: string;
  enrolledStudents: number;
  maxStudents: number;
  views: number;
  rating?: number;
  reviews?: number;
  description: string;
  curriculum: {
    modules: {
      title: string;
      lessons: {
        title: string;
        duration: string;
        isPreview?: boolean;
      }[];
    }[];
  };
  requirements: string[];
  learningOutcomes: string[];
  includes: string[];
  targetAudience: string[];
  certificate: boolean;
  certificateType?: string;
  company: string;
  companyDescription: string;
  companyLogo?: string;
  companyWebsite?: string;
  contactEmail: string;
  contactPhone?: string;
  postedDate: string;
  lastUpdated?: string;
  isEnrolled?: boolean;
  isSaved?: boolean;
}

// Mock data - replace with API call
const getCourseDetails = (courseId: number): CourseDetails => {
  return {
    id: courseId,
    title: "Advanced Web Development Bootcamp",
    category: "programming",
    categoryLabel: "Programming & Development",
    enrollType: "physical",
    location: "123 Main Street, Colombo 03, Sri Lanka",
    instructor: "Dr. Sanath Jayasuriya",
    instructorBio:
      "Senior Software Architect with 15+ years of experience in full-stack development. Has trained over 2000+ students.",
    instructorAvatar: "",
    price: 45000,
    originalPrice: 65000,
    startDate: "2025-01-15",
    endDate: "2025-03-15",
    duration: "8 weeks",
    schedule:
      "Monday & Wednesday, 6:00 PM - 8:00 PM | Saturday, 9:00 AM - 1:00 PM",
    enrolledStudents: 45,
    maxStudents: 60,
    views: 320,
    rating: 4.8,
    reviews: 127,
    description: `This comprehensive 8-week bootcamp is designed to take you from intermediate to advanced level in web development. You'll master modern frameworks, backend development, and deployment strategies.

The course emphasizes hands-on learning with real-world projects. By the end, you'll have built a complete full-stack application and learned industry best practices.

**What makes this course unique:**
- Live coding sessions with expert instructors
- Real-world projects that simulate actual work environments
- One-on-one mentorship sessions
- Career guidance and interview preparation
- Access to exclusive developer community

**Teaching Methodology:**
- 40% theory with practical examples
- 60% hands-on coding and project work
- Weekly coding challenges and assignments
- Group projects to simulate team environments
- Final capstone project presentation

**Tools and Technologies You'll Use:**
- VS Code and modern development tools
- Git & GitHub for version control
- Docker for containerization
- CI/CD pipelines
- Cloud deployment (AWS/Azure)`,
    curriculum: {
      modules: [
        {
          title: "Modern JavaScript Deep Dive",
          lessons: [
            {
              title: "ES6+ Features and Best Practices",
              duration: "2 hours",
              isPreview: true,
            },
            {
              title: "Async JavaScript: Promises, Async/Await",
              duration: "2.5 hours",
            },
            { title: "Design Patterns in JavaScript", duration: "2 hours" },
            {
              title: "Testing with Jest and React Testing Library",
              duration: "2 hours",
            },
          ],
        },
        {
          title: "Advanced React & Next.js",
          lessons: [
            {
              title: "React Hooks Deep Dive",
              duration: "3 hours",
              isPreview: true,
            },
            {
              title: "State Management with Redux Toolkit",
              duration: "2.5 hours",
            },
            {
              title: "Server Components and Server Actions",
              duration: "2 hours",
            },
            {
              title: "Performance Optimization Techniques",
              duration: "2.5 hours",
            },
          ],
        },
        {
          title: "Backend Development with Node.js",
          lessons: [
            { title: "Building RESTful APIs", duration: "3 hours" },
            {
              title: "Authentication and Authorization",
              duration: "2.5 hours",
            },
            { title: "Database Design with PostgreSQL", duration: "2.5 hours" },
            { title: "WebSockets and Real-time Features", duration: "2 hours" },
          ],
        },
        {
          title: "Deployment & DevOps",
          lessons: [
            { title: "Docker Containerization", duration: "2 hours" },
            { title: "CI/CD with GitHub Actions", duration: "2 hours" },
            { title: "Cloud Deployment (AWS)", duration: "3 hours" },
            { title: "Monitoring and Logging", duration: "1.5 hours" },
          ],
        },
      ],
    },
    requirements: [
      "Strong understanding of HTML, CSS, and JavaScript fundamentals",
      "Basic knowledge of React or any modern framework",
      "Familiarity with command line and Git",
      "Laptop with minimum 8GB RAM and 50GB free space",
      "Willingness to commit 15-20 hours per week",
    ],
    learningOutcomes: [
      "Build and deploy production-ready full-stack applications",
      "Master modern React with hooks and context API",
      "Create RESTful APIs and GraphQL services",
      "Implement authentication and authorization systems",
      "Write comprehensive tests for frontend and backend",
      "Deploy applications using Docker and cloud platforms",
      "Optimize application performance and SEO",
      "Work effectively in agile development teams",
    ],
    includes: [
      "80+ hours of live instruction",
      "20+ hands-on coding projects",
      "Course certificate upon completion",
      "Lifetime access to recorded sessions",
      "Access to private Discord community",
      "1-on-1 mentorship sessions",
      "Resume review and career coaching",
      "Interview preparation materials",
    ],
    targetAudience: [
      "Intermediate developers looking to advance their skills",
      "Computer science students seeking practical experience",
      "Self-taught programmers wanting structured learning",
      "Career changers with basic programming knowledge",
    ],
    certificate: true,
    certificateType: "Professional Certificate in Advanced Web Development",
    company: "Tech Academy Sri Lanka",
    companyDescription:
      "Tech Academy is Sri Lanka's leading provider of professional IT training. With over 10 years of experience, we've trained more than 10,000 students who now work at top tech companies worldwide.",
    companyLogo: "",
    companyWebsite: "https://techacademy.lk",
    contactEmail: "courses@techacademy.lk",
    contactPhone: "+94 11 234 5678",
    postedDate: "2024-12-01",
    lastUpdated: "2024-12-15",
    isEnrolled: false,
    isSaved: false,
  };
};

export default function CourseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchCourse = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        const courseId = parseInt(params.id as string);
        const courseData = getCourseDetails(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold">View Course Details</h2>
        </div>

        <div className="space-y-6 p-4">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4 pb-4 border-b">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold">View Course Details</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="bg-primary/10 rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-primary/20 cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold">View Course Details</h2>
      </div>

      <div className="bg-primary/4 rounded-4xl p-4 border border-primary/14">
        <CourseDetailsView course={course} />
      </div>
    </div>
  );
}
