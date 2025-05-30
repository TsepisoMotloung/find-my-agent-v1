'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowLeft, Star, Phone, Mail, Navigation } from 'lucide-react';

interface NearbyAgent {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  branch: string;
  latitude: number;
  longitude: number;
  distance?: number;
  averageRating?: number;
  totalRatings?: number;
}

export default function NearbyAgentsPage() {
  const [agents, setAgents] = useState<NearbyAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [maxDistance, setMaxDistance] = useState(10); // km

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyAgents();
    }
  }, [userLocation, maxDistance]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to get your location. Please enable location services.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const fetchNearbyAgents = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/agents/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=${maxDistance}`
      );

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      } else {
        setError('Failed to fetch nearby agents');
      }
    } catch (err) {
      console.error('Error fetching nearby agents:', err);
      setError('Failed to fetch nearby agents');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  const openDirections = (agent: NearbyAgent) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${agent.latitude},${agent.longitude}`;
    window.open(url, '_blank');
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
              <h1 className="text-xl font-semibold text-gray-900">
                Nearby Agents
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Status */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-sm text-gray-600">
                  {userLocation 
                    ? `Location detected (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
                    : locationError || 'Getting your location...'
                  }
                </span>
              </div>
              {!userLocation && (
                <button
                  onClick={getCurrentLocation}
                  className="btn-secondary text-sm"
                >
                  Enable Location
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Distance Filter */}
        {userLocation && (
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Search within:
                </label>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="select-field w-auto"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                </select>
                <span className="text-sm text-gray-500">
                  Found {agents.length} agents
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error || locationError ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Location Required
            </h3>
            <p className="text-gray-500 mb-4">
              {error || locationError}
            </p>
            <button
              onClick={getCurrentLocation}
              className="btn-primary"
            >
              Enable Location Access
            </button>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Agents Found
            </h3>
            <p className="text-gray-500">
              No online agents found within {maxDistance}km of your location. Try increasing the search radius.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="card hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-gray-500">{agent.location}</p>
                      </div>
                      {agent.averageRating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">
                            {agent.averageRating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({agent.totalRatings})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {agent.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {agent.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {agent.distance && `${agent.distance.toFixed(1)}km away`}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Branch:</strong> {agent.branch}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/rate/agent/${agent.id}`}
                        className="btn-primary flex-1 text-center text-sm"
                      >
                        Rate Agent
                      </Link>
                      <button
                        onClick={() => openDirections(agent)}
                        className="btn-secondary flex items-center justify-center px-3"
                        title="Get Directions"
                      >
                        <Navigation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}