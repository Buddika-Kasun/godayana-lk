"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com/godayanalk",
    label: "Facebook",
    color: "hover:text-[#1877F2]",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/godayanalk",
    label: "Instagram",
    color: "hover:text-[#E4405F]",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/godayanalk",
    label: "LinkedIn",
    color: "hover:text-[#0A66C2]",
  },
  {
    icon: MessageCircle,
    href: "https://wa.me/94112345678",
    label: "WhatsApp",
    color: "hover:text-[#25D366]",
  },
];

const quickLinks = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Visa Guides", href: "/visa" },
  { label: "Migration Courses", href: "/courses" },
  { label: "Explore Countries", href: "/countries" },
  { label: "Godayana Gateway", href: "/gateway" },
];

const supportLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "FAQs", href: "/faqs" },
];

// Animation variants with proper typing
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const socialVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      delay: i * 0.1,
    },
  }),
};

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative from-background to-muted/30 border-t ">
      {/* Scroll to top button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{
          y: [0, -8, 0, -4, 0],
          scale: [1, 1.1, 1, 1.05, 1],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
        }}
        transition={{ delay: 1 }}
        onClick={scrollToTop}
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-10 cursor-pointer"
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-8 max-w-[100vw] overflow-x-hidden">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 space-y-6 text-center lg:text-left"
          >
            <Link href="/" className="inline-block">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-bold mb-8 bg-clip-text inline-flex items-center"
              >
                <span className="bg-primary px-2 py-0.5 rounded-sm mr-2 text-background">
                  G
                </span>
                <span className="bg-gradient-to-r text-primary bg-clip-text">
                  Godayana
                </span>
                <span className="text-gray-400">.lk</span>
              </motion.span>
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
              Sri Lanka&apos;s leading platform for global migration, job
              opportunities, and professional growth. Empowering youth to reach
              their global potential.
            </p>

            {/* Social Links - Centered on mobile */}
            <div className="flex justify-center lg:justify-start space-x-4 mt-8">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={index}
                  variants={socialVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -1, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-2 rounded-full bg-background text-muted-foreground transition-all duration-75 ease-in-out",
                    social.color,
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 text-center lg:text-left"
          >
            <h3 className="text-lg font-semibold mb-8 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li key={link.label} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    <motion.span whileHover={{ x: 4 }} className="inline-block">
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 text-center lg:text-left"
          >
            <h3 className="text-lg font-semibold mb-8 text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <motion.li key={link.label} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    <motion.span whileHover={{ x: 4 }} className="inline-block">
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Newsletter */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 space-y-6 text-center lg:text-left"
          >
            <div>
              <h3 className="text-lg font-semibold mb-8 text-foreground">
                Contact
              </h3>
              <ul className="space-y-3">
                <motion.li
                  whileHover={{ x: 4 }}
                  className="flex items-center lg:items-start justify-center lg:justify-start space-x-3 text-muted-foreground"
                >
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>
                    <a
                      href="tel:+94112345678"
                      className="hover:text-primary transition-colors"
                    >
                      +94 11 234 5678
                    </a>
                  </span>
                </motion.li>

                <motion.li
                  whileHover={{ x: 4 }}
                  className="flex items-center lg:items-start justify-center lg:justify-start space-x-3 text-muted-foreground"
                >
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>
                    <a
                      href="mailto:info@godayana.lk"
                      className="hover:text-primary transition-colors"
                    >
                      info@godayana.lk
                    </a>
                  </span>
                </motion.li>

                <motion.li
                  whileHover={{ x: 4 }}
                  className="flex items-center lg:items-start justify-center lg:justify-start space-x-3 text-muted-foreground"
                >
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <span className="leading-relaxed text-left">
                    Level 12, West Tower,
                    <br />
                    World Trade Center,
                    <br />
                    Colombo 01, Sri Lanka
                  </span>
                </motion.li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-muted/50 rounded-lg p-4 mt-8">
              <h4 className="font-medium mb-2 text-foreground">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get latest jobs and visa updates
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 max-w-md mx-auto lg:mx-0">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-background w-full"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <Button className="bg-primary text-background hover:opacity-90 cursor-pointer px-4 whitespace-nowrap w-full sm:w-auto">
                    Subscribe
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Godayana.lk. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center space-x-4 md:space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cookies
            </Link>
            <Link
              href="/sitemap"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
