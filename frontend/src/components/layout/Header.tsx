"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Menu,
  X,
  Briefcase,
  BookOpen,
  Plane,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
import BrandText from "../ui/brandText";
import { useMobileNav } from "@/context/MobileNavContext";

const navigation = [
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Visa", href: "/visa", icon: Plane },
  { name: "Gateway", href: "/gateway", icon: Globe },
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
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
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

  // Close mobile menu when route changes - using ref to compare previous pathname
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpen(false);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className={cn(
          "fixed top-0 w-full max-w-screen overflow-hidden z-50 transition-all duration-300",
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
              className="flex-shrink-0"
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
                  <span className="text-gray-400">.lk</span>
                </motion.div>
              </Link>
            </motion.div>

            {/* <BrandText /> */}

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
                    className="relative px-2 py-2"
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
                      <item.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[14px] opacity-100 font-bold -mb-1 font-fm-gamunu tracking-wider">
                          ගොඩයන
                        </span>
                        <span className="text-sm font-medium  w-full">
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

            {/* Desktop Right Section - Fixed width */}
            <div className="hidden md:flex items-center justify-end space-x-3 min-w-[180px]">
              <ThemeSwitcher />

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

      {/* Mobile Menu Overlay */}
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
                className="fixed top-16 right-0 bottom-0 w-full border-l shadow-xl z-40 md:hidden"
              >
                <div className="p-6 space-y-6 flex-col h-full flex justify-between">
                  {/* Navigation Links */}
                  <div className="space-y-2">
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

                    {/* Mobile Auth Buttons */}
                    <div className="gap-4 pb-4 flex flex-col">
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="w-full"
                        >
                          <Button variant="outline" className="w-full">
                            Login
                          </Button>
                        </motion.div>
                      </Link>

                      <Link
                        href="/company/post-job"
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="w-full"
                        >
                          <Button className="w-full bg-primary text-background">
                            Post a Job
                          </Button>
                        </motion.div>
                      </Link>
                    </div>

                    {/* Quick Info */}
                    <div className="pt-4 text-sm text-muted-foreground">
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
