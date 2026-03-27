"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  Mail,
  Loader2,
  Users,
  Sparkles,
  Shield,
  Zap,
  Lock,
  Phone,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { astroSignIn, setAstroId } from "@/utils/astroUtils";
import { userSignIn, setUserId } from "@/utils/userUtils";
import { Link } from "@/i18n/navigation";
import { se } from "date-fns/locale";
import { set } from "date-fns";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/context/AuthProvider";

// Production-grade error messages
const ERROR_MESSAGES = {
  INVALID_FULLNAME: "Full name must be at least 2 characters",
  FULLNAME_REQUIRED: "Full name is required",
  INVALID_EMAIL: "Please enter a valid email address",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_EXISTS: "This email is already registered. Please use a different email or try logging in.",
  INVALID_PASSWORD: "Password must be at least 8 characters with uppercase, lowercase, number and special character",
  PASSWORD_REQUIRED: "Password is required",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password",
  PASSWORDS_MISMATCH: "Passwords do not match",
  INVALID_PHONE: "Please enter a valid phone number (10-15 digits)",
  PHONE_REQUIRED: "WhatsApp phone number is required",
  PHONE_EXISTS: "This phone number is already linked to another account. Please use a different phone number or try logging in.",
  OTP_REQUIRED: "OTP verification required",
  TERMS_REQUIRED: "Accept terms to continue",
  EMAIL_VERIFICATION_FAILED: "Failed to verify email. Please try again.",
  PHONE_VERIFICATION_FAILED: "Phone validation failed. Please try again.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  REQUEST_TIMEOUT: "Request timed out. Please try again.",
};

