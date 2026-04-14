import { useSelector } from "react-redux";

import { Navigate, Outlet } from "react-router-dom";
// import type { AnyCaaRecord } from "node:dns";

function RequreAuth({requireAuth}: {requireAuth: string[]}) {
    const {role,isLoggedIn} = useSelector((state: any) => state.auth.isAuthenticated);

  return isLoggedIn && requireAuth.find((myRole) => myRole === role) ? 
  <Outlet /> : <Navigate to="/denied" />;
}

export default RequreAuth