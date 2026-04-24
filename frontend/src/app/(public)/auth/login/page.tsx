"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "", // This will hold either Email or Phone
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get the redirect URL from query params or default to dashboard
  const redirectTo = searchParams.get("redirect") || "/";

  // Validation functions
  const validateIdentifier = (identifier: string) => {
    if (!identifier) return "Email or phone number is required";

    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if it's a phone number (basic validation)
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      return "Please enter a valid email or phone number";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "identifier":
        return validateIdentifier(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const identifierError = validateIdentifier(formData.identifier);
    const passwordError = validatePassword(formData.password);

    const newErrors: Record<string, string> = {};
    if (identifierError) newErrors.identifier = identifierError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    setTouched({ identifier: true, password: true });

    if (Object.keys(newErrors).length === 0) {
      const result = await login(formData.identifier, formData.password);

      if (result.success) {
        toast.success("Login successful!");
        router.push(redirectTo);
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    }
  };

  // Determine icon based on input value
  const getIdentifierIcon = () => {
    if (formData.identifier.includes("@")) {
      return <Mail size={18} />;
    } else if (formData.identifier.length > 0) {
      return <Phone size={18} />;
    }
    return <Mail size={18} />;
  };

  return (
    <>
      <Toaster />
      <div className="pt-10 pb-20 bg-primary/10 flex flex-col items-center justify-center p-4 min-h-screen">
        {/* Login Card */}
        <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
            <p className="text-gray-500 mt-2">
              Enter your details to access your account
            </p>
            {redirectTo && (
              <p className="text-xs text-primary/70 mt-2">
                Please login to continue to the requested page
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-primary/80 block">
                Email or Phone Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/60 group-focus-within:text-primary transition-colors">
                  {getIdentifierIcon()}
                </div>
                <input
                  type="text"
                  name="identifier"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-primary/20 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all text-primary ${
                    touched.identifier && errors.identifier
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder="e.g. john@example.com or +94..."
                  value={formData.identifier}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
              </div>
              {touched.identifier && errors.identifier && (
                <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-primary/80 block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary/70 hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary/60 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className={`w-full pl-10 pr-12 py-3 bg-primary/20 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-transparent outline-none transition-all text-primary ${
                    touched.password && errors.password
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-primary/50 focus:border-primary"
                  }`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary/60 hover:text-primary cursor-pointer transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-red-500 mt-1 animate-in slide-in-from-top-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Demo Credentials Info */}
            {/* <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                Demo Credentials:
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Email: dev@godayana.lk
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Password: Dev123#
              </p>
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary/80 text-white py-3.5 rounded-xl font-bold hover:bg-primary cursor-pointer transform active:scale-[0.98] transition-all shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-primary/20 pt-6">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary font-bold hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
