import { authClient } from "@/lib/auth-client";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

export const ProtectedRoute = () => {
  const { data, isPending } = authClient.useSession();

  if (!data && !isPending) {
    return <Navigate to="/auth/sign-in" replace />;
  } else if (data) {
    return <Outlet />;
  }
  return null;
};
