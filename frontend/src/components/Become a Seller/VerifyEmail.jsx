import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = ({ email, resendVerificationEmail, isVerified }) => {
  const [timer, setTimer] = useState(60);
  const [verified, setVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const result = await isVerified(email);
        setVerified(result);
      } catch (error) {
        console.error("Error checking email verification status:", error);
      }
    };

    checkEmailVerification();
  }, [email, isVerified]);

  useEffect(() => {
    if (verified) {
      const timerId = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timerId);
    }
  }, [verified, navigate]);

  const handleResendEmail = async () => {
    if (verified) return;
    try {
      await resendVerificationEmail(email);
      setTimer(60);
      setEmailSent(true);
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-xl p-6 bg-base-100">
        {verified ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-success w-16 h-16 mb-4" />
            <p className="text-lg font-semibold text-success">
              Your email has been successfully verified!
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">
              Verify Your Email
            </h2>

            {/* Message about email verification */}
            {!emailSent ? (
              <p className="text-center text-base-content mb-6">
                Please verify your email address to continue.
              </p>
            ) : (
              <p className="text-center text-base-content mb-6">
                Verification email has been sent! Please check your inbox to
                verify your email.
              </p>
            )}
            <button
              onClick={handleResendEmail}
              className="btn btn-primary w-full"
              disabled={timer > 0}
            >
              {timer > 0 ? `Wait ${timer}s` : "Send Verification Email"}
            </button>
            {timer > 0 && (
              <p className="text-sm text-center text-base-content mt-4">
                You can resend the email after the timer expires.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
