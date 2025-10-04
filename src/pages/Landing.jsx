import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full flex justify-center items-center overflow-hidden px-4">
      
      {/* Animated floating mono-colored squares */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#20B024] opacity-20"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              borderRadius: "6px",
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, 40, -40, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              repeat: Infinity,
              duration: 15 + Math.random() * 10,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center px-2">
        
        <motion.h1
          className="text-6xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#20B024] via-[#a6f29b] to-[#1a8f1d] mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          SkyFund
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-black max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          Bring your ideas to life and connect with passionate supporters. 
          Launch campaigns, track progress, and make an impact—all in one place.
        </motion.p>

        <motion.button
          onClick={() => navigate("/login")}
          className="px-8 py-4 bg-gradient-to-r from-[#20B024] to-[#1a8f1d] text-white font-bold rounded-xl shadow-2xl text-lg tracking-wide"
          whileHover={{ scale: 1.08, boxShadow: "0 0 25px #20B024" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Get Started
        </motion.button>

        {/* Subtle artistic decoration: small circles around text */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-[#20B024] rounded-full opacity-10"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, 30, -30, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 12 + Math.random() * 8,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Landing;
