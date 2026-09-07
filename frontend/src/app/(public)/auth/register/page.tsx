"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  Building2,
  Briefcase,
  Info,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  authAPI,
  RegisterRequest,
} from "@/lib/api/endpoints/public/authEndpoints";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"seeker" | "company">("seeker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [registrationData, setRegistrationData] = useState<RegisterRequest>({});

  // OTP Timer states
  const [otpTimer, setOtpTimer] = useState(0); // 30 seconds countdown
  const [resendCooldown, setResendCooldown] = useState(0); // 1 minutes cooldown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  // Start OTP timer when modal opens
  useEffect(() => {
    if (showOtpModal) {
      startOtpTimer();
    } else {
      // Reset timers when modal closes
      setOtpTimer(0);
      setResendCooldown(0);
      setIsResendDisabled(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (cooldownRef.current) {
        clearInterval(cooldownRef.current);
        cooldownRef.current = null;
      }
    }
  }, [showOtpModal]);

  const startOtpTimer = () => {
    // Reset timer
    setOtpTimer(30);
    setIsResendDisabled(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          // Timer expired - enable resend
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startCooldown = () => {
    // Start 1 minute cooldown after resend
    setResendCooldown(60); // 1 minutes
    setIsResendDisabled(true);

    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }

    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) {
            clearInterval(cooldownRef.current);
            cooldownRef.current = null;
          }
          // Enable resend after cooldown
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Update resendOtp function to start cooldown
  const resendOtp = async () => {
    if (isResendDisabled || isLoading) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Sending verification code...");

    try {
      // Clean phone number to +94 format
      let cleanPhone = formData.phone;
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "+94" + cleanPhone.substring(1);
      }

      // Prepare registration data
      const userData: RegisterRequest = {
        role: role,
        ...(role === "seeker"
          ? {
              fullName: formData.fullName,
            }
          : {
              companyName: formData.companyName,
              contactPerson: formData.contactPerson,
              designation: formData.designation,
              email: formData.email,
            }),
        phone: cleanPhone,
        password: formData.password,
      };

      setRegistrationData(userData);

      // Send OTP
      await sendOtp(userData);

      toast.dismiss(loadingToast);
      toast.success(`Verification code sent successfully`);

      // Start 5 minute cooldown
      startCooldown();
      // Reset the 1 minute timer
      setOtpTimer(60);
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send verification code";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this useEffect
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    designation: "",
    contactPerson: "",
    password: "",
    confirmPassword: "",
  });

  // Simple: if starts with 0, replace with +94
  const formatPhoneNumber = (value: string): string => {
    if (value.startsWith("0")) {
      return "+94" + value.substring(1);
    }
    return value;
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (role === "company" && !email) return "Company email is required";
    if (role === "company" && !emailRegex.test(email))
      return "Invalid email format";
    if (role === "seeker" && email && !emailRegex.test(email))
      return "Invalid email format";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    // Accept both formats: +94XXXXXXXXX or 0XXXXXXXXX
    const phoneRegex = /^(\+94|0)\d{9}$/;
    if (!phoneRegex.test(phone))
      return "Invalid phone number format (e.g., +94712345678 or 0712345678)";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*[0-9])/.test(password))
      return "Password must contain at least one number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== formData.password) return "Passwords do not match";
    return "";
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value);
      case "fullName":
        if (role === "seeker" && !value) return "Full name is required";
        if (role === "seeker" && value.length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "companyName":
        if (role === "company" && !value) return "Company name is required";
        return "";
      case "contactPerson":
        if (role === "company" && !value) return "Contact person is required";
        return "";
      case "designation":
        if (role === "company" && !value) return "Designation is required";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Format phone number on the fly
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Send OTP to backend
  const sendOtp = async (userdata: RegisterRequest) => {
    try {
      const response = await authAPI.sendOtp(userdata);
      return response.data;
    } catch (error) {
      console.error("Failed to send OTP:", error);
      throw error;
    }
  };

  // Register user
  const verifyOtpAndRegisterUser = async (
    userData: RegisterRequest,
    identifier: string,
    otp: string,
  ) => {
    try {
      const response = await authAPI.register(userData, identifier, otp);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasError = false;

    // Phone validation (required for both roles)
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
      hasError = true;
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      hasError = true;
    }

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
      hasError = true;
    }

    // Role-specific validations
    if (role === "seeker") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
        hasError = true;
      } else if (formData.fullName.length < 2) {
        newErrors.fullName = "Name must be at least 2 characters";
        hasError = true;
      }
      // Email is optional for job seekers, but validate format if provided
      if (formData.email && validateEmail(formData.email)) {
        newErrors.email = validateEmail(formData.email);
        hasError = true;
      }
    } else {
      // Company validations
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
        hasError = true;
      }
      if (!formData.companyName) {
        newErrors.companyName = "Company name is required";
        hasError = true;
      }
      if (!formData.contactPerson) {
        newErrors.contactPerson = "Contact person is required";
        hasError = true;
      }
      if (!formData.designation) {
        newErrors.designation = "Designation is required";
        hasError = true;
      }
    }

    setErrors(newErrors);
    setTouched({
      phone: true,
      password: true,
      confirmPassword: true,
      fullName: role === "seeker",
      email: role === "company",
      companyName: role === "company",
      contactPerson: role === "company",
      designation: role === "company",
    });

    if (!hasError) {
      const loadingToast = toast.loading("Sending verification code...");

      try {
        // Clean phone number to +94 format for submission
        let cleanPhone = formData.phone;
        if (cleanPhone.startsWith("0")) {
          cleanPhone = "+94" + cleanPhone.substring(1);
        }

        // Prepare registration data
        const userData: RegisterRequest = {
          role: role,
          ...(role === "seeker"
            ? {
                fullName: formData.fullName,
                email: formData.email || undefined,
              }
            : {
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                designation: formData.designation,
                email: formData.email,
              }),
          phone: cleanPhone,
          password: formData.password,
        };

        setRegistrationData(userData);

        // Send OTP based on role
        const contactInfo = role === "seeker" ? cleanPhone : formData.email;

        await sendOtp(userData);

        toast.dismiss(loadingToast);
        toast.success(`Verification code sent to ${contactInfo}`, {
          duration: 5000,
        });
        setShowOtpModal(true);
      } catch (error) {
        toast.dismiss(loadingToast);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to send verification code";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setErrors({ ...errors, otp: "Please enter 4-digit OTP" });
      return;
    }

    setIsLoading(true);
    const verifyingToast = toast.loading("Verifying OTP...");

    // Clean phone number to +94 format
    let cleanPhone = formData.phone;
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "+94" + cleanPhone.substring(1);
    }

    const identifier = role === "seeker" ? cleanPhone : formData.email;
    const otpData = otp.join("");

    try {
      const registrationData: RegisterRequest = {
        role: role,
        ...(role === "seeker"
          ? {
              fullName: formData.fullName,
              email: formData.email || undefined,
            }
          : {
              companyName: formData.companyName,
              contactPerson: formData.contactPerson,
              designation: formData.designation,
              email: formData.email,
            }),
        phone: cleanPhone,
        password: formData.password,
      };

      await verifyOtpAndRegisterUser(registrationData, identifier, otpData);

      toast.dismiss(verifyingToast);
      // Success message with redirect
      const successToastId = toast.success(
        role === "seeker"
          ? "Registration successful! Redirecting to login..."
          : "Company registration submitted for review! Redirecting to login...",
      );

      setShowOtpModal(false);
      setOtp(["", "", "", ""]);

      // Reset form
      setFormData({
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        designation: "",
        contactPerson: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect after toast
      setTimeout(() => {
        toast.dismiss(successToastId);
        // router.push("/auth/login");
        const url = new URL("/auth/login", window.location.origin);
        window.location.href = url.toString();
      }, 2000);
    } catch (error) {
      toast.dismiss(verifyingToast);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid OTP. Please try again.";
      toast.error(errorMessage);
      setErrors({ ...errors, otp: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // const resendOtp = async () => {
  //   setIsLoading(true);
  //   const loadingToast = toast.loading("Sending verification code...");

  //   try {
  //     // Clean phone number to +94 format
  //     let cleanPhone = formData.phone;
  //     if (cleanPhone.startsWith("0")) {
  //       cleanPhone = "+94" + cleanPhone.substring(1);
  //     }

  //     // Prepare registration data
  //     const userData: RegisterRequest = {
  //       role: role,
  //       ...(role === "seeker"
  //         ? {
  //             fullName: formData.fullName,
  //             // email: formData.email || undefined,
  //           }
  //         : {
  //             companyName: formData.companyName,
  //             contactPerson: formData.contactPerson,
  //             designation: formData.designation,
  //             email: formData.email,
  //           }),
  //       phone: cleanPhone,
  //       password: formData.password,
  //     };

  //     setRegistrationData(userData);

  //     // Send OTP based on role
  //     const contactInfo = role === "seeker" ? cleanPhone : formData.email;

  //     await sendOtp(userData);

  //     toast.dismiss(loadingToast);
  //     toast.success(`Verification code sent to ${contactInfo}`);
  //   } catch (error) {
  //     toast.dismiss(loadingToast);
  //     const errorMessage =
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to send verification code";
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="pt-22 pb-20 bg-primary/10 flex flex-col items-center justify-center p-4 min-h-screen">
      {/* Registration Card */}
      <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Create Your Account
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Join thousands of job seekers and companies
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-primary/20 py-1 px-1.5 rounded-xl mb-8">
          <button
            onClick={() => {
              setRole("seeker");
              setErrors({});
              setFormData((prev) => ({ ...prev, email: "" }));
            }}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              role === "seeker"
                ? "bg-background text-primary shadow-sm"
                : "text-primary/60 hover:text-primary"
            }`}
          >
            <User size={16} /> Job Seeker
          </button>
          <button
            onClick={() => {
              setRole("company");
              setErrors({});
            }}
            className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              role === "company"
                ? "bg-background text-primary shadow-sm"
                : "text-primary/60 hover:text-primary"
            }`}
          >
            <Building2 size={16} /> Company
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "company" ? (
            <>
              {/* Company Email - Required */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary/80">
                  Company Email *
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-3 text-primary/60"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                      touched.email && errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder="company@example.com"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[10px] text-red-500">{errors.email}</p>
                )}
                <p className="text-[10px] text-primary/60">
                  OTP will be sent to this email
                </p>
              </div>

              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary/80">
                  Company Name *
                </label>
                <div className="relative group">
                  <Building2
                    className="absolute left-3 top-3 text-primary/60"
                    size={18}
                  />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                      touched.companyName && errors.companyName
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder="Enter company name"
                  />
                </div>
                {touched.companyName && errors.companyName && (
                  <p className="text-[10px] text-red-500">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* Contact Person & Designation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary/80">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                      touched.contactPerson && errors.contactPerson
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder="Full name"
                  />
                  {touched.contactPerson && errors.contactPerson && (
                    <p className="text-[10px] text-red-500">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary/80">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                      touched.designation && errors.designation
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder="Job title"
                  />
                  {touched.designation && errors.designation && (
                    <p className="text-[10px] text-red-500">
                      {errors.designation}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Job Seeker: Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary/80">
                  Full Name *
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-3 top-3 text-primary/60"
                    size={18}
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                      touched.fullName && errors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p className="text-[10px] text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Job Seeker: Email (Optional) */}
              {/* <div className="space-y-1">
                <label className="text-xs font-semibold text-primary/80">
                  Email (Optional)
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-3 text-primary/60"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                      touched.email && errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary/50 focus:border-primary"
                    }`}
                    placeholder="your@email.com (optional)"
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[10px] text-red-500">{errors.email}</p>
                )}
              </div> */}
            </>
          )}

          {/* Mobile Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary/80">
              {role === "company" ? "Contact Number *" : "Mobile Number *"}
            </label>
            <div className="relative group">
              <Phone
                className="absolute left-3 top-3 text-primary/60"
                size={18}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`w-full pl-10 pr-4 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                  touched.phone && errors.phone
                    ? "border-red-500 focus:border-red-500"
                    : "border-primary/50 focus:border-primary"
                }`}
                placeholder="0712345678"
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-[10px] text-red-500">{errors.phone}</p>
            )}
            <p className="text-[10px] text-primary/60">
              Enter 0712345678 (will be converted to +94712345678)
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary/80">
              Password *
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-3 text-primary/60"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`w-full pl-10 pr-12 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                  touched.password && errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-primary/50 focus:border-primary"
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-primary/60 hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-[10px] text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary/80">
              Confirm Password *
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-3 text-primary/60"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={`w-full pl-10 pr-12 py-2.5 bg-primary/20 border rounded-xl outline-none text-primary text-sm transition-colors ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-primary/50 focus:border-primary"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-primary/60 hover:text-primary"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[10px] text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Company Account Review Box */}
          {role === "company" && (
            <div className="bg-yellow-50 dark:bg-yellow-600 border border-yellow-200 dark:border-yellow-900 p-3 rounded-xl flex gap-3">
              <Info
                className="text-yellow-600 dark:text-yellow-300 shrink-0"
                size={18}
              />
              <div className="text-[11px] text-yellow-800 dark:text-yellow-300">
                <p className="font-bold">Account Review Process</p>
                <p>
                  Your company account will be placed under review upon
                  registration. You&apos;ll be able to access all features once
                  approved by our team.
                </p>
              </div>
            </div>
          )}

          {/* Terms Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" required className="accent-primary" />
              <span className="text-[11px] text-gray-500 dark:text-gray-300">
                {role === "seeker"
                  ? "I agree to the Terms & Conditions and Privacy Policy"
                  : "I agree to the Job Posting Terms & Conditions"}
              </span>
            </label>
            {role === "company" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" required className="accent-primary" />
                <span className="text-[11px] text-gray-500 dark:text-gray-300">
                  I agree to the CV Email Delivery Model Terms
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 cursor-pointer transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Sending verification..."
              : role === "seeker"
                ? "Register as Job Seeker"
                : "Register Company"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center border-t border-primary pt-6">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => {
                // router.push("/auth/login");
                const url = new URL("/auth/login", window.location.origin);
                window.location.href = url.toString();
              }}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Login here
            </button>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {/* {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setOtp(["", "", "", ""]);
                setErrors({});
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary">Verify OTP</h3>
              <p className="text-sm text-gray-500 mt-2">
                We&apos;ve sent a verification code to
                <br />
                <span className="font-semibold text-primary">
                  {role === "seeker" ? formData.phone : formData.email}
                </span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-primary/20 border border-primary/50 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-primary"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errors.otp}
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 cursor-pointer transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify & Register"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={resendOtp}
                disabled={isLoading}
                className="text-primary/80 text-sm hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )} */}
      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setOtp(["", "", "", ""]);
                setErrors({});
                // Reset timers
                setOtpTimer(0);
                setResendCooldown(0);
                setIsResendDisabled(true);
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
                if (cooldownRef.current) {
                  clearInterval(cooldownRef.current);
                  cooldownRef.current = null;
                }
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary">Verify OTP</h3>
              <p className="text-sm text-gray-500 mt-2">
                We&apos;ve sent a verification code to
                <br />
                <span className="font-semibold text-primary">
                  {role === "seeker" ? formData.phone : formData.email}
                </span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-primary/20 border border-primary/50 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-primary"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errors.otp}
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 cursor-pointer transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify & Register"}
            </button>

            {/* Resend OTP with Timer */}
            <div className="text-center mt-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={resendOtp}
                  disabled={isResendDisabled || isLoading}
                  className={`text-sm transition-colors ${
                    isResendDisabled || isLoading
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-primary hover:underline cursor-pointer"
                  }`}
                >
                  Resend OTP
                </button>
                {isResendDisabled && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {otpTimer > 0 ? (
                        <>Wait {otpTimer}s</>
                      ) : resendCooldown > 0 ? (
                        <>
                          Cooldown: {Math.floor(resendCooldown / 60)}:
                          {String(resendCooldown % 60).padStart(2, "0")}
                        </>
                      ) : null}
                    </span>
                  </>
                )}
              </div>
              {resendCooldown > 0 && otpTimer === 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Please wait {Math.floor(resendCooldown / 60)}:
                  {String(resendCooldown % 60).padStart(2, "0")} before trying
                  again
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
