import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardStockTransactions from "../pages/Dashboard/DashboardStockTransactions";
import DashboardEditAccount from "../pages/Dashboard/DashboardEditAccount";
import DashboardAccounts from "../pages/Dashboard/DashboardAccount";
import DashboardWarehouseDetail from "../pages/Dashboard/DashboardWarehouseDetail";
import DashboardWarehouse from "../pages/Dashboard/DashboardWarehouse";
import DashboardEditBrand from "../pages/Dashboard/DashboardEditBrand";
import DashboardCreateBrand from "../pages/Dashboard/DashboardCreateBrand";
import DashboardBrands from "../pages/Dashboard/DashboardBrands";
import DashboardEditCategory from "../pages/Dashboard/DashboardEditCategory";
import DashboardCreateCategory from "../pages/Dashboard/DashboardCreateCategory";
import DashboardCategories from "../pages/Dashboard/DashboardCategories";
import LoginForStaffAndAdmin from "../pages/Login/LoginForStaffAndAdmin";
import { ErrorNotFound } from "../pages/NotFound/404NotFound";
import CheckoutPage from "../pages/CartAndPay/Checkout";
import { ProtectedRoute } from "./ProtectedRoute";
import UserProfile from "../pages/User/UserSettings";
import RegisterSuccess from "../pages/Register/RegisterSuccess";
import ProductDetailPage from "../pages/Home/ProductDetail";
import { ConfirmRegister } from "../pages/Register/ConfirmRegister";
import ForgotSuccess from "../pages/Forgot/ForgotPasswordSuccess";
import ResetSuccessPage from "../pages/ResetPassword/ResetSuccess";
import ResetPasswordPage from "../pages/ResetPassword/ResetPassword";
import ForgotPassword from "../pages/Forgot/ForgotPassword";
import Register from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { About } from "../pages/Home/About";
import { Home } from "../pages/Home/Home";
import Shop from "../pages/Home/Shop";
import Logout from "../pages/Login/Logout";
import Dashboard from "../pages/Dashboard/Dashboard";
import UserChangePassword from "../pages/User/UserChangePassword";
import DiscountPage from "../pages/Discount/Discounts";
import DashboardSales from "../pages/Dashboard/DashboardSales";
import DashboardCreateStaffAccount from "../pages/Dashboard/DashboardCreateStaffAccount";
import DashboardViewSaleProduct from "../pages/Dashboard/DashboardViewSaleProduct";
import DashboardCreateSale from "../pages/Dashboard/DashboardCreateSale";
import DashboardEditSale from "../pages/Dashboard/DashboardEditSale";
import DashboardAddProductToSale from "../pages/Dashboard/DashboardAddProductToSale";
import DashboardNotifications from "../pages/Dashboard/DashboardNotifications";
import DashboardCreateNotification from "../pages/Dashboard/DashboardCreateNotification";
import DashboardDiscounts from "../pages/Dashboard/DashboardDiscounts.js";
import DashboardCreateDiscount from "../pages/Dashboard/DashboardCreateDiscount.js";
import DashboardEditDiscount from "../pages/Dashboard/DashboardEditDiscount.js";
import DashboardProducts from "../pages/Dashboard/DashboardProducts.js";
import DashboardOrders from "../pages/Dashboard/DashboardOrders.js";
import OrderPage from "../pages/Order/Order.jsx";

const AppRoutes = ({ toggleSidebar, isOpen }) => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <ProtectedRoute types={["GUEST", "CUSTOMER"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop"
        element={
          <ProtectedRoute types={["GUEST", "CUSTOMER"]}>
            <Shop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedRoute types={["GUEST", "CUSTOMER"]}>
            <About />
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/user/orders"
        element={
          <ProtectedRoute types={["CUSTOMER"]}>
            <OrderPage />
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
      <Route
        path="/confirm-registration/success"
        element={<RegisterSuccess />}
      />
      <Route path="/shop/product/:id" element={<ProductDetailPage />} />
      <Route
        path="/user/information"
        element={
          <ProtectedRoute types={["CUSTOMER"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/discounts" element={<DiscountPage />} />
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
        path="/Dashboard/Accounts/Edit/:userId"
        element={
          <PrivateRoute requiredRoles={["ADMIN"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardEditAccount />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Accounts/Create"
        element={
          <PrivateRoute requiredRoles={["ADMIN"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardCreateStaffAccount />
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

      <Route
        path="/Dashboard/Sales"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardSales />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Sales/:saleId"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardViewSaleProduct />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Sales/Create"
        element={
          <PrivateRoute requiredRoles={["ADMIN"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardCreateSale />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Sales/Edit/:saleId"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardEditSale />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Sales/:saleId/AddProduct"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardAddProductToSale />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Notifications"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardNotifications />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Notifications/Create"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardCreateNotification />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Discounts"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardDiscounts />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Discounts/Create"
        element={
          <PrivateRoute requiredRoles={["ADMIN"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardCreateDiscount />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Discounts/Edit/:discountId"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardEditDiscount />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Products"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardProducts />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/Dashboard/Orders"
        element={
          <PrivateRoute requiredRoles={["ADMIN", "STAFF"]}>
            <DashboardLayout toggleSidebar={toggleSidebar} isOpen={isOpen}>
              <DashboardOrders />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route path="/Dashboard/Logout" element={<Logout />} />
    </Routes>
  );
};

export default AppRoutes;
