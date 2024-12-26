import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  // Mock search results data
  const results = [
    { id: 1, title: "Sample Item 1", description: "Description of item 1" },
    { id: 2, title: "Sample Item 2", description: "Description of item 2" },
    {
      id: 3,
      title: "Sample Service 1",
      description: "Description of service 1",
    },
    {
      id: 4,
      title: "Sample Service 2",
      description: "Description of service 2",
    },
    {
      id: 5,
      title: "Sample Service 3",
      description: "Description of service 3",
    },
    { id: 6, title: "Sample Item 3", description: "Description of item 3" },
    { id: 7, title: "Sample Item 4", description: "Description of item 4" },
    {
      id: 8,
      title: "Sample Service 4",
      description: "Description of service 4",
    },
    {
      id: 9,
      title: "Sample Service 5",
      description: "Description of service 5",
    },
    {
      id: 10,
      title: "Sample Service 6",
      description: "Description of service 6",
    },
    { id: 11, title: "Sample Item 5", description: "Description of item 5" },
    { id: 12, title: "Sample Item 6", description: "Description of item 6" },
    {
      id: 13,
      title: "Sample Service 7",
      description: "Description of service 7",
    },
    {
      id: 14,
      title: "Sample Service 8",
      description: "Description of service 8",
    },
    {
      id: 15,
      title: "Sample Service 9",
      description: "Description of service 9",
    },
  ];

  // Filter mock data based on search parameters
  const filteredResults = results.filter((result) =>
    result.title.toLowerCase().includes(query?.toLowerCase() || "")
  );

  return (
    <div className="min-h-screen bg-base-200 p-8 pt-20">
      <div className="container mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            to="/"
            className="btn btn-outline gap-2 flex items-center hover:bg-base-300"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Search Results for: <span className="text-primary">{query}</span>
          </h1>
          {type && (
            <p className="text-sm text-secondary mt-2">
              Searching in category:{" "}
              <span className="font-semibold">{type}</span>
            </p>
          )}
        </div>

        {/* Results */}
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="card bg-base-100 shadow-lg border border-base-300"
              >
                <div className="card-body">
                  <h2 className="card-title">{result.title}</h2>
                  <p>{result.description}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-sm btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-lg text-gray-500">
              No results found for your query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
