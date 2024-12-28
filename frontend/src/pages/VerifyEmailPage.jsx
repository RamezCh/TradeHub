import { useParams } from "react-router-dom";
import { useVerificationStore } from "../store/useVerificationStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { verified, loading, verifyEmail } = useVerificationStore();

  useEffect(() => {
    verifyEmail(token);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8 p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader className="animate-spin text-gray-500" size={50} />
        </div>
      ) : (
        <>
          <img
            src="https://contenthub-static.grammarly.com/blog/wp-content/uploads/2023/08/Formal_Email.png"
            alt="Email Verification"
            className="max-w-full sm:max-w-sm rounded-lg shadow-2xl"
          />
          <div className="w-full max-w-sm">
            {verified ? (
              <div className="card shadow-xl bg-green-100 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-green-800">
                  Success!
                </h2>
                <p className="text-lg text-green-700">
                  Your email has been successfully verified.
                </p>
              </div>
            ) : (
              <div className="card shadow-xl bg-red-100 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-red-800">Oops!</h2>
                <p className="text-lg text-red-700">
                  Failed to verify email. Please try again.
                </p>
              </div>
            )}
            <Link to={"/"}>
              <button className="btn btn-primary mt-6 w-full py-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none">
                Explore Home Page
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
