import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, CandlestickChartIcon } from "lucide-react";
import PasswordInput from "../components/shared/PasswordInput";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [wantReset, setWantReset] = useState(false);
  const { login, isLoggingIn, forgotPassword, lockTimeRemaining } =
    useAuthStore();

  // State for timer countdown
  const [timer, setTimer] = useState(lockTimeRemaining);

  useEffect(() => {
    // Start the countdown if there's remaining lock time
    if (lockTimeRemaining > 0) {
      setTimer(lockTimeRemaining);
      const intervalId = setInterval(() => {
        setTimer((prevTime) => {
          const newTime = Math.max(0, prevTime - 1); // Decrease by 1 second
          if (newTime === 0) {
            clearInterval(intervalId); // Stop the timer when it reaches 0
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup on unmount or when lockTimeRemaining changes
    }
  }, [lockTimeRemaining]); // Dependency on lockTimeRemaining to trigger when it changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await forgotPassword(formData.email);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <CandlestickChartIcon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {wantReset ? "Reset Password" : "Welcome Back"}
              </h1>
              <p className="text-base-content/60">
                {wantReset
                  ? "Enter your email to reset your password"
                  : "Sign in to your account"}
              </p>
            </div>
          </div>

          {/* Form */}
          {wantReset ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="link link-primary"
                  onClick={() => setWantReset(false)}
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-control">
                {/* Password */}
                <PasswordInput
                  label="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
                <div className="text-right mt-2">
                  <button
                    type="button"
                    className="link link-primary text-sm"
                    onClick={() => setWantReset(true)}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoggingIn || lockTimeRemaining > 0}
              >
                {lockTimeRemaining > 0 ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Please wait {timer} seconds
                  </>
                ) : isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Log In"
                )}
              </button>

              <div className="text-center mt-4">
                <Link to="/signup" className="link link-primary">
                  Don’t have an account? Sign up
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Image or Pattern */}
      <div className="hidden lg:block w-full bg-cover">
        <AuthImagePattern />
      </div>
    </div>
  );
};

export default LoginPage;
