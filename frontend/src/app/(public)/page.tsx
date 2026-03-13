import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, BookOpen, Plane, Users, MapPin, DollarSign, Clock, TrendingUp, Award, Globe } from 'lucide-react'
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'

// Hardcoded data for now
const featuredJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Lanka',
    location: 'Colombo',
    type: 'Full-time',
    salary: 'Rs 250,000 - 350,000',
    postedAt: '2024-03-10',
    isOverseas: false,
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company: 'Global Brands International',
    location: 'Dubai',
    type: 'Full-time',
    salary: 'AED 15,000 - 20,000',
    postedAt: '2024-03-09',
    isOverseas: true,
    country: 'UAE',
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'Kandy',
    type: 'Remote',
    salary: 'Rs 150,000 - 200,000',
    postedAt: '2024-03-08',
    isOverseas: false,
  },
  {
    id: '4',
    title: 'Registered Nurse',
    company: 'Healthcare UK',
    location: 'London',
    type: 'Full-time',
    salary: '£30,000 - £40,000',
    postedAt: '2024-03-07',
    isOverseas: true,
    country: 'UK',
  },
]

const featuredCourses = [
  {
    id: 'c1',
    title: 'IELTS Preparation Course',
    provider: 'British Council',
    duration: '3 months',
    price: 35000,
    level: 'Intermediate',
  },
  {
    id: 'c2',
    title: 'Full Stack Web Development',
    provider: 'Code Academy Sri Lanka',
    duration: '6 months',
    price: 85000,
    level: 'Beginner',
  },
  {
    id: 'c3',
    title: 'Digital Marketing Masterclass',
    provider: 'Digital Marketing Institute',
    duration: '4 months',
    price: 45000,
    level: 'Intermediate',
  },
]

const stats = [
  { label: 'Active Jobs', value: '2,500+', icon: Briefcase },
  { label: 'Companies', value: '1,200+', icon: Users },
  { label: 'Overseas Jobs', value: '500+', icon: Globe },
  { label: 'Courses', value: '300+', icon: BookOpen },
]

const categories = [
  { name: 'Information Technology', count: 850, icon: Briefcase },
  { name: 'Healthcare', count: 420, icon: Award },
  { name: 'Engineering', count: 380, icon: TrendingUp },
  { name: 'Hospitality', count: 290, icon: Users },
  { name: 'Education', count: 310, icon: BookOpen },
  { name: 'Marketing', count: 275, icon: TrendingUp },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Feature Section */}
      <Features />

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link href={`/jobs?category=${category.name}`} key={index}>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <category.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <Link href="/jobs" className="text-blue-600 hover:underline font-medium">
              View All Jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map((job) => (
              <Link href={`/jobs/${job.id}`} key={job.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      {job.isOverseas && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {job.country}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Posted {job.postedAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <Link href="/courses" className="text-blue-600 hover:underline font-medium">
              View All Courses →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <p className="text-sm text-gray-600">{course.provider}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Level:</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-blue-600">
                          Rs {course.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Enroll Now</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals who found their dream jobs through Godayana.lk
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Create Free Account
              </Button>
            </Link>
            <Link href="/company/post-job">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}