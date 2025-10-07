// 📁 File: pages/topics/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function TopicPage() {
  const router = useRouter();
  const { id } = router.query;
  const [topic, setTopic] = useState<any>(null);
  const [clickTimeout, setClickTimeout] = useState<any>(null); // 🧠 for single vs double click

  async function load() {
    if (!id) return;
    const res = await fetch("/api/topics/" + id);
    if (res.ok) setTopic(await res.json());
  }

  useEffect(() => {
    load();
  }, [id]);

  // ➕ Add file
  async function addFile() {
    const filename = prompt("Enter file name:");
    if (!filename?.trim()) {
      alert("⚠️ Please enter a file name!");
      return;
    }
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content: "", topicId: topic.id }),
    });
    load();
  }

  // ✏️ Rename file
  async function renameFile(id: number, current: string, content: string) {
    const name = prompt("Rename file:", current);
    if (!name?.trim()) return;
    await fetch("/api/files/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name, content }),
    });
    load();
  }

  // ❌ Delete file
  async function deleteFile(id: number) {
    if (!confirm("Delete file?")) return;
    await fetch("/api/files/" + id, { method: "DELETE" });
    load();
  }

  // 🧠 Handle click vs double click
  const handleClick = (id: number) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeout = setTimeout(() => {
      window.location.href = "/files/" + id;
    }, 300); // small delay for single click
    setClickTimeout(timeout);
  };

  const handleDoubleClick = (id: number, name: string, content: string) => {
    if (clickTimeout) clearTimeout(clickTimeout); // cancel single click
    renameFile(id, name, content);
  };

  if (!topic)
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => router.push("/dashboard")}
            className="nav-button" style={{ boxShadow: "3px 3px 5px var(--primary)" }}
          >
            ⬅ Dashboard
          </button>
          <button
            onClick={() => router.push(`/projects/${topic.projectId}`)}
            className="nav-button"
            style={{ boxShadow: "3px 3px 5px var(--project-clr)" }}
          >
            ⬅ {topic.projectTitle}
          </button>
          <button
            onClick={() => router.push(`/sections/${topic.sectionId}`)}
            className="nav-button"
            style={{ boxShadow: "3px 3px 5px var(--section-clr)" }}
          >
            ⬅ {topic.sectionTitle}
          </button>
          <h1
            className="text-2xl font-bold text-center mt-0.5"
            style={{ color: "var(--topic-clr)" }}
          >
            {topic.title}
          </h1>

          {/* ➕ Add File */}
          <div className="flex gap-3 mt-1">
            <button
              onClick={addFile}
              className="px-3 py-1 text-black rounded hover:scale-105 transition"
              style={{ background: "var(--file-clr)" }}
            >
              ➕ File
            </button>
          </div>
        </div>

        {/* Files */}
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Files</h2>
          {topic.files?.map((f: any) => (
            <div
              key={f.id}
              className="p-3 mb-3 rounded-xl border cursor-pointer card-shadow transition hover:scale-[1.01]"
              style={{
                backgroundColor: "transparent",
                boxShadow: "3px 3px 5px var(--file-clr)",
              }}
              onClick={() => handleClick(f.id)}
              onDoubleClick={() =>
                handleDoubleClick(f.id, f.filename, f.content)
              }
            >
              <span className="select-none text-[var(--text-primary)]">
                📄 {f.filename}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(f.id);
                }}
                className="mete-btn-danger"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
