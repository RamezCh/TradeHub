import UserCard from "../../components/shared/UserCard";
import SearchBar from "../../components/shared/SearchBar";
import { useAdminStore } from "../../store/useAdminStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const AdminUsersPage = () => {
  const {
    isLoading,
    users,
    getUsers,
    totalPages,
    currentPage,
    setPage,
    setSearchTermAndType,
  } = useAdminStore();

  useEffect(() => {
    getUsers(currentPage, 8);
  }, [getUsers, currentPage]);

  const handleSearch = (term, type) => {
    setSearchTermAndType(term, type);
    getUsers();
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-6 mb-6">
          {/* SearchBar */}
          <SearchBar
            dropdownOptions={["username", "firstName", "id"]}
            onSearch={handleSearch}
            placeholder="Search by username, first name, or ID"
          />
        </div>

        <div className="p-6">
          {/* Grid for User Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map((user) => (
                <UserCard
                  key={user._id}
                  profileImg={user.profileImg || "/default-profile-image.png"}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  createdAt={user.createdAt}
                  username={user.username}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex justify-center items-center m-20">
        {/* Pagination */}
        <div className="join space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <input
              key={index}
              className="join-item btn btn-square border border-gray-300 focus:ring focus:ring-blue-300"
              type="radio"
              name="options"
              aria-label={index + 1}
              checked={currentPage === index + 1}
              onChange={() => setPage(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
