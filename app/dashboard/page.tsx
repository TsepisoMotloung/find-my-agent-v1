'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Star, MessageSquare, TrendingUp, QrCode } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalRatings: number;
  averageRating: number;
  totalComplaints: number;
  pendingComplaints: number;
  recentRatings: any[];
  recentComplaints: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchDashboardStats();
    }
  }, [session]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Ratings',
      value: stats?.totalRatings || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      link: '/dashboard/ratings'
    },
    {
      name: 'Average Rating',
      value: stats?.averageRating ? `${stats.averageRating.toFixed(1)}/5` : '0/5',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Complaints',
      value: stats?.totalComplaints || 0,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      link: '/dashboard/complaints'
    },
    {
      name: 'Pending Complaints',
      value: stats?.pendingComplaints || 0,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/dashboard/complaints'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's your performance overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="card hover:shadow-md transition-shadow">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              {stat.link && (
                <div className="mt-4">
                  <Link
                    href={stat.link}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View details →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Ratings */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Ratings</h3>
            <Link
              href="/dashboard/ratings"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="card-body">
            {stats?.recentRatings && stats.recentRatings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentRatings.slice(0, 5).map((rating: any) => (
                  <div key={rating.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {rating.question?.question_text?.substring(0, 50)}...
                      </p>
                      <p className="text-xs text-gray-500">
                        By {rating.rater_name} • {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{rating.rating_value}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No ratings yet</p>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Complaints</h3>
            <Link
              href="/dashboard/complaints"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          <div className="card-body">
            {stats?.recentComplaints && stats.recentComplaints.length > 0 ? (
              <div className="space-y-4">
                {stats.recentComplaints.slice(0, 5).map((complaint: any) => (
                  <div key={complaint.id} className="py-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {complaint.subject}
                      </p>
                      <span className={`badge ${
                        complaint.status === 'pending' ? 'badge-warning' :
                        complaint.status === 'resolved' ? 'badge-success' :
                        complaint.status === 'in_progress' ? 'badge-info' : 'badge-gray'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      From {complaint.complainant_name} • {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No complaints</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-8">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/qr-code"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <QrCode className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Show My QR Code</h4>
                <p className="text-sm text-gray-500">Let customers rate you easily</p>
              </div>
            </Link>

            <Link
              href="/dashboard/ratings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Star className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">View All Ratings</h4>
                <p className="text-sm text-gray-500">See detailed feedback</p>
              </div>
            </Link>

            <Link
              href="/dashboard/complaints"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Manage Complaints</h4>
                <p className="text-sm text-gray-500">Review and respond</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}