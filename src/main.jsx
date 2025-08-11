import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router} from "react-router-dom";
import {ChainId , ThirdwebProvider} from "@thirdweb-dev/react";
import App from "./App";
import "./index.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThirdwebProvider
    clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    activeChain="sepolia">
      <Router>
        <App />
      </Router>
    </ThirdwebProvider>
  </React.StrictMode>
);