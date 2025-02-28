import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import ForgetPassword from "./ForgetPassword";

const Login = () => {
    const [values, setValues] = useState({ email: "", password: "" });
    const [message, setMessage] = useState(""); // To display notifications
    const [messageType, setMessageType] = useState(""); // 'success' or 'error'
    const [showForgetPassword, setShowForgetPassword] = useState(false); // Toggle for ForgetPassword component
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const submit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            if (!values.email || !values.password) {
                setMessageType("error");
                setMessage("Email and Password are required.");
                return;
            }

            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email: values.email,
                password: values.password,
            });

            if (response.data.success) {
                // Store login details in session storage
                sessionStorage.setItem("isLoggedIn", "true");

                // Store user details if available
                if (response.data.user) {
                    sessionStorage.setItem("user", JSON.stringify(response.data.user));
                }

                // Store user token if available
                if (response.data.token) {
                    sessionStorage.setItem("token", response.data.token);
                }

                // Dispatch login action
                dispatch(authActions.login());

                setMessageType("success");
                setMessage("Login Successful!");

                // Redirect to home page after 1 second
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setMessageType("error");
                setMessage(response.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setMessageType("error");
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="h-auto flex items-center justify-center px-4 py-16">
            {!showForgetPassword ? (
                <div className="w-full max-w-md bg-zinc-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold text-yellow-100 mb-6 text-center">
                        Log In
                    </h2>
                    <form className="space-y-4" onSubmit={submit}>
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-zinc-400 font-medium mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
                                placeholder="Enter your email"
                                required
                                value={values.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-zinc-400 font-medium mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 text-zinc-900 rounded-lg bg-zinc-200 focus:outline-none focus:ring focus:ring-yellow-400"
                                placeholder="Enter your password"
                                required
                                value={values.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                        >
                            Log In
                        </button>
                    </form>

                    {/* Notification Message */}
                    {message && (
                        <p
                            className={`mt-4 text-center font-semibold ${
                                messageType === "success"
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    {/* Additional Links */}
                    <div className="mt-4 text-center">
                        <p className="text-zinc-400">
                            Forgot your password?{" "}
                            <button
                                onClick={() => setShowForgetPassword(true)}
                                className="text-yellow-400 hover:underline"
                            >
                                Reset Password
                            </button>
                        </p>
                        <p className="text-zinc-400">
                            Don’t have an account?{" "}
                            <a
                                href="/signup"
                                className="text-yellow-400 hover:underline"
                            >
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            ) : (
                <ForgetPassword />
            )}
        </div>
    );
};

export default Login;
