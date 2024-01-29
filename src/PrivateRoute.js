import React from "react";
import { Navigate, Route } from "react-router-dom";
import { IsAuthenticated } from "./authUtils.js";

const PrivateRoute = ({ children }) => {
  return IsAuthenticated() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
