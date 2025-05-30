'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalAgents: number;
  totalEmployees: number;
  totalRatings: number;
  totalComplaints: number;
  averageRating: number;
  pendingApprovals: number;
  recentRatings: any[];
  recentComplaints: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
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
      name: 'Total Agents',
      value: stats?.totalAgents || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Ratings',
      value: stats?.totalRatings || 0,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Total Complaints',
      value: stats?.totalComplaints || 0,
      icon: MessageSquare,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Average Rating',
      value: stats?.averageRating ? `${stats.averageRating.toFixed(1)}/5` : '0/5',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Alliance Insurance admin panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
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
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Ratings */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Ratings</h3>
          </div>
          <div className="card-body">
            {stats?.recentRatings && stats.recentRatings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentRatings.slice(0, 5).map((rating: any) => (
                  <div key={rating.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {rating.rater_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Rated {rating.agent?.name || rating.employee?.name}
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
              <p className="text-gray-500 text-sm">No recent ratings</p>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Complaints</h3>
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
                      From {complaint.complainant_name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent complaints</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}