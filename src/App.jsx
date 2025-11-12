import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { CampaignDetails, CreateCampaign, Profile, Home } from "./pages";
import { Sidebar, Navbar } from "./components";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./auth/AuthContext";
import { useDarkMode } from "./context/DarkModeContext.jsx"; // ⬅ Import dark mode context

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { darkMode } = useDarkMode(); // ⬅ Access global dark mode state

  const publicPaths = ["/", "/login", "/signup"];
  const isPublicPage = publicPaths.includes(location.pathname);

  // ✅ Dark and Light Backgrounds
  const bgPattern = darkMode
    ? "bg-[#0d001a] bg-[radial-gradient(#bb99ff22_2px,#0d001a_1px)]"
    : "bg-[#FFFFF7] bg-[radial-gradient(#00000022_2px,#FFFFF7_1px)]";

  return (
    <div className="relative min-h-screen">
      {/* ✅ Background Layer changes with mode */}
      <div
        className={`fixed top-0 z-[-2] h-screen w-screen ${bgPattern} bg-[size:20px_20px] animate-fall transition-all duration-500`}
      />

      <div className="relative sm:-8 p-4 min-h-screen flex flex-row">
        {/* Sidebar (only when logged in) */}
        {!isPublicPage && user && (
          <div className="sm:flex hidden mr-10 relative">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          {/* Navbar (only when logged in) */}
          {!isPublicPage && user && <Navbar />}

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-campaign"
              element={
                <ProtectedRoute>
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaign-details/:id"
              element={
                <ProtectedRoute>
                  <CampaignDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
