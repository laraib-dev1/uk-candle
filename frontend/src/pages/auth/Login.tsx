import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { Button } from "@/components/ui/buttons/Button";
import Input from "@/pages/admin/components/form/Input";
import { loginUser } from "@/api/auth.api";
import { useLocation } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


const location = useLocation();
{location.state?.message && (
  <p className="text-green-600">{location.state.message}</p>
)}
const handleLogin = async () => {
  try {
    const data = await loginUser({ email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // check previous page user came from
    const from = location.state?.from;

    if (data.user.role === "admin") {
      return navigate("/admin/dashboard");
    }

    // if user came from a protected page → redirect back there
    if (from) {
      return navigate(from);
    }

    // otherwise → go to landing page
    navigate("/");
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  }
};


  return (
    <AuthLayout>
      <h2 className="text-white text-2xl font-semibold mb-6">Welcome Back!</h2>

      <div className="text-black/80 flex flex-col gap-4">
        <Input
          label="Email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <div className="flex justify-end text-sm text-white/70">
          <Link to="/forgot" className="underline">
            Forgot Password?
          </Link>
        </div>

        <Button
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-md mt-3"
          onClick={handleLogin}
        >
          Login
        </Button>

        <p className="text-white/80 text-sm mt-2">
          Don’t have an account?{" "}
          <Link to="/access" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
