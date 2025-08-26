import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ChatLayout from "./pages/ChatLayout.jsx";
import { getToken } from "./lib/api.js";

const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<PrivateRoute><ChatLayout /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
