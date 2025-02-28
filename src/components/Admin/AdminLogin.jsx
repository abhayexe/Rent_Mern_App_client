import { useState } from "react";
import axios from "axios";

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Login, 2: OTP verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        setMessageType("error");
        setMessage("Email and Password are required.");
        return;
      }

      const response = await axios.post("http://localhost:3000/api/auth/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setMessageType("success");
        setMessage(response.data.message);
        setStep(2); // Proceed to OTP verification
      } else {
        setMessageType("error");
        setMessage(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Admin Login Error:", error);
      setMessageType("error");
      setMessage("An error occurred during login. Please try again.");
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      if (!otp) {
        setMessageType("error");
        setMessage("OTP is required.");
        return;
      }

      const response = await axios.post("http://localhost:3000/api/auth/admin-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        setMessageType("success");
        setMessage(response.data.message);

        // Save admin login token
        sessionStorage.setItem("token", response.data.token);

        // Redirect or show success message
        setTimeout(() => {
          window.location.href = "/admin-dashboard"; // Redirect to admin dashboard
        }, 2000);
      } else {
        setMessageType("error");
        setMessage(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setMessageType("error");
      setMessage("An error occurred during OTP verification. Please try again.");
    }
  };

  return (
    <div className="h-auto flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-yellow-100 mb-6 text-center">
          Admin Login
        </h2>

        {/* Conditional Rendering for Steps */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-zinc-400 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-400 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300"
            >
              Login
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleOtpVerification}>
            <div>
              <label htmlFor="otp" className="block text-zinc-400 font-medium mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Notification Message */}
        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
