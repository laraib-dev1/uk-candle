import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import { Button } from "@/components/ui/buttons/Button";
import Input from "@/pages/admin/components/form/Input";
import API from "@/api/axios";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    try {
      await API.post("/reset-password", { email });

      setMessage("Password reset link has been sent to your email.");
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link");
      setMessage("");
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-white text-2xl font-semibold mb-6">Reset Password</h2>

      <div className="text-black/80 flex flex-col gap-4">
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}
        {message && <p className="text-green-400">{message}</p>}

        <Button
          className="bg-orange-400 hover:bg-orange-500 text-white rounded-md mt-3"
          onClick={handleReset}
        >
          Send Reset Link
        </Button>

        <p className="text-white/80 text-sm mt-2">
          Back to login? <Link to="/login" className="underline">Login</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
