import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Navbar } from "./components/navbars/Navbar";
import { Login } from "./pages/Login/Login";
import { NavLogin } from "./components/navbars/UserAccessBar";
import { Shop } from "./pages/Home/Shop";
import { About } from "./pages/Home/About";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/Forgot/ForgotPassword";
import { ConfirmRegister } from "./pages/Register/ConfirmRegister";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./pages/Login/Logout";
import ForgotSuccess from "./pages/Forgot/ForgotPasswordSuccess";
import Footer from "./components/footer/CustomerFooter";
import ProductDetailPage from "./pages/Home/ProductDetail";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ErrorNotFound } from "./pages/NotFound/404NotFound";
import RegisterSuccess from "./pages/Register/RegisterSuccess";
import LoginForStaffAndAdmin from "./pages/Login/LoginForStaffAndAdmin";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardCategories from "./pages/Dashboard/DashboardCategories";
import DashboardCreateCategory from "./pages/Dashboard/DashboardCreateCategory";
import DashboardEditCategory from "./pages/Dashboard/DashboardEditCategory";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardBrands from "./pages/Dashboard/DashboardBrands";
import DashboardCreateBrand from "./pages/Dashboard/DashboardCreateBrand";
import DashboardEditBrand from "./pages/Dashboard/DashboardEditBrand";
import UserProfile from "./pages/User/UserSettings.jsx";
import CartPage from "./pages/CartAndPay/Cart.jsx";
import CheckoutPage from "./pages/CartAndPay/Checkout.jsx";
import DashboardWarehouse from "./pages/Dashboard/DashboardWarehouse";
import DashboardWarehouseDetail from "./pages/Dashboard/DashboardWarehouseDetail";
import DashboardAccounts from "./pages/Dashboard/DashboardAccount";
import DashboardEditAccount from "./pages/Dashboard/DashboardEditAccount";
import DashboardStockTransactions from "./pages/Dashboard/DashboardStockTransactions.js";

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
      path.startsWith("/shop/product/") ||
      path === "/user/information" ||
      path === "/cart" ||
      path === "/checkout"
    ) {
      return <Navbar />;
    } else if (
      path === "/login" ||
      path === "/register" ||
      path === "/forgotPassword" ||
      path === "/forgotPassword/success" ||
      path === "/register/confirm-registration" ||
      path === "/reset-password"
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
      path.startsWith("/shop/product/") ||
      path === "/cart" ||
      path === "/checkout"
    ) {
      return (
        <div className="pt-10">
          <Footer />
        </div>
      );
    }
    return null;
  };

  const applyPadding = () => {
    const path = location.pathname;
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
      path === "/register/confirm-registration" ||
      path === "/user/information" ||
      path === "/cart" ||
      path === "/checkout"
    ) {
      return "pt-[90px]";
    }
    return "";
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
              <ProtectedRoute types={["GUEST"]}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute types={["GUEST"]}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <ProtectedRoute types={["GUEST"]}>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute types={["CUSTOMER"]}>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route path="/forgotPassword/success" element={<ForgotSuccess />} />
          <Route
            path="/register/confirm-registration"
            element={
              <ProtectedRoute types={["REGISTER"]}>
                <ConfirmRegister />
              </ProtectedRoute>
            }
          />
          <Route path="/register/success" element={<RegisterSuccess />} />
          <Route path="/shop/product/:id" element={<ProductDetailPage />} />
          <Route path="/reset-password" element={
            <ProtectedRoute types={["REGISTER", "CUSTOMER"]}>
            <ProductDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/user/information"
            element={
              <ProtectedRoute types={["CUSTOMER"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute types={["CUSTOMER"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
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
            path="/Dashboard/Categories/:categoryId"
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
            path="/Dashboard/Brands/:brandId"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardEditBrand />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Warehouse"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardWarehouse />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Warehouse/:stockId"
            element={
              <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardWarehouseDetail />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Accounts"
            element={
              <PrivateRoute requiredRoles={["ADMIN"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardAccounts />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/Accounts/:userId"
            element={
              <PrivateRoute requiredRoles={["ADMIN"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardEditAccount />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Dashboard/StockTransactions"
            element={
              <PrivateRoute requiredRoles={["ADMIN"]}>
                <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
                  <DashboardStockTransactions />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route path="/Dashboard/Logout" element={<Logout />} />
        </Routes>
      </div>
      <ToastContainer
        autoClose={2500}
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
