import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import signupImage from "../assets/signin-image.png"; // import your image here

const Signup = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-4 shadow-secondary rounded-[10px] overflow-hidden bg-white">
        
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-auto">
          <img
            src={signupImage}
            alt="Signup"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-[#3a3a43] mb-6 text-center">
            Create an Account
          </h2>
          {error && (
            <p className="text-red-500 text-center text-sm mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="py-3 bg-[#20B024] hover:bg-[#1a8f1d] text-white rounded-lg font-semibold transition"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-[#3a3a43]">
            Already have an account?{" "}
            <span
              className="text-[#20B024] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
