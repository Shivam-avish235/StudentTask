import { useState } from "react";
import { IoMailOutline, IoLockClosedOutline, IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Integrate Firebase or your Backend OAuth URL here
    window.location.href = "http://your-backend-api.com/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-8">Please enter your details to sign in.</p>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={onLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                <IoMailOutline className="text-gray-400 text-xl" />
                <input
                  type="email"
                  className="w-full bg-transparent ml-3 outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-2">
              <div className="flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                <IoLockClosedOutline className="text-gray-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-transparent ml-3 outline-none text-gray-700 placeholder-gray-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <span className="text-sm text-indigo-600 font-semibold cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-3.5 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
          >
            <FcGoogle className="text-2xl mr-3" />
            Sign in with Google
          </button>
        </div>

        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-indigo-600 font-bold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}