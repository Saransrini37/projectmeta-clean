// 📁 File: pages/files/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function FilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [file, setFile] = useState<any>(null);
  const [content, setContent] = useState("");
  const [clickTimeout, setClickTimeout] = useState<any>(null);

  async function load() {
    if (!id) return;
    const res = await fetch("/api/files/" + id);
    if (res.ok) {
      const data = await res.json();
      setFile(data);
      setContent(data.content || "");
    }
  }

  async function saveContent() {
    if (!file) return;
    await fetch("/api/files/" + file.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, filename: file.filename }),
    });
  }

  async function renameFile() {
    if (!file) return;
    const name = prompt("Rename file:", file.filename);
    if (!name?.trim()) return;
    await fetch("/api/files/" + file.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name, content }),
    });
    load();
  }

  useEffect(() => {
    load();
  }, [id]);

  // 🔹 Auto-save when leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveContent();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveContent();
    };
  }, [file, content]);

  // 🧠 handle single vs double click for filename
  const handleClick = () => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeout = setTimeout(() => {
      // single click – open (refresh or focus)
      router.push("/files/" + id);
    }, 300);
    setClickTimeout(timeout);
  };

  const handleDoubleClick = () => {
    if (clickTimeout) clearTimeout(clickTimeout);
    renameFile();
  };

  if (!file)
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6 space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <button onClick={() => router.push("/dashboard")} className="nav-button" style={{ boxShadow: "3px 3px 5px var(--primary)" }}>
            ⬅ Dashboard
          </button>

          {file.projectId && (
            <button
              onClick={() => router.push(`/projects/${file.projectId}`)}
              className="nav-button"
              style={{ boxShadow: "3px 3px 5px var(--project-clr)" }}
            >
              ⬅ {file.projectTitle}
            </button>
          )}
          {file.sectionId && (
            <button
              onClick={() => router.push(`/sections/${file.sectionId}`)}
              className="nav-button"
              style={{ boxShadow: "3px 3px 5px var(--section-clr)" }}
            >
              ⬅ {file.sectionTitle}
            </button>
          )}
          {file.topicId && (
            <button
              onClick={() => router.push(`/topics/${file.topicId}`)}
              className="nav-button"
              style={{ boxShadow: "3px 3px 5px var(--topic-clr)" }}
            >
              ⬅ {file.topicTitle}
            </button>
          )}

          {/* Editable Filename */}
          <h1
            className="text-2xl font-bold cursor-pointer mt-1 select-none"
            style={{ color: "var(--file-clr)" }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            title="Double-click to rename"
          >
            {file.filename}
          </h1>
        </div>

        {/* 🔹 Themed Notepad */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[12.5rem] md:min-h-[28.125rem] p-3 rounded resize-y font-mono border card-shadow transition-colors duration-300"
          style={{
            backgroundColor: "var(--surface-color)",
            color: "var(--text-primary)",
            borderColor: "var(--accent)",
            boxShadow: "2px 2px 10px var(--file-clr)",
          }}
          placeholder="Start typing..."
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={saveContent}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "#0866FF" }}
          >
            💾 Save
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "var(--danger)" }}
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </Layout>
  );
}
