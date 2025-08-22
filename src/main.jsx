//import { Analytics } from "@vercel/analytics/react";
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./containers/Home";
import { GlobalStyle } from "./styles/GlobalStyle.js";

// Se você não vai usar Vercel Analytics, apenas remova a linha <Analytics />
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyle />
    <Home />
  </React.StrictMode>
);
