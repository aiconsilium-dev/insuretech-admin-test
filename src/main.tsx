import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SidebarProvider } from "./contexts/SidebarContext";
import { QueryProvider } from "./app/providers/QueryProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
