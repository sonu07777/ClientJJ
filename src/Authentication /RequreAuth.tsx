import { useSelector } from "react-redux";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../Redux/Store";

function RequreAuth({requireAuth}: {requireAuth: string[]}) {
  const location = useLocation();
  const { role, isLoggedIn } = useSelector((state: RootState) => state.Auth);

  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (!requireAuth.includes(role)) {
    return <Navigate to="/denied" replace />;
  }

  return <Outlet />;
}

export default RequreAuth
