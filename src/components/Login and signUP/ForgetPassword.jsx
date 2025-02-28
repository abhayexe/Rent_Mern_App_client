import { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState(""); // To store the email
  const [otp, setOtp] = useState(""); // To store the OTP
  const [newPassword, setNewPassword] = useState(""); // To store the new password
  const [step, setStep] = useState(1); // To track the current step
  const [message, setMessage] = useState(""); // To display messages

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/send-reset-otp", { email });
      if (response.data.success) {
        setMessage("OTP sent to your email.");
        setStep(2); // Move to the OTP verification step
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtpAndResetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (response.data.success) {
        setMessage("Password reset successfully. Refreshing the page...");
        setTimeout(() => {
          window.location.reload(); // Refresh the page
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-800 px-4">
      <div className="w-full max-w-md bg-zinc-700 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-yellow-100">Reset Password</h1>
        {message && <p className="text-center mb-4 text-sm text-red-500">{message}</p>}
        {step === 1 && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-yellow-200">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-3 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
              placeholder="Enter your email"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-all"
            >
              Send OTP
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-2 text-yellow-200">
              Enter the OTP sent to your email
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-3 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
              placeholder="Enter OTP"
            />
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-yellow-200">
              Enter your new password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-600 rounded-lg p-3 text-black bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
              placeholder="Enter new password"
            />
            <button
              onClick={handleVerifyOtpAndResetPassword}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-all"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
