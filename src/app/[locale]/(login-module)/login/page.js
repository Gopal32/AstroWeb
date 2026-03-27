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
import {
  Star,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  X,
} from "lucide-react";
import { setUserId } from "@/utils/userUtils";
import { Link } from "@/i18n/navigation";
import useApi from "@/hooks/useApi";

// Production-grade error messages
const ERROR_MESSAGES = {
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  REQUEST_TIMEOUT: "Request timed out. Please try again.",
  SIGNIN_FAILED: "Sign in failed. Please try again.",
};

export default function LoginPage() {
  const router = useRouter();
  const { apiCall } = useApi();
  const abortControllerRef = useRef(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

  const validateField = (fieldName, value) => {

    const errors = { ...fieldErrors };

    switch (fieldName) {
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
        } else if (value.length < 8) {
          errors.password = ERROR_MESSAGES.INVALID_PASSWORD;
        } else {
          delete errors.password;
        }
        break;
    }

    setFieldErrors(errors);
  };
  const handleForgotPassword = async () => {
    setForgotEmailError("");
    setForgotSuccess("");

    if (!forgotEmail) {
      setForgotEmailError("Email is required");
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setForgotEmailError("Please enter a valid email address");
      return;
    }

    setForgotLoading(true);
    console.log("Initiating forgot password process for email:", forgotEmail);
    try {
      const response = await apiCall("/api/auth/forgot-password", "POST", {
        emailId: forgotEmail
      });

      if (response.message === "User does not exists.") {
        setError("User not found. Redirecting to register...");

        // wait 2 seconds then redirect
        setTimeout(() => {
          router.push("/register");
        }, 2000);

        return;
      }

      if (response?.statusCode === 200) {
        setForgotSuccess(
          response.message || "Reset link sent! Please check your inbox."
        );

        setForgotEmail("");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setForgotEmailError(
          response?.message || "Failed to send reset link."
        );
      }
    } catch (err) {
      setForgotEmailError(
        err.message || "Network error. Please try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    validateField("email", email);
    validateField("password", password);

    if (!validateEmail(email) || !password) {
      setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiCall("/api/auth/signin", "POST", {
        emailId: email,
        password: password,
      });

      if (response.message === "User does not exists.") {
        setError("User not found. Redirecting to register...");

        // wait 2 seconds then redirect
        setTimeout(() => {
          router.push("/register");
        }, 2000);

        return;
      }

      if (response?.statusCode === 200) {

        if (response?.data?.data?.token) {
          await apiCall("/api/auth/set-token", "POST", { token: response.data.data.token });
        } else {
          console.warn("No token received on registration");
        }
        if (response?.data?.userId) {
          setUserId(response.data.userId);
        }

        setEmail("");
        setPassword("");
        setFieldErrors({});
        setError("");

        // Redirect to dashboard/home
        const locale = localStorage.getItem("locale") || "en";

        setSuccess("🎉 Login successful! Redirecting...");

        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
      } else {
        setError(response?.message || ERROR_MESSAGES.SIGNIN_FAILED);
      }
    } catch (err) {
      console.error("Sign-in error:", err);

      if (err.message === ERROR_MESSAGES.REQUEST_TIMEOUT) {
        setError(ERROR_MESSAGES.REQUEST_TIMEOUT);
      } else if (err.message?.includes("HTTP 401")) {
        setError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      } else {
        setError(err.message || ERROR_MESSAGES.NETWORK_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg">
        <Card className="backdrop-blur-sm border-border/50 shadow-2xl overflow-hidden">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground fill-primary-foreground" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-balance">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-pretty leading-relaxed px-2">
                Sign in to your account and explore the cosmos
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField("email", e.target.value);
                  }}
                  aria-label="Email Address"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm ${fieldErrors.email ? "border-destructive" : ""
                    }`}
                  autoFocus
                />
                {fieldErrors.email && (
                  <p id="email-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validateField("password", e.target.value);
                    }}
                    aria-label="Password"
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    className={`bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-base sm:text-sm pr-10 ${fieldErrors.password ? "border-destructive" : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" role="alert" className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password link */}
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(!showForgotPassword);
                    setForgotEmail("");
                    setForgotEmailError("");
                    setForgotSuccess("");
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Forgot Password Panel */}
              {showForgotPassword && (
                <div className="bg-muted/40 border border-border/60 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Reset your password
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground">
                    Enter your email address and we&apos;ll send you a reset link.
                  </p>

                  {/* Content (NOT a form) */}
                  <div className="space-y-2">

                    {/* Input */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          setForgotEmailError("");
                        }}
                        aria-label="Forgot password email"
                        className={`pl-9 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm ${forgotEmailError ? "border-destructive" : ""
                          }`}
                      />
                    </div>

                    {/* Error */}
                    {forgotEmailError && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {forgotEmailError}
                      </p>
                    )}

                    {/* Success */}
                    {forgotSuccess && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        {forgotSuccess}
                      </p>
                    )}

                    {/* Button */}
                    <Button
                      type="button" // ✅ IMPORTANT
                      size="sm"
                      className="w-full"
                      disabled={forgotLoading}
                      onClick={handleForgotPassword} // ✅ direct call
                    >
                      {forgotLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>

                  </div>
                </div>
              )}
              {/* Success message */}
              {success && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}
              {/* Error message */}
              {error && (
                <div role="alert" className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary font-medium py-3 sm:py-4 rounded-xl text-base"
                disabled={isLoading || success || !email || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    <span>Sign In</span>
                  </>
                )}
              </Button>
            </form>

            {/* Navigation Link */}
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
