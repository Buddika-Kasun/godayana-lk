"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Menu,
  X,
  Briefcase,
  BookOpen,
  Plane,
  Users,
  Globe,
  User,
  LogOut,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import { useMobileNav } from "@/context/MobileNavContext";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "seeker" | "company";
  avatar?: string;
}

const navigation = [
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Visa", href: "/visa", icon: Plane },
  { name: "Countries", href: "/countries", icon: Globe },
  { name: "Gateway", href: "/gateway", icon: Users },
  { name: "Stories", href: "/stories", icon: Users },
];

// Animation variants
const headerVariants: Variants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const mobileMenuVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    x: "100%",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const mobileItemVariants: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.1 },
  }),
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const prevPathnameRef = useRef(pathname);
  const { user, isAuthenticated, logout } = useAuth();
  const { setIsMobileNavOpen } = useMobileNav();

  // Update context when mobile nav opens/closes
  useEffect(() => {
    setIsMobileNavOpen(isOpen);
  }, [isOpen, setIsMobileNavOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    const currentPathname = pathname;
    const previousPathname = prevPathnameRef.current;

    if (previousPathname !== currentPathname && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    prevPathnameRef.current = currentPathname;
  }, [pathname, isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "seeker") {
      return "/seeker/dashboard";
    } else if (user?.role === "company") {
      return "/company/dashboard";
    } else if (user?.role === "admin") {
      return "/admin/dashboard";
    }
    return "/seeker/dashboard";
  };

  const getRole = () => {
    if (user?.role === "seeker") {
      return "Job Seeker";
    } else if (user?.role === "company") {
      return "Company";
    } else if (user?.role === "admin") {
      return "Admin";
    } else if (user?.role === "dev") {
      return "Developer";
    }
  };

  const getAvatarContent = () => {
    if (user?.avatar) {
      return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      );
    }

    if (user?.name) {
      return (
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20">
          <span className="text-primary font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20">
        <User className="h-5 w-5 text-primary" />
      </div>
    );
  };

  const getMobileAvatarContent = () => {
    if (user?.avatar) {
      return (
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
      );
    }

    if (user?.name) {
      return (
        <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
          <span className="text-primary font-bold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
        <User className="h-6 w-6 text-primary" />
      </div>
    );
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className={cn(
          "fixed top-0 w-full max-w-screen overflow-visible z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
            : "bg-background border-b",
        )}
      >
        <nav className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Left side */}
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

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center justify-end mr-4 flex-1 space-x-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-1 py-2"
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={cn(
                        "flex items-center text-sm font-medium transition-colors bg-primary/5 rounded-md px-3 py-1",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-2 shrink-0" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[14px] opacity-100 font-bold -mb-1 font-fm-gamunu tracking-wider">
                          ගොඩයන
                        </span>
                        <span className="text-sm font-medium w-full">
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center justify-end space-x-3 min-w-[180px]">
              <ThemeSwitcher />

              {user ? (
                // User is logged in - Show profile dropdown
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    {getAvatarContent()}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isDropdownOpen && "rotate-180",
                      )}
                    />
                  </motion.button>

                  {/* Dropdown Menu - Fixed positioning to ensure visibility */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-background rounded-lg shadow-lg py-2 border z-[100] overflow-visible"
                        style={{ position: "absolute", top: "100%", right: 0 }}
                      >
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {getRole()}
                          </span>
                        </div>

                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/20 rounded-md mx-2 mt-2 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Building2 size={16} />
                          Dashboard
                        </Link>

                        <Link
                          href="/seeker/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-primary/20 rounded-md mx-2 mt-1 mb-2 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User size={16} />
                          Profile Settings
                        </Link>

                        <hr className="my-1" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800  transition-colors w-full text-left mx-2 mt-2 rounded-md cursor-pointer"
                          style={{ width: "calc(100% - 1rem)" }}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // User is not logged in - Show login and post job buttons
                <>
                  <Link href="/auth/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        className="text-muted-foreground hover:text-primary whitespace-nowrap cursor-pointer"
                      >
                        Login
                      </Button>
                    </motion.div>
                  </Link>

                  <Link href="/company/post-job">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Button
                        size="lg"
                        className="bg-primary text-background hover:opacity-90 whitespace-nowrap cursor-pointer px-4"
                      >
                        Post a Job
                      </Button>
                      <motion.div
                        className="absolute -inset-1 bg-primary rounded-lg opacity-30 blur -z-10"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    </motion.div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeSwitcher />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
                ) : (
                  <Menu className="h-6 w-6 text-muted-foreground hover:text-primary cursor-pointer" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <div className="max-w-screen w-full h-full max-h-screen overflow-hidden">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-background/90 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-16 right-0 bottom-0 w-full border-l  shadow-xl z-40 md:hidden overflow-y-auto"
              >
                <div className="px-6 py-4 space-y-6 flex-col h-full flex justify-between">
                  {/* User Info - Mobile */}
                  {user && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 rounded-lg p-4 mb-4"
                    >
                      <div className="flex items-center gap-3">
                        {getMobileAvatarContent()}
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                            {user.role === "seeker" ? "Job Seeker" : "Company"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Links */}
                  <div className="space-y-2 flex-1">
                    {navigation.map((item, index) => {
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      return (
                        <motion.div
                          key={item.name}
                          custom={index}
                          variants={mobileItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground bg-primary/5 hover:bg-muted",
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">
                              <span className="text-[18px] opacity-100 font-semibold font-fm-gamunu tracking-widest">
                                ගොඩයන
                              </span>{" "}
                              &nbsp;
                              {item.name}
                            </span>
                            {isActive && (
                              <motion.div
                                layoutId="mobile-active"
                                className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div>
                    {/* Divider */}
                    <div className="border-t border-border pb-8" />

                    {/* Mobile Auth Buttons or User Actions */}
                    <div className="gap-4 pb-4 flex flex-col">
                      {user ? (
                        <>
                          <Link
                            href={getDashboardLink()}
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button className="w-full bg-primary text-background">
                                Dashboard
                              </Button>
                            </motion.div>
                          </Link>

                          <Link
                            href="/seeker/profile"
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button variant="outline" className="w-full">
                                Profile Settings
                              </Button>
                            </motion.div>
                          </Link>

                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="destructive"
                              className="w-full"
                              onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                              }}
                            >
                              Logout
                            </Button>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/auth/login"
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button variant="outline" className="w-full">
                                Login
                              </Button>
                            </motion.div>
                          </Link>

                          <Link
                            href="/company/post-job"
                            onClick={() => setIsOpen(false)}
                          >
                            <motion.div whileTap={{ scale: 0.95 }}>
                              <Button className="w-full bg-primary text-background">
                                Post a Job
                              </Button>
                            </motion.div>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Quick Info */}
                    <div className="py-4 text-sm text-muted-foreground">
                      <p className="text-center">
                        Sri Lanka&apos;s leading platform for global
                        opportunities
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
