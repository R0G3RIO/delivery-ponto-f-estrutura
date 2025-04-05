import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Login from "./Login";
import Redefinir from "./Redefinir";
import FinalizarPedido from "./FinalizarPedido";

export default function App() {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir" element={<Redefinir />} />
        <Route path="/finalizar" element={<FinalizarPedido />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
