import { useState } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function Register() {
  const navigate = useNavigate();
  
  // State for Flow Control
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      // Simulate API call to send OTP
      // await axios.post("/auth/send-otp", { email: form.email });
      console.log("OTP Sent to", form.email); // Debugging
      
      setStep(2); // Move to next step
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      // Send Registration data + OTP to backend
      await axios.post("/auth/register-verify", { 
        ...form, 
        otp 
      });
      
      alert("Registration Successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          {step === 1 
            ? "Join us today! Enter your details below." 
            : `We sent a code to ${form.email}`}
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* STEP 1: User Details Form */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                onChange={handleChange}
                value={form.name}
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                onChange={handleChange}
                value={form.email}
              />
              <input
                name="password"
                type="password"
                placeholder="Create Password"
                className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                onChange={handleChange}
                value={form.password}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-6 hover:bg-indigo-700 transition shadow-lg"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Entry */}
        {step === 2 && (
          <form onSubmit={handleVerifyAndRegister}>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter OTP Code"
                maxLength={6}
                className="w-full border border-gray-300 rounded-xl p-3 text-center text-xl tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
            >
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center mt-4 text-gray-500 text-sm hover:text-indigo-600 transition"
            >
              <IoArrowBack className="mr-1" /> Back to details
            </button>
          </form>
        )}

        {/* Footer */}
        {step === 1 && (
          <div className="text-center mt-6 border-t pt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-indigo-600 font-bold cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}