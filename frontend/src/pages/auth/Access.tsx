import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { Button } from "@/components/ui/buttons/Button";
import Input from "@/pages/admin/components/form/Input";
// import API from "@/api/axios";
import { registerUser } from "@/api/auth.api";
import { useLocation } from "react-router-dom";
export default function Access() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
const location = useLocation();
{location.state?.message && <p className="text-green-400">{location.state.message}</p>}
  const handleRegister = async () => {
    try {
      await registerUser({ name, email, password }); // call your API function
      // alert("Signup successful! Please login.");
      navigate("/login", { state: { message: "Signup successful! Please login." } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-white text-2xl font-semibold mb-6">Get Access</h2>

      <div className="text-black/80 flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}

        <Button
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-md mt-3"
          onClick={handleRegister}
        >
          Get Access
        </Button>

        <p className="text-white/80 text-sm mt-2">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
