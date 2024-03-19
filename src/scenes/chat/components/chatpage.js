import Home from "../pages/Home";

import "../style.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Navbar from "scenes/navbar";

function ChatPage() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/" />;
    }

    return children
  };

  return (
    <>
      <Navbar/>
      <Home />
    </>
  );
}

export default ChatPage;
