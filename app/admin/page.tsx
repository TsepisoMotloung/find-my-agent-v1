"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Star,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  UserX,
  ArrowRight,
  Activity,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalAgents: number;
  totalEmployees: number;
  totalRatings: number;
  totalComplaints: number;
  averageRating: number;
  pendingApprovals: number;
  totalUsers: number;
  recentRatings: any[];
  recentComplaints: any[];
  recentUsers: any[];
  usersByRole: {
    admin: number;
    agent: number;
    employee: number;
    customer: number;
  };
}

interface HealthData {
  status: string;
  timestamp: string;
  environment: string;
  version: string;
  uptime: number;
  responseTime: string;
  database: {
    connected: boolean;
    users: number;
    agents: number;
    employees: number;
    questions: number;
  };
  services: {
    api: string;
    auth: string;
    database: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    fetchHealthData();

    // Set up periodic health checks every 30 seconds
    const healthInterval = setInterval(fetchHealthData, 30000);

    return () => clearInterval(healthInterval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthData = async () => {
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setHealthLoading(false);
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "unhealthy":
        return "text-red-600 bg-red-100";
      case "unknown":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4" />;
      case "unhealthy":
        return <XCircle className="w-4 h-4" />;
      case "unknown":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const mainStatCards = [
    {
      name: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/users",
    },
    {
      name: "Pending Approvals",
      value: stats?.pendingApprovals || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/admin/users?approved=false",
    },
    {
      name: "Total Ratings",
      value: stats?.totalRatings || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      href: "/admin/ratings",
    },
    {
      name: "Total Complaints",
      value: stats?.totalComplaints || 0,
      icon: MessageSquare,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/admin/complaints",
    },
    {
      name: "Average Rating",
      value: stats?.averageRating
        ? `${stats.averageRating.toFixed(1)}/5`
        : "0/5",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/admin/ratings",
    },
    {
      name: "Active Issues",
      value:
        stats?.recentComplaints?.filter((c) => c.status !== "resolved")
          .length || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/admin/complaints?status=pending",
    },
  ];

  const userRoleCards = [
    {
      name: "Admins",
      value: stats?.usersByRole?.admin || 0,
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      name: "Agents",
      value: stats?.usersByRole?.agent || 0,
      icon: UserCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "Employees",
      value: stats?.usersByRole?.employee || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Customers",
      value: stats?.usersByRole?.customer || 0,
      icon: UserCheck,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Alliance Insurance admin panel
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mainStatCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* System Health Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">System Health</h3>
          <div className="flex items-center">
            {healthLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            ) : (
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  healthData?.status === "healthy"
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {getServiceStatusIcon(healthData?.status || "unknown")}
                <span className="ml-1 capitalize">
                  {healthData?.status || "Unknown"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* API Status */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">API Service</p>
                <div className="flex items-center mt-1">
                  {getServiceStatusIcon(healthData?.services?.api || "unknown")}
                  <span
                    className={`ml-1 text-sm font-medium capitalize ${
                      healthData?.services?.api === "healthy"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {healthData?.services?.api || "Unknown"}
                  </span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Database</p>
                <div className="flex items-center mt-1">
                  {getServiceStatusIcon(
                    healthData?.services?.database || "unknown",
                  )}
                  <span
                    className={`ml-1 text-sm font-medium capitalize ${
                      healthData?.services?.database === "healthy"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {healthData?.services?.database || "Unknown"}
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Response Time
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {healthData?.responseTime || "N/A"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  System Uptime
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {healthData?.uptime ? formatUptime(healthData.uptime) : "N/A"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Detailed Health Info */}
        {healthData && (
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Environment Info
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Environment:</span>
                    <span className="font-medium capitalize">
                      {healthData.environment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium">{healthData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Check:</span>
                    <span className="font-medium">
                      {new Date(healthData.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Database Records
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <span className="font-medium">
                      {healthData.database?.users || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Agents:</span>
                    <span className="font-medium">
                      {healthData.database?.agents || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employees:</span>
                    <span className="font-medium">
                      {healthData.database?.employees || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">
                      {healthData.database?.questions || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Service Status
                </h4>
                <div className="space-y-1">
                  {Object.entries(healthData.services || {}).map(
                    ([service, status]) => (
                      <div
                        key={service}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-600 capitalize">
                          {service}:
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getServiceStatusColor(status)}`}
                        >
                          {getServiceStatusIcon(status)}
                          <span className="ml-1 capitalize">{status}</span>
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Role Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          User Distribution by Role
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {userRoleCards.map((stat) => (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.name}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            <Link
              href="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
          <div className="card-body">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.slice(0, 5).map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {user.is_approved ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No recent user registrations
              </p>
            )}
          </div>
        </div>

        {/* Recent Ratings */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Ratings
            </h3>
            <Link
              href="/admin/ratings"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
          <div className="card-body">
            {stats?.recentRatings && stats.recentRatings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentRatings.slice(0, 5).map((rating: any) => (
                  <div
                    key={rating.id}
                    className="flex items-center justify-between py-2"
                  >
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
                      <span className="text-sm font-medium">
                        {rating.rating_value}
                      </span>
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
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Complaints
            </h3>
            <Link
              href="/admin/complaints"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>
          <div className="card-body">
            {stats?.recentComplaints && stats.recentComplaints.length > 0 ? (
              <div className="space-y-4">
                {stats.recentComplaints.slice(0, 5).map((complaint: any) => (
                  <div key={complaint.id} className="py-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {complaint.subject}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          complaint.status === "pending"
                            ? "text-yellow-600 bg-yellow-100"
                            : complaint.status === "resolved"
                              ? "text-green-600 bg-green-100"
                              : complaint.status === "in_progress"
                                ? "text-blue-600 bg-blue-100"
                                : "text-gray-600 bg-gray-100"
                        }`}
                      >
                        {complaint.status === "pending" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {complaint.status === "resolved" && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {complaint.status === "in_progress" && (
                          <Activity className="w-3 h-3 mr-1" />
                        )}
                        {complaint.status.replace("_", " ")}
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

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users?approved=false"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body text-center">
              <UserX className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">
                Review Pending Users
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.pendingApprovals || 0} pending
              </p>
            </div>
          </Link>

          <Link
            href="/admin/complaints?status=pending"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body text-center">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">
                Urgent Complaints
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.recentComplaints?.filter(
                  (c) => c.priority === "urgent" && c.status !== "resolved",
                ).length || 0}{" "}
                urgent
              </p>
            </div>
          </Link>

          <Link
            href="/admin/ratings?rating=1"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Low Ratings</p>
              <p className="text-xs text-gray-500 mt-1">
                Review 1-2 star ratings
              </p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="card-body text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">
                Add, edit, or remove users
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
