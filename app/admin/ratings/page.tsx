"use client";

import { useEffect, useState } from "react";
import { Search, Star, Filter, Trash2, Eye, X } from "lucide-react";

interface Rating {
  id: number;
  rater_name: string;
  rater_email: string;
  rater_phone: string;
  policy_number?: string;
  rating_value: number;
  comments?: string;
  created_at: string;
  agent?: {
    id: number;
    name: string;
    email: string;
    branch: string;
  };
  employee?: {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
  };
  question: {
    id: number;
    question_text: string;
    question_type: "agent" | "employee";
  };
}

export default function AdminRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [currentPage, searchTerm, filterRating, filterType]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (searchTerm) params.append("search", searchTerm);
      if (filterRating) params.append("rating", filterRating);

      const response = await fetch(`/api/admin/ratings?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this rating?")) return;

    try {
      const response = await fetch(`/api/admin/ratings?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRatings();
      } else {
        alert("Failed to delete rating");
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const viewDetails = (rating: Rating) => {
    setSelectedRating(rating);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRating(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredRatings = ratings.filter((rating) => {
    const matchesType =
      !filterType || rating.question.question_type === filterType;
    return matchesType;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getAverageRating = () => {
    if (filteredRatings.length === 0) return 0;
    const sum = filteredRatings.reduce(
      (acc, rating) => acc + rating.rating_value,
      0,
    );
    return (sum / filteredRatings.length).toFixed(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 space-y-6 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ratings Management
          </h1>
          <p className="mt-2 text-gray-600">
            View and manage customer ratings and feedback
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-gray-900">
              {filteredRatings.length}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Total Ratings
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {getAverageRating()}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Average Rating
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-green-600">
              {filteredRatings.filter((r) => r.rating_value >= 4).length}
            </div>
            <div className="text-sm text-gray-500 font-medium">
              High Ratings (4+)
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Search ratings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all duration-200"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white transition-all duration-200"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="agent">Agents</option>
                <option value="employee">Employees</option>
              </select>
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {filteredRatings.length} result
                {filteredRatings.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : filteredRatings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No ratings found</div>
            <div className="text-gray-400 text-sm">
              {searchTerm || filterRating || filterType
                ? "Try adjusting your filters"
                : "No customer ratings have been submitted yet"}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRatings.map((rating) => (
                  <tr
                    key={rating.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {rating.rater_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rating.rater_email}
                        </div>
                        {rating.policy_number && (
                          <div className="text-xs text-gray-400">
                            Policy: {rating.policy_number}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {rating.agent?.name || rating.employee?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rating.agent
                            ? `Agent - ${rating.agent.branch}`
                            : `${rating.employee?.position} - ${rating.employee?.department}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div
                          className="truncate"
                          title={rating.question.question_text}
                        >
                          {rating.question.question_text}
                        </div>
                        <div className="text-xs text-gray-400 capitalize mt-1">
                          {rating.question.question_type} question
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(rating.rating_value)}
                        <span
                          className={`ml-2 text-sm font-medium ${getRatingColor(rating.rating_value)}`}
                        >
                          {rating.rating_value}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(rating.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(rating.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewDetails(rating)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rating.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Rating Details Modal */}
      {showModal && selectedRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Rating Details
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRating.rater_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRating.rater_email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRating.rater_phone}
                      </p>
                    </div>
                    {selectedRating.policy_number && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Policy Number
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedRating.policy_number}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Target */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Rating Target
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRating.agent?.name ||
                          selectedRating.employee?.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role & Location
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRating.agent &&
                          `Agent - ${selectedRating.agent.branch}`}
                        {selectedRating.employee &&
                          `${selectedRating.employee.position} - ${selectedRating.employee.department}`}
                      </p>
                    </div>
                    {(selectedRating.agent?.email ||
                      selectedRating.employee?.email) && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedRating.agent?.email ||
                            selectedRating.employee?.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Details */}
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Rating Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question
                      </label>
                      <p className="text-sm text-gray-900 p-4 bg-white rounded-lg border leading-relaxed">
                        {selectedRating.question.question_text}
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-full capitalize">
                        {selectedRating.question.question_type} question
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {renderStars(selectedRating.rating_value)}
                        <span
                          className={`ml-3 text-lg font-semibold ${getRatingColor(selectedRating.rating_value)}`}
                        >
                          {selectedRating.rating_value}/5
                        </span>
                      </div>
                    </div>

                    {selectedRating.comments && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comments
                        </label>
                        <div className="p-4 bg-white rounded-lg border">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                            {selectedRating.comments}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Submitted
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedRating.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(selectedRating.id)}
                  className="px-6 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Delete Rating
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
