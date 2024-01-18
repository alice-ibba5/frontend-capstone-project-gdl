import React from "react";
import { Navigate, Route } from "react-router-dom";
import { isAuthenticated } from "./authUtils.js";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
