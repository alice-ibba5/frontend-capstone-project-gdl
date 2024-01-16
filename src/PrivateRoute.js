import React from "react";
import { Navigate, Route } from "react-router-dom";
import { isAuthenticated } from "./authUtils.js";

const PrivateRoute = ({ element: Component, ...props }) => {
  return isAuthenticated ? (
    <Route {...props} element={<Component />} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;
