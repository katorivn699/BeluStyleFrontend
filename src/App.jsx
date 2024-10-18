import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Navbar } from "./components/navbars/Navbar";
import { Login } from "./pages/Login";
import { NavLogin } from "./components/navbars/UserAccessBar";
import { Shop } from "./pages/Home/Shop";
import { About } from "./pages/Home/About";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import { ConfirmRegister } from "./pages/Register/ConfirmRegister";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./pages/Logout";
import ForgotSuccess from "./pages/ForgotPasswordSuccess";
import "@smastrom/react-rating/style.css";
import Footer from "./components/footer/CustomerFooter";
import ProductDetailPage from "./pages/Home/ProductDetail";
import {
  CustomerProtectedRoute,
  RegisterProtectedRoute,
} from "./routes/ProtectedRoute";
import { ErrorNotFound } from "./pages/NotFound/404NotFound";
import RegisterSuccess from "./pages/Register/RegisterSuccess";
import LoginForStaffAndAdmin from "./pages/LoginForStaffAndAdmin";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardCategories from "./pages/DashboardCategories";
import DashboardCreateCategory from "./pages/DashboardCreateCategory";
import DashboardEditCategory from "./pages/DashboardEditCategory";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboardbrands from "./pages/DashboardBrands";
import DashboardBrands from "./pages/DashboardBrands";
import DashboardCreateBrand from "./pages/DashboardCreateBrand";
import DashboardEditBrand from "./pages/DashboardEditBrand";

function App() {
  const location = useLocation();
  const [theme] = useState(localStorage.getItem("theme") || "light");

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const renderNavbar = () => {
    const path = location.pathname;
    if (
      path === "/" ||
      path === "/shop" ||
      path === "/about" ||
      path === "/contact" ||
      path.startsWith("/shop/product/")
    ) {
      return <Navbar />;
    } else if (
      path === "/login" ||
      path === "/register" ||
      path === "/forgotPassword" ||
      path === "/forgotPassword/success" ||
      path === "/register/confirm-registration"
    ) {
      return <NavLogin />;
    }
    return null;
  };

  const renderFooter = () => {
    const path = location.pathname;
    // Define routes that should show the footer
    if (
      path === "/" ||
      path === "/shop" ||
      path === "/about" ||
      path === "/contact" ||
      path.startsWith("/shop/product/")
    ) {
      return (
        <div className="pt-10">
          <Footer />
        </div>
      );
    }
    return null; // For login, register, forgot password, etc. no footer
  };

  const applyPadding = () => {
    const path = location.pathname;
    // Apply padding to all routes except 404 page
    if (
      path === "/" ||
      path === "/shop" ||
      path === "/about" ||
      path === "/contact" ||
      path.startsWith("/shop/product/") ||
      path === "/login" ||
      path === "/register" ||
      path === "/forgotPassword" ||
      path === "/forgotPassword/success" ||
      path === "/register/confirm-registration"
    ) {
      return "pt-[90px]";
    }
    return ""; // No padding for ErrorNotFound or other specific routes
  };

  return (
    <>
      {renderNavbar()}
      <div className={applyPadding()}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={
              <CustomerProtectedRoute>
                <Login />
              </CustomerProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgotPassword/success" element={<ForgotSuccess />} />
          <Route
            path="/register/confirm-registration"
            element={
              <RegisterProtectedRoute>
                <ConfirmRegister />
              </RegisterProtectedRoute>
            }
          />
          <Route path="/register/success" element={<RegisterSuccess />} />
          <Route path="/shop/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<ErrorNotFound />} />

          <Route
            path="/LoginForStaffAndAdmin"
            element={<LoginForStaffAndAdmin />}
          />

          {/* Protect the Dashboard route */}
          <Route
            path="/Dashboard"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Categories"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardCategories />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Categories/Create"
            element={
              <PrivateRoute requiredRoles={["ADMIN"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardCreateCategory />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Categories/Edit/:categoryId"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardEditCategory />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Brands"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardBrands />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Brands/Create"
            element={
              <PrivateRoute requiredRoles={["ADMIN"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardCreateBrand />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Brands/Edit/:brandId"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardEditBrand />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route path="/Dashboard/Logout" element={<Logout />} />
        </Routes>
      </div>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      {renderFooter()}
    </>
  );
}

const WrappedApp = () => <App />;

export default WrappedApp;
