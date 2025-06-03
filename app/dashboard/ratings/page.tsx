"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
  TrendingUp,
} from "lucide-react";

interface Rating {
  id: number;
  rating_value: number;
  comments: string | null;
  rater_name: string;
  rater_email: string;
  rater_phone: string;
  policy_number: string | null;
  created_at: string;
  question: {
    id: number;
    question_text: string;
    question_type: string;
  };
}

interface RatingsResponse {
  ratings: Rating[];
  total: number;
  page: number;
  totalPages: number;
}

export default function MyRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const limit = 10;

  const fetchMyRatings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/ratings?${params}`);
      if (!response.ok) {
        console.log("Failed to fetch ratings");
      }

      const data: RatingsResponse = await response.json();
      setRatings(data.ratings);
      setTotalPages(data.totalPages);
      setTotalRatings(data.total);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchMyRatings();
  }, [currentPage]);

  // Safe calculations with loading checks
  const averageRating =
    !loading && ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating_value, 0) / ratings.length
        ).toFixed(1)
      : "0.0";

  const ratingsWithComments =
    !loading && ratings.length > 0
      ? ratings.filter((r) => r.comments && r.comments.trim() !== "").length
      : 0;

  const recentRatings =
    !loading && ratings.length > 0
      ? ratings.filter((r) => {
          const ratingDate = new Date(r.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return ratingDate >= thirtyDaysAgo;
        }).length
      : 0;

  // Calculate rating distribution with safety checks
  const ratingDistribution =
    !loading && ratings.length > 0
      ? Array.from({ length: 5 }, (_, i) => {
          const starValue = i + 1;
          const count = ratings.filter(
            (r) => r.rating_value === starValue,
          ).length;
          const percentage = (count / ratings.length) * 100;
          return { stars: starValue, count, percentage };
        }).reverse()
      : Array.from({ length: 5 }, (_, i) => ({
          stars: 5 - i,
          count: 0,
          percentage: 0,
        }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Ratings</h1>
                <p className="text-sm text-gray-500">
                  View feedback from your customers
                </p>
              </div>
            </div>
            <button
              onClick={fetchMyRatings}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Ratings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRatings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">With Comments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {ratingsWithComments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last 30 Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentRatings}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Rating Distribution
              </h3>
              <div className="space-y-4">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-16">
                      <span className="text-sm font-medium text-gray-600">
                        {item.stars}
                      </span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Ratings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Ratings
                </h3>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                  <span className="ml-2 text-gray-500">Loading ratings...</span>
                </div>
              ) : ratings.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No ratings yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Your customer ratings will appear here
                  </p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-200">
                    {ratings.map((rating) => (
                      <div
                        key={rating.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {rating.question.question_text}
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center">
                                {renderStars(rating.rating_value)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {rating.rating_value}/5
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(rating.created_at)}
                          </span>
                        </div>

                        {rating.comments && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              {rating.comments}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>From: {rating.rater_name}</span>
                            {rating.policy_number && (
                              <span>Policy: {rating.policy_number}</span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedRating(rating)}
                            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * limit + 1} to{" "}
                        {Math.min(currentPage * limit, totalRatings)} of{" "}
                        {totalRatings} ratings
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-gray-700">
                          {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rating Detail Modal */}
      {selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Rating Details
                </h3>
                <button
                  onClick={() => setSelectedRating(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Question
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedRating.question.question_text}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {selectedRating.question.question_type}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Rating
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    {renderStars(selectedRating.rating_value)}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedRating.rating_value}/5
                  </span>
                </div>
              </div>

              {selectedRating.comments && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Customer Comments
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {selectedRating.comments}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Customer Information
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{selectedRating.rater_name}</p>
                  <p>{selectedRating.rater_email}</p>
                  <p>{selectedRating.rater_phone}</p>
                  {selectedRating.policy_number && (
                    <p>Policy: {selectedRating.policy_number}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Submitted
                </h4>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedRating.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
