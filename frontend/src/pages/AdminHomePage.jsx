import { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Users, FileText, Cloud } from "lucide-react";
import { Loader } from "lucide-react";

const AdminHomePage = () => {
  const { userCount, listingCount, onlineUsersCount, fetchDashboardData } =
    useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardData().finally(() => setIsLoading(false));

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-center mb-6 text-primary">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Count Card */}
        <div className="card w-full min-h-full bg-primary shadow-xl p-4">
          <div className="card-body flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Users
                className="h-6 w-6 text-primary-content"
                aria-label="Users Icon"
              />
              <div>
                <h2 className="text-xl font-medium text-primary-content">
                  Users Count
                </h2>
                <p className="text-2xl font-bold text-primary-content">
                  {userCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Count Card */}
        <div className="card w-full min-h-full bg-secondary shadow-xl p-4">
          <div className="card-body flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <FileText
                className="h-6 w-6 text-secondary-content"
                aria-label="Listings Icon"
              />
              <div>
                <h2 className="text-xl font-medium text-secondary-content">
                  Listings Count
                </h2>
                <p className="text-2xl font-bold text-secondary-content">
                  {listingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Online Users Card */}
        <div className="card w-full min-h-full bg-accent shadow-xl p-4">
          <div className="card-body flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Cloud
                className="h-6 w-6 text-accent-content"
                aria-label="Online Users Icon"
              />
              <div>
                <h2 className="text-xl font-medium text-accent-content">
                  Online Users
                </h2>
                <p className="text-2xl font-bold text-accent-content">
                  {onlineUsersCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
