"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  QrCode,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"agent" | "employee">("agent");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">
                  Alliance Insurance
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Staff Login
              </Link>
              <Link href="/scan-qr" className="btn-primary">
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR Code
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Find My Agent
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Rate and provide feedback for Alliance Insurance agents and
            employees. Help us improve our service quality.
          </p>
        </div>

        {/* Search Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="card">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    Search for agent or employee
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="input-field pl-10"
                      placeholder="Enter agent or employee name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <select
                    className="select-field"
                    value={searchType}
                    onChange={(e) =>
                      setSearchType(e.target.value as "agent" | "employee")
                    }
                  >
                    <option value="agent">Agent</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`}
                  className="btn-primary whitespace-nowrap"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/search"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Search & Rate
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Find and rate agents or employees by name
              </p>
            </div>
          </Link>

          <Link
            href="/nearby-agents"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
                <MapPin className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Nearby Agents
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Find online agents near your location
              </p>
            </div>
          </Link>

          <Link
            href="/scan-qr"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
                <QrCode className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">QR Code</h3>
              <p className="mt-2 text-sm text-gray-500">
                Scan QR code to rate instantly
              </p>
            </div>
          </Link>

          <Link
            href="/complaint"
            className="card hover:shadow-md transition-shadow"
          >
            <div className="card-body text-center">
              <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
                <MessageSquare className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Complaints</h3>
              <p className="mt-2 text-sm text-gray-500">
                Submit feedback or complaints
              </p>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  1,250+
                </div>
                <div className="text-sm text-gray-500 mt-1">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  5,400+
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Customer Ratings
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">4.8/5</div>
                <div className="text-sm text-gray-500 mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            © 2024 Alliance Insurance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
