import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "./context/StateContextProvider.jsx";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext.jsx"; // import dark mode provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DarkModeProvider> {/* Wrap the whole app */}
        <ThirdwebProvider
          clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
          activeChain="sepolia"
        >
          <Router>
            <StateContextProvider>
              <App />
            </StateContextProvider>
          </Router>
        </ThirdwebProvider>
      </DarkModeProvider>
    </AuthProvider>
  </React.StrictMode>
);
