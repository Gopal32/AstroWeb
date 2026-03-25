"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useApi from "@/hooks/useApi";

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
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const { apiCall } = useApi();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //  Strong password validation (same as registration)
  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePassword(password)) {
      setError(
        "Password must include uppercase, lowercase, number and special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await apiCall("/api/auth/reset-password", "POST", {
        token,
        password,
      });

      if (response?.statusCode === 200) {
        setSuccess("Password reset successful! Redirecting...");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(response?.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md lg:max-w-lg">

        <Card className="backdrop-blur-sm border-border/50 shadow-2xl overflow-hidden">

          {/* Header */}
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground fill-primary-foreground" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Reset Password
              </CardTitle>
              <CardDescription className="text-sm sm:text-base px-2">
                Enter your new password to continue
              </CardDescription>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-6 px-6 sm:px-8 pb-8">

            <form onSubmit={handleResetPassword} className="space-y-4">

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  New Password
                </label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pr-10 ${
                      password && !validatePassword(password)
                        ? "border-destructive"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Hint */}
                <p className="text-xs text-muted-foreground">
                  Must be 8+ characters with uppercase, lowercase, number & special character
                </p>

                {/* Error */}
                {password && !validatePassword(password) && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Password is not strong enough
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>

                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${
                    confirmPassword && confirmPassword !== password
                      ? "border-destructive"
                      : ""
                  }`}
                />

                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Global Error */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="text-green-600 text-sm font-medium">
                  {success}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary font-medium py-3 sm:py-4 rounded-xl text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}