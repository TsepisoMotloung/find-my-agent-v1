"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  QrCode,
  MessageSquare,
  Star,
  Users,
  Shield,
  Award,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
} from "lucide-react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"agent" | "employee">("agent");

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Alliance Insurance
                </h1>
                <p className="text-sm text-primary-600 font-medium">
                  Find My Agent
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Staff Login
              </a>
              <a
                href="/scan-qr"
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <QrCode className="w-5 h-5" />
                <span>Scan QR</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find & Rate Your
                  <span className="block text-primary-600 mt-2">
                    Insurance Agent
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Connect instantly with Alliance Insurance professionals. Share
                  your experience and help us deliver exceptional service across
                  our network.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Search agents by name or location",
                  "Rate your service experience instantly",
                  "Submit feedback with QR code access",
                  "Help improve our service quality",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#search"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/scan-qr"
                  className="border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:bg-primary-50"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Scan QR Code</span>
                </a>
              </div>
            </div>

            {/* Right Content - Stats Grid */}
            <div className="lg:pl-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-primary-700/10 rounded-3xl blur-3xl"></div>
                <div className="relative grid grid-cols-2 gap-6">
                  {[
                    {
                      icon: Users,
                      number: "1,250+",
                      label: "Active Agents",
                      color: "bg-blue-500",
                    },
                    {
                      icon: Star,
                      number: "4.8/5",
                      label: "Average Rating",
                      color: "bg-yellow-500",
                    },
                    {
                      icon: MessageSquare,
                      number: "5,400+",
                      label: "Reviews",
                      color: "bg-green-500",
                    },
                    {
                      icon: TrendingUp,
                      number: "98%",
                      label: "Satisfaction",
                      color: "bg-purple-500",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div
                        className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                      >
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Find Your Agent in Seconds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Search by name, location, or browse nearby agents to get started
              with your feedback
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-primary-700/5 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 lg:p-12">
              <div className="grid lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-5 space-y-2">
                  <label className="text-sm font-semibold text-gray-900">
                    Agent or Employee Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Enter name to search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-2">
                  <label className="text-sm font-semibold text-gray-900">
                    Search Type
                  </label>
                  <select
                    className="w-full py-4 px-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-gray-900"
                    value={searchType}
                    onChange={(e) =>
                      setSearchType(e.target.value as "agent" | "employee")
                    }
                  >
                    <option value="agent">Insurance Agent</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <div className="lg:col-span-4">
                  <a
                    href={`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
                  >
                    <span>Search Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Multiple Ways to Connect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for you to find agents and share
              your valuable feedback
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: "Search & Rate",
                description:
                  "Find agents by name and location, then rate your experience with detailed feedback",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: MapPin,
                title: "Nearby Agents",
                description:
                  "Discover available agents in your area with live location and distance filtering",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: QrCode,
                title: "QR Code Access",
                description:
                  "Scan agent QR codes for instant access to rating forms and quick feedback submission",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: MessageSquare,
                title: "Submit Feedback",
                description:
                  "Share detailed feedback or submit service complaints to help us improve our service",
                gradient: "from-red-500 to-red-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Alliance Insurance</h3>
                  <p className="text-gray-400">Find My Agent Platform</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Connecting customers with trusted insurance professionals. Your
                feedback helps us deliver exceptional service every day.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Access</h4>
              <div className="space-y-3">
                <a
                  href="/search"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Search Agents
                </a>
                <a
                  href="/nearby-agents"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Nearby Agents
                </a>
                <a
                  href="/scan-qr"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  QR Scanner
                </a>
                <a
                  href="/complaint"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Submit Feedback
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Alliance Insurance. All rights reserved. Made with care
              for our customers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
