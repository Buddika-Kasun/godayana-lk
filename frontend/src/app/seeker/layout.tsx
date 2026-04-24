// src/app/seeker/layout.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Heart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/useAuth";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/seeker/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/seeker/profile", icon: User },
  { name: "Applications", href: "/seeker/applications", icon: FileText },
  { name: "Enrollments", href: "/seeker/enrollments", icon: Heart },
  { name: "Payments", href: "/seeker/payments", icon: Coins },
];

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);
  const initComplete = useRef(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSidebarOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Check authorization and redirect - only once
  useEffect(() => {
    // Prevent duplicate execution in Strict Mode
    if (initComplete.current) return;

    if (!isLoading && !hasRedirected.current) {
      initComplete.current = true;

      if (!isAuthenticated) {
        hasRedirected.current = true;
        setTimeout(() => {
          setRedirectMessage("Please login to access this page");
          setShowRedirectMessage(true);
          setShowRedirectMessage(true);
        }, 0);
        setTimeout(() => {
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }, 2000);
      } else if (user?.role !== "seeker" && user?.role !== "dev") {
        hasRedirected.current = true;
        setTimeout(() => {
          setRedirectMessage("Access denied. Seeker only area.");
          setShowRedirectMessage(true);
        }, 0);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname]);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event("authLogout"));
    router.push("/");
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  // Show redirect message screen
  if (showRedirectMessage) {
    return <LoadingScreen message={redirectMessage} />;
  }

  // Don't render if not authorized
  if (!isAuthenticated || (user?.role !== "seeker" && user?.role !== "dev")) {
    return null;
  }

  const getTitle = () => {
    const currentItem = navItems.find((item) => item.href === pathname);
    switch (currentItem?.name) {
        case "Dashboard":
            return (
              <>
                Welcome back,{" "}
                <span className="text-primary">
                  {user?.name?.split(" ")[0] || "User"}
                </span>{" "}
                !
              </>
            );
        case "Profile":
            return "My Profile";
        case "Applications":
            return "My Applications";
        case "Enrollments":
            return "My Enrollments";
        case "Payments":
            return "My Payments History";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b transition-shadow",
          scrolled && "shadow-md",
        )}
      >
        <div className="flex items-center justify-between pl-4 pr-2 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0"
          >
            <Link href="/" className="shrink-0 block">
              <motion.div
                whileHover="hover"
                initial="initial"
                className="text-2xl md:text-3xl font-bold inline-flex items-center"
              >
                <motion.span
                  className="bg-primary px-2 py-0.5 rounded-sm mx-2 text-background inline-block"
                  variants={{
                    initial: { rotate: 0 },
                    hover: { rotate: -45 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  G
                </motion.span>
                <span className="bg-gradient-to-r text-primary bg-clip-text">
                  Godayana
                </span>
                <span className="text-secondary">.lk</span>
              </motion.div>
            </Link>
          </motion.div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-[calc(100vh)] bg-background border-r transition-transform duration-300 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 py-4 px-2 border-b">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0"
          >
            <Link href="/" className="shrink-0 block">
              <motion.div
                whileHover="hover"
                initial="initial"
                className="text-2xl md:text-3xl font-bold inline-flex items-center"
              >
                <motion.span
                  className="bg-primary px-2 py-0.5 rounded-sm mx-2 text-background inline-block"
                  variants={{
                    initial: { rotate: 0 },
                    hover: { rotate: -45 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  G
                </motion.span>
                <span className="bg-gradient-to-r text-primary bg-clip-text">
                  Godayana
                </span>
                <span className="text-secondary">.lk</span>
              </motion.div>
            </Link>
          </motion.div>
          <div className="bg-primary/10 flex items-center rounded-full">
            <ThemeSwitcher />
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14 border-2 border-primary/20">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">
                {user?.name || "User"}
              </h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 p-3 text-xs">
                Job Seeker
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10",
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "lg:ml-72 pt-16 lg:pt-0",
        )}
      >
        {/* Desktop Header */}
        <div
          className={cn(
            "hidden lg:block sticky top-0 z-20 bg-background border-b transition-shadow",
            scrolled && "shadow-md",
          )}
        >
          <div className="flex items-center justify-between px-8 pt-5 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground pl-2">
                {getTitle()}
              </h1>
              {/* <p className="text-sm text-muted-foreground mt-1">
                You&apos;re welcome to exploring what you just search.
              </p> */}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-gray-50 dark:bg-gray-900"
                />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-primary cursor-pointer">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div>
          <h1 className="lg:hidden pt-4 pb-2 text-xl font-bold text-foreground text-center">{getTitle()}</h1>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:px-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t z-30">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon size={20} />
                <span className="text-xs">{item.name}</span>
                {item.badge && (
                  <Badge variant="default" className="text-xs -mt-1">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div> */}

      {/* Add padding for mobile bottom nav */}
      <div className="lg:hidden h-4" />
    </div>
  );
}
