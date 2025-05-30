'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Star, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';

interface SearchResult {
  id: number;
  name: string;
  email: string;
  phone: string;
  location?: string;
  branch: string;
  department?: string;
  position?: string;
  averageRating?: number;
  totalRatings?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState<'agent' | 'employee'>(
    (searchParams.get('type') as 'agent' | 'employee') || 'agent'
  );

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [searchQuery, searchType]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

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
              <h1 className="text-xl font-semibold text-gray-900">Search Results</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="card mb-8">
          <div className="card-body">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Enter name to search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className="select-field"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as 'agent' | 'employee')}
                >
                  <option value="agent">Agent</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {results.length} {searchType === 'agent' ? 'agent' : 'employee'}
                {results.length !== 1 ? 's' : ''} found
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="card hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {result.name}
                        </h3>
                        {searchType === 'employee' && result.position && (
                          <p className="text-sm text-gray-500">{result.position}</p>
                        )}
                      </div>
                      {result.averageRating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">
                            {result.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({result.totalRatings})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {result.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {result.phone}
                      </div>
                      {result.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {result.location}
                        </div>
                      )}
                      {result.department && (
                        <div className="text-sm text-gray-600">
                          <strong>Department:</strong> {result.department}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        <strong>Branch:</strong> {result.branch}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/rate/${searchType}/${result.id}`}
                        className="btn-primary flex-1 text-center"
                      >
                        Rate {searchType === 'agent' ? 'Agent' : 'Employee'}
                      </Link>
                      <Link
                        href={`/complaint?${searchType}_id=${result.id}`}
                        className="btn-secondary flex-1 text-center"
                      >
                        Complaint
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {searchType}s found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search terms or search type.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start searching
            </h3>
            <p className="text-gray-500">
              Enter a name to find agents or employees.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}