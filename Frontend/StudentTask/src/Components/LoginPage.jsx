import { useState } from "react";
import { IoMailOutline, IoLockClosedOutline, IoEye, IoEyeOff } from "react-icons/io5";
import api from "../Services/api"; // Fixed import
import { useNavigate, Link } from "react-router-dom";

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
      // Use the 'api' instance
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">Please enter your details to sign in.</p>

        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">{error}</div>}

        <form onSubmit={onLogin}>
          <div className="mb-4 flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
            <IoMailOutline className="text-gray-400 text-xl" />
            <input type="email" className="w-full bg-transparent ml-3 outline-none text-gray-700" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="mb-6 flex items-center border border-gray-300 rounded-xl px-3 py-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
            <IoLockClosedOutline className="text-gray-400 text-xl" />
            <input type={showPassword ? "text" : "password"} className="w-full bg-transparent ml-3 outline-none text-gray-700" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg disabled:opacity-70">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 border-t pt-4">
          <p className="text-gray-600 text-sm">
            Don’t have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}