// import { useState } from "react";
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/navbars/Navbar";
import { Shop } from "./pages/Shop";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { NavLogin } from "./components/navbars/NavLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Logout from "./pages/Logout";
import ForgotSuccess from "./pages/ForgotPasswordSuccess";

function App() {
  const location = useLocation();
  // const state = useState
  const renderNavbar = () => {
    const path = location.pathname;  // Sử dụng location.pathname thay vì window.location.pathname
    if (path === "/" || path === "/shop" || path === "/about" || path === "/contact") {
      return <Navbar />;
    } else if (path.startsWith("/products/")) {
      return <Navbar />;
    } else if (path === "/login" || path === "/register" || path === "/forgotPassword" || path === "/forgotPassword/success") {
      return <NavLogin />;
    }
    return null;
  };
  return (
    <>
      {renderNavbar()}
      <ToastContainer/>
      <div className="container">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgotPassword/success" element={<ForgotSuccess />} />
        </Routes>
      </div>
    </>
  );
}

const WrappedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
