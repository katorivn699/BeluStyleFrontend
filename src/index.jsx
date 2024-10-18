import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import AuthProvider from "react-auth-kit";
import { BrowserRouter } from "react-router-dom";
import createStore from "react-auth-kit/createStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "react-use-cart";

const store = createStore({
  authName: "_auth",
  authType: "localstorage",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <GoogleOAuthProvider clientId="300845919892-bbvpmkgcep2j7jl8dfk09spmf4lf95sv.apps.googleusercontent.com">
        <BrowserRouter basename="/">
          <CartProvider>
            <App />
          </CartProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);