export default function RegistrationPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const { apiCall } = useApi();
  const abortControllerRef = useRef(null);

  const [activeTab, setActiveTab] = useState("user");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpChecking, setOtpChecking] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneValidated, setPhoneValidated] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [userId, setUserIdState] = useState(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isLoadingSending, setIsLoadingSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const validatePhone = (phone) => {
    // WhatsApp phone validation (10-15 digits)
    const re = /^[0-9]{10,15}$/;
    return re.test(phone.replace(/\D/g, ""));
  };

  const validateField = (fieldName, value) => {
    const errors = { ...fieldErrors };

    switch (fieldName) {
      case "fullName":
        if (!value.trim()) {
          errors.fullName = ERROR_MESSAGES.FULLNAME_REQUIRED;
        } else if (value.trim().length < 2) {
          errors.fullName = ERROR_MESSAGES.INVALID_FULLNAME;
        } else {
          delete errors.fullName;
        }
        break;
      case "email":
        if (!value) {
          errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
        } else if (!validateEmail(value)) {
          errors.email = ERROR_MESSAGES.INVALID_EMAIL;
        } else {
          delete errors.email;
        }
        break;
      case "password":
        if (!value) {
          errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
        } else if (!validatePassword(value)) {
          errors.password = ERROR_MESSAGES.INVALID_PASSWORD;
        } else {
          delete errors.password;
        }
        break;
      case "confirmPassword":
        if (!value) {
          errors.confirmPassword = ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
        } else if (value !== password) {
          errors.confirmPassword = ERROR_MESSAGES.PASSWORDS_MISMATCH;
        } else {
          delete errors.confirmPassword;
        }
        break;
      case "phone":
        if (!value) {
          errors.phone = ERROR_MESSAGES.PHONE_REQUIRED;
        } else if (!validatePhone(value)) {
          errors.phone = ERROR_MESSAGES.INVALID_PHONE;
        } else {
          delete errors.phone;
        }
        break;
    }

    setFieldErrors(errors);
  };


  useEffect(() => {
    const timer = setTimeout(async () => {
      if (otp.length !== 6 || !phoneValidated) return;

      try {
        setOtpChecking(true);
        setOtpError("");

        const response = await apiCall("/api/auth/verify-otp", "POST", {
          userId: userId,
          otp: otp,   // ✅ correct key
        });

        if (response?.statusCode === 200) {
          setOtpVerified(true);
        } else {
          setOtpVerified(false);
          setOtpError("Invalid OTP");
        }
      } catch (err) {
        console.error("OTP verify error:", err);
        setOtpVerified(false);
        setOtpError("OTP verification failed");
      } finally {
        setOtpChecking(false);
      }
    }, 500); // debounce

    return () => clearTimeout(timer);
  }, [otp, phoneValidated]);

  // OTP Countdown Timer Effect
  useEffect(() => {
    let intervalId;
    if (otpSent && otpCountdown > 0) {
      intervalId = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent, otpCountdown]);

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setError("");

    validateField("fullName", fullName);
    validateField("email", email);

    if (!fullName.trim() || !validateEmail(email)) {
      setError("Please enter valid full name and email address");
      return;
    }

    setIsLoading(true);

    try {
      // Call API to check if email already exists
      // Replace this with your actual API endpoint
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.exists) {
        setError("This email is already registered. Please use a different email or try logging in.");
        setFieldErrors({ ...fieldErrors, email: "Email already exists" });
      } else if (data.valid) {
        setEmailVerified(true);
        setError("");
      } else {
        setError(data.message || "Email validation failed. Please try again.");
      }
    } catch (err) {
      console.error("Email verification error:", err);
      setError("Failed to verify email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-verify email when valid email and fullName are entered
  const handleEmailChange = async (value) => {
    setEmail(value);
    validateField("email", value);

    // Auto-verify if email is valid and fullName is present
    if (validateEmail(value) && fullName.trim() && !emailVerified) {
      setEmailChecking(true);

      try {
        const response = await apiCall("/api/auth/check-email", "POST", {
          email: value,
        });
        if (response?.exists) {
          setFieldErrors((prev) => ({
            ...prev,
            email: ERROR_MESSAGES.EMAIL_EXISTS,
          }));
          setEmailVerified(false);
        } else if (response?.valid) {
          setEmailVerified(true);
          setFieldErrors((prev) => {
            const updated = { ...prev };
            delete updated.email;
            return updated;
          });
        }
      } catch (err) {
        console.error("Auto email check error:", err);
        // Don't show error for auto-check, just silently fail
        setEmailVerified(false);
      } finally {
        setEmailChecking(false);
      }
    } else if (!validateEmail(value) || !fullName.trim()) {
      // Reset email verified if email becomes invalid
      setEmailVerified(false);
    }
  };

  const handlePhoneValidation = async (e) => {
    e.preventDefault();
    setIsLoadingSending(true);
    setError("");

    try {
      // Validate phone format
      if (!validatePhone(whatsappPhone)) {
        setError(ERROR_MESSAGES.INVALID_PHONE);
        validateField("phone", whatsappPhone);
        setIsLoadingSending(false);
        return;
      }

      // Check retry limit (max 3 attempts for phone validation)
      if (otpAttempts >= 3) {
        setError("Maximum phone validation attempts exceeded. Please try again later.");
        setIsLoading(false);
        setIsLoadingSending(false);
        return;
      }
      // Call API to send the otp
      const response = await apiCall("/api/auth/send-otp", "POST", {
        phone: whatsappPhone,
      });

      if (response?.statusCode === 200) {
        setPhoneValidated(true);
        setUserIdState(response?.data?.userId || null);
        setOtpSent(true);
        setOtpCountdown(60); // Start 60-second countdown
        setOtpAttempts(0);
        setError("");
      } else {
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        setError(
          response?.message ||
          `${ERROR_MESSAGES.PHONE_VERIFICATION_FAILED} (${3 - newAttempts} attempts remaining)`
        );
      }
    } catch (err) {
      console.error("Phone validation error:", err);

      const newAttempts = otpAttempts + 1;
      setOtpAttempts(newAttempts);

      if (err.message === ERROR_MESSAGES.REQUEST_TIMEOUT) {
        setError(ERROR_MESSAGES.REQUEST_TIMEOUT);
      } else if (newAttempts >= 3) {
        setError("Maximum phone validation attempts exceeded. Please try again later.");
      } else {
        // If API fails, still allow OTP (graceful degradation)
        setPhoneValidated(true);
        setOtpSent(true);
        setOtpCountdown(60); // Start 60-second countdown
      }
    } finally {
      setIsLoading(false);
      setIsLoadingSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    validateField("fullName", fullName);
    validateField("email", email);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);
    validateField("phone", whatsappPhone);

    // Check if any validation errors exist
    const errors = {};
    if (!fullName.trim()) errors.fullName = ERROR_MESSAGES.FULLNAME_REQUIRED;
    if (!validateEmail(email)) errors.email = ERROR_MESSAGES.INVALID_EMAIL;
    if (!validatePassword(password))
      errors.password = ERROR_MESSAGES.INVALID_PASSWORD;
    if (password !== confirmPassword)
      errors.confirmPassword = ERROR_MESSAGES.PASSWORDS_MISMATCH;
    if (!validatePhone(whatsappPhone)) errors.phone = ERROR_MESSAGES.INVALID_PHONE;
    if (!acceptTerms) errors.terms = ERROR_MESSAGES.TERMS_REQUIRED;
    if (!otpSent || !otp) errors.otp = ERROR_MESSAGES.OTP_REQUIRED;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    const cleanedPhone = whatsappPhone.replace(/^0+/, "");
   
    try {
      // Call signup API with all user data
      const response = await apiCall("/api/auth/signup", "POST", {
        fullName,
        email,
        password,
        whatsappPhone: cleanedPhone,
        code: "91", // Country code
      });

      if (response?.statusCode === 200) {
        // Save user token if provided
        if (response?.data?.data?.token) {
           await apiCall("/api/auth/set-token", "POST", { token: response.data.data.token });
           await refreshAuth();
        } else {
          console.warn("No token received on registration");
        }

        // Clear sensitive data
        setPassword("");
        setConfirmPassword("");
        setOtp("");

        setError("");

        setSuccess("🎉 Registration successful! Redirecting...🎉");

        // delay + redirect
        setTimeout(() => {
          router.push("/journey");
        }, 2000); // 2 sec delay
      } else {
        setError(
          response?.message || ERROR_MESSAGES.REGISTRATION_FAILED
        );
      }
    } catch (err) {
      console.error("Registration error:", err);

      if (err.message === ERROR_MESSAGES.REQUEST_TIMEOUT) {
        setError(ERROR_MESSAGES.REQUEST_TIMEOUT);
      } else if (err.message?.includes("HTTP 400")) {
        setError("Invalid registration data. Please check your inputs.");
      } else if (err.message?.includes("HTTP 409")) {
        setError(
          "Email or phone number is already registered. Please use different credentials."
        );
      } else {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
        <Card className="backdrop-blur-sm border-border/50 shadow-2xl overflow-hidden p-0 m-0">
          <div className="flex bg-muted/30 m-0 p-0 border-b border-border">
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 py-4 px-4 sm:px-6 text-center font-medium transition-all duration-300 flex flex-col items-center gap-2 sm:gap-1 ${activeTab === "user"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              <Users className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="text-sm sm:text-base">User</span>
            </button>
          </div>

          <CardHeader className="text-center space-y-4 pb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground fill-primary-foreground" />
            </div>

            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-balance">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-pretty leading-relaxed px-2">
                Join us for a cosmic journey with our talented Astrologers
              </CardDescription>
            </div>

            <div className="flex justify-center gap-6 sm:gap-8 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">Fast Setup</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
            <form onSubmit={phoneValidated ? handleSubmit : handlePhoneValidation} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    validateField("fullName", e.target.value);
                  }}
                  aria-label="Full Name"
                  aria-invalid={!!fieldErrors.fullName}
                  aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                  className={`bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm ${fieldErrors.fullName ? "border-destructive" : ""
                    }`}
                />
                {fieldErrors.fullName && (
                  <p id="fullName-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      handleEmailChange(e.target.value);
                    }}
                    aria-label="Email Address"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : emailVerified ? "email-success" : undefined}
                    className={`flex-1 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm ${fieldErrors.email ? "border-destructive" : ""
                      }`}
                  />
                  {emailChecking && (
                    <div className="flex items-center px-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[6px]">
                      <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                  )}
                  {emailVerified && !emailChecking && (
                    <div className="flex items-center px-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[6px]">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <p id="email-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
                {emailVerified && !emailChecking && (
                  <p id="email-success" className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    You verified manually
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateField("password", e.target.value);
                    }}
                    aria-label="Password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : "password-hint"}
                    className={`bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm pr-10 ${fieldErrors.password ? "border-destructive" : ""
                      }`}
                    disabled={phoneValidated}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p id="password-hint" className="text-xs text-muted-foreground">
                  Must be 8+ characters with uppercase, lowercase, number & special character
                </p>
                {fieldErrors.password && (
                  <p id="password-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              {!phoneValidated && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        validateField("confirmPassword", e.target.value);
                      }}
                      aria-label="Confirm Password"
                      aria-invalid={!!fieldErrors.confirmPassword}
                      aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                      className={`bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm pr-10 ${fieldErrors.confirmPassword ? "border-destructive" : ""
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p id="confirmPassword-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* WhatsApp Phone Number Field */}
              <div className="space-y-2">
                {!phoneValidated ? (
                  <>
                    <label htmlFor="whatsapp-phone" className="text-sm font-medium text-foreground">
                      WhatsApp Phone Number
                    </label>
                    <div className="relative">
                      <Input
                        id="whatsapp-phone"
                        type="tel"
                        placeholder="Enter your 10-15 digit phone number"
                        value={whatsappPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setWhatsappPhone(value);
                          validateField("phone", value);
                        }}
                        inputMode="numeric"
                        aria-label="WhatsApp Phone Number"
                        aria-invalid={!!fieldErrors.phone}
                        aria-describedby={fieldErrors.phone ? "phone-error" : otpAttempts > 0 ? "phone-attempts" : undefined}
                        className={`bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm pr-24 ${fieldErrors.phone ? "border-destructive" : ""
                          }`}
                      />
                      <Button
                        onClick={handlePhoneValidation}
                        disabled={isLoading || !password || !confirmPassword || !whatsappPhone.trim() || !validatePhone(whatsappPhone) || otpAttempts >= 3 || otpCountdown > 0}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3"
                      >
                        {isLoadingSending ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Sending
                          </>
                        ) : otpCountdown > 0 ? (
                          <>
                            <span>{otpCountdown}s</span>
                          </>
                        ) : (
                          <>
                            <Phone className="w-3 h-3 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor="whatsapp-phone-display" className="text-sm font-medium text-foreground">
                      WhatsApp Phone Number
                    </label>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-base font-medium text-foreground">+{whatsappPhone}</p>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      We&apos;ll send message to this number
                    </p>
                  </>
                )}
                {fieldErrors.phone && !phoneValidated && (
                  <p id="phone-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.phone}
                  </p>
                )}
                {otpAttempts > 0 && !phoneValidated && (
                  <p id="phone-attempts" className="text-xs text-amber-600 dark:text-amber-500">
                    Attempts remaining: {3 - otpAttempts}/3
                  </p>
                )}
              </div>


              {/* OTP Field - Only shown after phone validation */}
              {phoneValidated && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label htmlFor="otp" className="text-sm font-medium text-foreground">
                    OTP Verification
                  </label>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-2">
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      Enter OTP sent to +{whatsappPhone}
                    </p>
                  </div>

                  <div className="relative">
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(value);
                        setOtpVerified(false);
                        setOtpError("");
                      }}
                      inputMode="numeric"
                      maxLength={6}
                      aria-label="OTP Code"
                      className="bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm text-center tracking-widest pr-32"
                    />

                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {/* Loader */}
                      {otpChecking && (
                        <div className="flex items-center px-2">
                          <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                      )}

                      {/* Success */}
                      {otpVerified && !otpChecking && (
                        <div className="flex items-center px-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}

                      {/* Resend OTP Button - Show when countdown is 0 */}
                      {otpCountdown === 0 && !otpVerified && (
                        <Button
                          onClick={handlePhoneValidation}
                          disabled={isLoadingSending || otpCountdown > 0}
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs px-2 text-primary hover:bg-primary/90 dark:hover:bg-primary/90"
                        >
                          {isLoadingSending ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Sending
                            </>
                          ) : otpCountdown > 0 ? (
                            <>
                              <span>{otpCountdown}s</span>
                            </>
                          ) : (
                            <>
                              <Phone className="w-3 h-3 mr-1" />
                              Resend
                            </>
                          )}
                        </Button>
                      )}

                      {/* Countdown Timer - Show when countdown > 0 */}
                      {otpCountdown > 0 && !otpVerified && (
                        <span className="text-xs font-medium text-muted-foreground px-2">
                          {otpCountdown}s
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Check your WhatsApp for the OTP code
                  </p>
                  {otpError && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {otpError}
                    </p>
                  )}
                </div>
              )}

              {/* Terms Checkbox */}
              {phoneValidated && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={setAcceptTerms}
                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-foreground leading-relaxed cursor-pointer flex-1"
                  >
                    I agree to Astrosway&apos;s{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-primary hover:underline font-semibold"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary hover:underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}
              {/* Success Message */}
              {success && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div role="alert" className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 font-semibold py-3 sm:py-4 rounded-lg text-base transition-all duration-200"
                disabled={isLoading || !emailVerified || !password || !confirmPassword || !whatsappPhone || (phoneValidated && (!otp || !acceptTerms))}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>
                      {!phoneValidated ? "Completing Registration..." : "Creating Account..."}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span>Complete Registration</span>
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border/50 space-y-3">
              <p className="text-xs text-muted-foreground">
                Trusted by thousands of ancient wisdom seekers
              </p>
              <p className="text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}