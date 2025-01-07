import { useAdminStore } from "../../store/useAdminStore.js";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import SearchBar from "../../components/shared/SearchBar";

const AdminLogsPage = () => {
  const {
    getLogs,
    isLoading,
    logs,
    totalPages,
    currentPage,
    setPage,
    setSearchTermAndType,
  } = useAdminStore();

  useEffect(() => {
    getLogs(12);
  }, [getLogs, currentPage]);

  const handleSearch = (term, type) => {
    setSearchTermAndType(term, type);
    getLogs();
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <Loader className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  // TODO onSearch fn needs to be added to the SearchBar component

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center m-6">
        <div className="w-1/2">
          <SearchBar
            onSearch={handleSearch}
            dropdownOptions={["Target ID", "Performed By", "Details"]}
            placeholder="Search by target ID, by perfromer ID (after @), By Details (Log out, Log in)"
          />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-6">Admin Logs</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {logs?.map((log) => (
          <div key={log._id} className="card shadow-lg bg-base-200">
            <div className="card-body">
              <h2 className="text-xl font-bold text-primary">{log.action}</h2>
              <p className="text-sm text-secondary mb-4">{log.targetId}</p>
              <p className="text-sm text-gray-700">
                <strong>Performed By:</strong>{" "}
                {`${log?.performedBy?.firstName} ${log?.performedBy?.lastName} @ ${log?.performedBy?._id}`}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Details:</strong> {log.details}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Timestamp:</strong>{" "}
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            const prevPage = currentPage - 1;
            setPage(prevPage >= 1 ? prevPage : 1);
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-secondary text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            const nextPage = currentPage + 1;
            setPage(nextPage <= totalPages ? nextPage : totalPages);
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminLogsPage;
