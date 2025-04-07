// import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import DashboardLayout from "./components/DashboardLayout.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import CalendarPage from "@/pages/Calendar.tsx";
import HomePage from "@/pages/Home.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="setting" element={<></>} />
      </Route>
    </Routes>
  </BrowserRouter>,
  // </React.StrictMode>,
);
