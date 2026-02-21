import { useState } from "react";
import api from "../Services/api"; // Fixed import
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      // Calls your backend directly
      const res = await api.post("/auth/register", form);
      
      // Save token and go to dashboard
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Join us today! Enter your details below.</p>

        {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <input name="name" type="text" placeholder="Full Name" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" onChange={handleChange} value={form.name} />
            <input name="email" type="email" placeholder="Email Address" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" onChange={handleChange} value={form.email} />
            <input name="password" type="password" placeholder="Create Password" className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" onChange={handleChange} value={form.password} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-6 hover:bg-indigo-700 transition shadow-lg">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6 border-t pt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}