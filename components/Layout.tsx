// 📁 components/Layout.tsx
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Layout({ children }: any) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // 🎨 Detect page type → choose color variable
  let headerColor = "var(--primary)";
  if (router.pathname.startsWith("/projects")) headerColor = "var(--project-clr)";
  else if (router.pathname.startsWith("/sections")) headerColor = "var(--section-clr)";
  else if (router.pathname.startsWith("/topics")) headerColor = "var(--topic-clr)";
  else if (router.pathname.startsWith("/files")) headerColor = "var(--file-clr)";

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-primary)",
      }}
    >
      {/* 🧭 Header */}
      <header
        style={{
          backgroundColor: "var(--surface-color)",
          border: `0px solid ${headerColor}`,
          boxShadow: `0 1px 20px ${headerColor}`,
          borderRadius: "0 0 4rem 4rem",
        }}
        className="shadow-lg border-b border-gray-200 p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-2xl font-bold tracking-tight"
            style={{ color: headerColor }}
          >
            ProjectMate
          </Link>

          {/* Buttons */}
          <div className="flex items-center gap-10">
            {/* 🌗 Theme Toggle */}
<button
  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
  onMouseDown={(e) => e.preventDefault()} // prevent focus outline shift
  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border"
  style={{
    backgroundColor: theme === "dark" ? "#222" : "#fff",
    borderColor: theme === "dark" ? "var(--accent)" : "#ddd",
    boxShadow: theme === "dark"
      ? "0 0 15px rgba(255,255,255,0.7)"
      : "0 0 15px rgba(255, 255, 0, 1)",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
  }}
  title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
>
  <span
    style={{
      fontSize: "1.5rem",
      transition: "all 0.3s ease-in-out",
      transform: theme === "dark" ? "rotate(0deg) translate(1px, -1px)" : "rotate(360deg) translate(1px, -1px)",
    }}
  >
    {theme === "dark" ? "🌙" : "☀️"}
  </span>
</button>

            {/* 🚪 Logout */}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 📄 Main Content */}
      <main className="max-w-6xl mx-auto p-1">{children}</main>
    </div>
  );
}

/* 🔹 Self-contained Logout Button (no layout shift) */
function LogoutButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout");
        window.location.href = "/login";
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "40px", // fixed width
        height: "40px", // fixed height
        borderRadius: hovered ? "2rem" : "1.1rem",
        color: "white",
        fontWeight: 500,
        fontSize: "1rem",
        cursor: "pointer",
        backgroundColor: hovered ? "transparent" : "var(--danger)",
        border: "0px solid var(--danger)",
        boxShadow: hovered
          ? "2px 2px 30px rgba(255, 0, 0, 0.8)"
          : "0 0 0 rgba(0, 0, 0, 0)",
        transition: "all 0.3s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Logout"
    >
<span
  style={{
    display: "inline-block",
    transform: hovered ? "scale(2.5) translate(1px, -1px)" : "scale(1) translate(1px, -1px)",
    borderRadius: hovered ? "2.2rem" : "1.1rem",
    transition: "all 0.4s ease-in-out",
  }}
>
  {hovered ? "⛔" : "🏃‍♂️"}
</span>
    </button>
  );
}
