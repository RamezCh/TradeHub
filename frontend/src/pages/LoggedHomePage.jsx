import FilterSidebar from "../components/shared/FilterSidebar";

const LoggedHomePage = () => {
  return (
    <div className="flex">
      {/* Sidebar with Filters */}
      <FilterSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Items and Services</h1>
      </main>
    </div>
  );
};

export default LoggedHomePage;
