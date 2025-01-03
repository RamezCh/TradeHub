import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PasswordInput from "../components/shared/PasswordInput";
import { useAuthStore } from "../store/useAuthStore";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { resetPassword, isResetingPassword, error } = useAuthStore();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Attempt to reset the password
    const result = await resetPassword({
      token,
      password: formData.newPassword,
    });

    if (result.success) {
      // If successful, navigate to the login page
      navigate("/login");
    } else {
      // Handle any error that occurs
      alert("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-neutral shadow-xl rounded-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-primary">
          Reset Your Password
        </h1>
        <p className="text-center text-base-content/70">
          Enter a new password to reset your account access.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && (
            <div className="alert alert-error shadow-lg">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <PasswordInput
              label="New Password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="form-control">
            <PasswordInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${
              isResetingPassword ? "btn-disabled" : ""
            }`}
            disabled={isResetingPassword}
          >
            {isResetingPassword ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
