import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // avoid hydration mismatch

  async function submit(e: any) {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAttempts(0);
        setShowPopup(false);
        router.push("/dashboard");
        return;
      }

      // ❌ Wrong password
      setAttempts((prev) => prev + 1);
      setPassword(""); // clear box
      setShowPopup(true); // show popup

      // hide popup automatically after 2.5 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 2500);
    } catch (err) {
      console.error(err);
      setShowPopup(true);
      setPassword("");
      setTimeout(() => setShowPopup(false), 2500);
    }
  }

  const showChangeLink = attempts >= 3; // 🔹 Show only after 3 failed attempts

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-primary)" }}
    >
      {/* 🌗 Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-14 h-7 rounded-full flex items-center px-1 transition-all duration-300"
          style={{
            backgroundColor:
              theme === "light" ? "var(--accent)" : "var(--surface-color)",
          }}
        >
          <span
            className={`w-6 h-6 rounded-full transition-transform duration-300 ${
              theme === "light"
                ? "translate-x-0 bg-[var(--primary)]"
                : "translate-x-7 bg-[var(--primary)]"
            }`}
          ></span>
        </button>
      </div>

      {/* 🧩 Login Form */}
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-lg shadow p-6 transition-colors duration-300 relative"
        style={{ backgroundColor: "var(--surface-color)" }}
      >
        <h1
          className="text-xl font-bold mb-4 text-center"
          style={{ color: "var(--primary)" }}
        >
          ProjectMate — Login
        </h1>

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3 transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-primary)",
            borderColor: "var(--accent)",
          }}
        />

        <button
          type="submit"
          className="w-full p-2 rounded font-medium transition-colors duration-300 hover:opacity-90"
          style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
          }}
        >
          Login
        </button>

        {/* 🔹 Change Password link — visible only after 3 failed attempts */}
        {showChangeLink && (
          <p
            onClick={() => router.push("/change-password")}
            className="mt-3 text-center text-sm cursor-pointer font-medium hover:underline hover:opacity-80 transition-colors duration-300"
            style={{
              color:
                theme === "light"
                  ? "var(--primary)"
                  : "#FFD700", // ✨ bright gold for dark theme
              textShadow:
                theme === "dark"
                  ? "0px 0px 4px rgba(255, 255, 0, 0.6)" // subtle glow
                  : "none",
            }}
          >
            Change Password
          </p>
        )}

        {/* 🔸 Popup for Invalid Password */}
        {showPopup && (
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded text-sm font-medium shadow-lg animate-fadeInOut"
            style={{
              backgroundColor:
                theme === "light"
                  ? "rgba(255, 0, 0, 0.9)"
                  : "rgba(255, 80, 80, 0.9)",
              color: "#fff",
            }}
          >
            Invalid password ⚠️
          </div>
        )}
      </form>

      {/* 💫 Popup Animation (inline CSS) */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          90% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }
        .animate-fadeInOut {
          animation: fadeInOut 2.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
