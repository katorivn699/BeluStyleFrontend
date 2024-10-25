import { Route, Routes } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import DashboardLayout from "../layouts/DashboardLayout"
import DashboardStockTransactions from "../pages/Dashboard/DashboardStockTransactions"
import DashboardEditAccount from "../pages/Dashboard/DashboardEditAccount"
import DashboardAccounts from "../pages/Dashboard/DashboardAccount"
import DashboardWarehouseDetail from "../pages/Dashboard/DashboardWarehouseDetail"
import DashboardWarehouse from "../pages/Dashboard/DashboardWarehouse"
import DashboardEditBrand from "../pages/Dashboard/DashboardEditBrand"
import DashboardCreateBrand from "../pages/Dashboard/DashboardCreateBrand"
import DashboardBrands from "../pages/Dashboard/DashboardBrands"
import DashboardEditCategory from "../pages/Dashboard/DashboardEditCategory"
import DashboardCreateCategory from "../pages/Dashboard/DashboardCreateCategory"
import DashboardCategories from "../pages/Dashboard/DashboardCategories"
import LoginForStaffAndAdmin from "../pages/Login/LoginForStaffAndAdmin"
import { ErrorNotFound } from "../pages/NotFound/404NotFound"
import CheckoutPage from "../pages/CartAndPay/Checkout"
import { ProtectedRoute } from "./ProtectedRoute"
import UserProfile from "../pages/User/UserSettings"
import RegisterSuccess from "../pages/Register/RegisterSuccess"
import ProductDetailPage from "../pages/Home/ProductDetail"
import { ConfirmRegister } from "../pages/Register/ConfirmRegister"
import ForgotSuccess from "../pages/Forgot/ForgotPasswordSuccess"
import ResetSuccessPage from "../pages/ResetPassword/ResetSuccess"
import ResetPasswordPage from "../pages/ResetPassword/ResetPassword"
import ForgotPassword from "../pages/Forgot/ForgotPassword"
import Register from "../pages/Register/Register"
import { Login } from "../pages/Login/Login"
import { About } from "../pages/Home/About"
import { Home } from "../pages/Home/Home"
import Shop from "../pages/Home/Shop"
import Logout from "../pages/Login/Logout"
import Dashboard from "../pages/Dashboard/Dashboard"
import UserChangePassword from "../pages/User/UserChangePassword"

const AppRoutes = ({ toggleSidebar, isOpen}) => {
    return (
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
            path="/reset-password"
            element={
              <ProtectedRoute types={["GUEST"]}>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password/success"
            element={
              <ProtectedRoute types={["GUEST"]}>
                <ResetSuccessPage />
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
          <Route
            path="/user/information"
            element={
              <ProtectedRoute types={["CUSTOMER"]}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/changePassword"
            element={
              <ProtectedRoute types={["CUSTOMER"]}>
                <UserChangePassword />
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
    )
}

export default AppRoutes;