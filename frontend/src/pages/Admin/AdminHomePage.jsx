import { useEffect } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Users, FileText, Cloud, Loader } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const AdminHomePage = () => {
  const {
    userCount,
    listingCount,
    pendingListingsCount,
    approvedListingsCount,
    rejectedListingsCount,
    availableListingsCount,
    tradedListingsCount,
    isLoading,
    getDashboardData,
  } = useAdminStore();
  const { onlineUsers } = useAuthStore();
  const onlineUsersCount = onlineUsers.length;

  useEffect(() => {
    getDashboardData();

    const interval = setInterval(() => {
      getDashboardData();
    }, 120000);

    return () => clearInterval(interval);
  }, [getDashboardData]);

  // Data for the Pie Chart
  const listingStatusData = [
    { name: "Pending", value: pendingListingsCount },
    { name: "Approved", value: approvedListingsCount },
    { name: "Rejected", value: rejectedListingsCount },
    { name: "Available", value: availableListingsCount },
    { name: "Traded", value: tradedListingsCount },
  ];

  // Colors for the Pie Chart
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-base-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-center mb-8 text-primary">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Users Count Card */}
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-medium">Users Count</h2>
                <p className="text-2xl font-bold">{userCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Count Card */}
        <div className="card bg-secondary text-secondary-content shadow-xl">
          <div className="card-body flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-medium">Listings Count</h2>
                <p className="text-2xl font-bold">{listingCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Online Users Card */}
        <div className="card bg-accent text-accent-content shadow-xl">
          <div className="card-body flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Cloud className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-medium">Online Users</h2>
                <p className="text-2xl font-bold">{onlineUsersCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-primary">
          Listings Distribution
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={listingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {listingStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
