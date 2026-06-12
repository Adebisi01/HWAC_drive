import "./App.css";
import { Routes } from "react-router";
import { Route } from "react-router";
import { Home } from "./pages/home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Signup } from "./pages/auth/sign-up";
import { SignIn } from "./pages/auth/sign-in";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/auth/sign-up" element={<Signup />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
