"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations/schemas";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Shield,
  User,
  Mail,
  Lock,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      setSuccess(true);
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Your account has been created and is pending admin approval. You
                will be notified once your account is activated.
              </p>

              <Link
                href="/auth/signin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/auth/signin"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Sign In
        </Link>

        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Registration
          </h2>
          <p className="text-gray-600">
            Create your Alliance Insurance staff account
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-primary-700/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("name")}
                    type="text"
                    autoComplete="name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register("role")}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-900 appearance-none bg-white"
                  >
                    <option value="">Select your role</option>
                    <option value="agent">Insurance Agent</option>
                    <option value="frontline">Frontline Employee</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Approval Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    <strong>Note:</strong> Your account will require admin
                    approval before you can sign in.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
