import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.tsx";
import "./styles/index.css";
import DashboardLayout from "./components/DashboardLayout.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Calendar from "@/pages/Calendar.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="setting" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
