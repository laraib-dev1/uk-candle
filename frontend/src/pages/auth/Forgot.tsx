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
      <div className="flex flex-col gap-4 text-gray-800">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--theme-primary,#A8734B)] mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-gray-800"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <Button
          className="mt-2 w-full bg-[color:var(--theme-primary,#4f05fa)] hover:bg-[color:var(--theme-primary-dark,#28037d)] text-white rounded-lg py-3 border border-transparent transition-colors"
          onClick={handleReset}
        >
          Send Reset Link
        </Button>

        <p className="text-sm text-gray-700 mt-1">
          Back to login?{" "}
          <Link to="/login" className="text-[var(--theme-primary,#A8734B)] underline">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
