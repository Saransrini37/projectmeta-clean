import { useState } from "react";
import { useRouter } from "next/router";

export default function ChangePassword() {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // 🔹 Send OTP
  async function sendOTP() {
    setLoading(true);
    const res = await fetch("/api/auth/send-otp", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ OTP sent to your registered email.");
      setStep("verify");
    } else {
      setMessage("❌ " + data.error);
    }
  }

  // 🔹 Verify OTP
  async function verifyOTP() {
    setLoading(true);
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ OTP verified! Please enter your new password.");
      setStep("reset");
    } else {
      setMessage("❌ " + data.error);
    }
  }

  // 🔹 Reset Password
  async function resetPassword() {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    if (newPassword.length < 4) {
      setMessage("❌ Password must be at least 4 characters long!");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");

      // 🔸 Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setMessage("❌ " + data.error);
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="w-full max-w-sm rounded-lg shadow p-6 transition-all duration-300"
        style={{ backgroundColor: "var(--surface-color)" }}
      >
        <h1
          className="text-xl font-bold mb-4 text-center"
          style={{ color: "var(--primary)" }}
        >
          🔐 ProjectMate — Change Password
        </h1>

        {/* Step 1: Send OTP */}
        {step === "email" && (
          <button
            onClick={sendOTP}
            className="w-full p-2 bg-[var(--primary)] text-white rounded transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {/* Step 2: Verify OTP */}
        {step === "verify" && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-2 rounded mb-3 text-center"
              style={{ borderColor: "var(--accent)" }}
            />
            <button
              onClick={verifyOTP}
              className="w-full p-2 bg-[var(--primary)] text-white rounded"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === "reset" && (
          <>
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <button
              onClick={resetPassword}
              className="w-full p-2 bg-[var(--primary)] text-white rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </>
        )}

        {message && (
          <div className="mt-4 text-center text-sm font-medium">{message}</div>
        )}
      </div>
    </div>
  );
}
