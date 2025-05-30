"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratingSchema, RatingFormData } from "@/lib/validations/schemas";
import { Star, ArrowLeft, CheckCircle, User, Mail, Phone } from "lucide-react";

interface Question {
  id: number;
  question_text: string;
  order_index: number;
}

interface Target {
  id: number;
  name: string;
  email: string;
  phone: string;
  location?: string;
  department?: string;
  position?: string;
  branch: string;
}

export default function RatingPage() {
  const params = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [target, setTarget] = useState<Target | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const type = params.type as "agent" | "employee";
  const id = parseInt(params.id as string);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Omit<RatingFormData, "ratings">>({
    resolver: zodResolver(ratingSchema.omit({ ratings: true })),
  });

  const watchedPolicyRequired = type === "employee";

  useEffect(() => {
    fetchData();
  }, [type, id]);

  const fetchData = async () => {
    try {
      const [questionsRes, targetRes] = await Promise.all([
        fetch(`/api/questions?type=${type}`),
        fetch(`/api/${type}s/${id}`),
      ]);

      if (questionsRes.ok) {
        const questionsData = await questionsRes.json();
        setQuestions(questionsData.questions || []);
      }

      if (targetRes.ok) {
        const targetData = await targetRes.json();
        setTarget(targetData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: Omit<RatingFormData, "ratings">) => {
    // Validate that all questions have ratings
    const missingRatings = questions.filter((q) => !ratings[q.id]);
    if (missingRatings.length > 0) {
      alert("Please rate all questions before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const ratingData = {
        ...data,
        ratings: questions.map((q) => ({
          question_id: q.id,
          rating_value: ratings[q.id],
          comments: comments[q.id] || "",
        })),
      };

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...ratingData,
          [type === "agent" ? "agent_id" : "employee_id"]: id,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const setRating = (questionId: number, value: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: value }));
  };

  const setComment = (questionId: number, value: string) => {
    setComments((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card">
            <div className="card-body text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600 mb-6">
                Your rating has been submitted successfully. Your feedback helps
                us improve our service quality.
              </p>
              <div className="space-y-3">
                <Link href="/" className="btn-primary w-full">
                  Back to Home
                </Link>
                <Link href="/search" className="btn-secondary w-full">
                  Rate Another Person
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!target) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {type === "agent" ? "Agent" : "Employee"} Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The {type} you're looking for could not be found.
              </p>
              <Link href="/" className="btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-primary-600 hover:text-primary-700 mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Rate {type === "agent" ? "Agent" : "Employee"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Target Info */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {target.name}
                </h2>
                {type === "employee" && target.position && (
                  <p className="text-gray-600">{target.position}</p>
                )}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {target.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {target.phone}
                  </div>
                  {target.department && (
                    <div className="text-sm text-gray-500">
                      Department: {target.department}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Branch: {target.branch}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Your Information
              </h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register("rater_name")}
                    type="text"
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.rater_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rater_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    {...register("rater_email")}
                    type="email"
                    className="input-field"
                    placeholder="Enter your email"
                  />
                  {errors.rater_email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rater_email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    {...register("rater_phone")}
                    type="tel"
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.rater_phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.rater_phone.message}
                    </p>
                  )}
                </div>
                {watchedPolicyRequired && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Number {type === "employee" ? "*" : ""}
                    </label>
                    <input
                      {...register("policy_number")}
                      type="text"
                      className="input-field"
                      placeholder="Enter your policy number"
                    />
                    {errors.policy_number && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.policy_number.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rating Questions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Rating Questions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Please rate each aspect from 1 (Poor) to 5 (Excellent)
              </p>
            </div>
            <div className="card-body space-y-6">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    {question.question_text}
                  </h4>

                  {/* Star Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(question.id, value)}
                        className={`p-1 ${
                          ratings[question.id] >= value
                            ? "text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                    {ratings[question.id] && (
                      <span className="ml-2 text-sm text-gray-600">
                        {ratings[question.id]}/5
                      </span>
                    )}
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comments (Optional)
                    </label>
                    <textarea
                      className="textarea-field"
                      rows={2}
                      placeholder="Share your experience..."
                      value={comments[question.id] || ""}
                      onChange={(e) => setComment(question.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
