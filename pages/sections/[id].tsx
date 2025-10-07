import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function SectionPage() {
  const router = useRouter();
  const { id } = router.query;
  const [section, setSection] = useState<any>(null);
  const [clickTimeout, setClickTimeout] = useState<any>(null); // for single vs double click

  async function load() {
    if (!id) return;
    const res = await fetch("/api/sections/" + id);
    if (res.ok) setSection(await res.json());
  }

  useEffect(() => {
    load();
  }, [id]);

  // ➕ Add Topic
  async function addTopic() {
    const title = prompt("Enter topic name:");
    if (!title?.trim()) {
      alert("⚠️ Please enter a topic name!");
      return;
    }
    await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, sectionId: section.id }),
    });
    load();
  }

  // ➕ Add File
  async function addFile() {
    const filename = prompt("Enter file name:");
    if (!filename?.trim()) {
      alert("⚠️ Please enter a file name!");
      return;
    }
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content: "", sectionId: section.id }),
    });
    load();
  }

  // ✏️ Rename Topic
  async function renameTopic(id: number, current: string) {
    const name = prompt("Rename topic:", current);
    if (!name?.trim()) return;
    await fetch("/api/topics/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name }),
    });
    load();
  }

  // ✏️ Rename File
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

  // 🧠 Handle Click vs Double Click (shared logic)
  const handleClick = (url: string) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeout = setTimeout(() => {
      window.location.href = url;
    }, 150);
    setClickTimeout(timeout);
  };

  const handleDoubleClick = (renameFn: () => void) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    renameFn();
  };

  if (!section)
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            onClick={() => router.push("/dashboard")}
            className="nav-button" style={{ boxShadow: "3px 3px 5px var(--primary)" }}
          >
            ⬅ Dashboard
          </button>
          <button
            onClick={() => router.push(`/projects/${section.projectId}`)}
            className="nav-button"
            style={{ boxShadow: "3px 3px 5px var(--project-clr)" }}
          >
            ⬅ {section.projectTitle}
          </button>
          <h1
            className="text-2xl font-bold mt-0.5"
            style={{ color: "var(--section-clr)" }}
          >
            {section.title}
          </h1>

          {/* Add Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              onClick={addTopic}
              className="px-3 py-1 text-black rounded"
              style={{ background: "var(--topic-clr)" }}
            >
              ➕ Topic
            </button>
            <button
              onClick={addFile}
              className="px-3 py-1 text-black rounded"
              style={{ background: "var(--file-clr)" }}
            >
              ➕ File
            </button>
          </div>
        </div>

        {/* 🧩 Topics */}
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Topics</h2>
          {section.topics?.map((t: any) => (
            <div
              key={t.id}
              className="p-3 mb-3 rounded-xl border cursor-pointer card-shadow transition hover:scale-[1.01]"
              style={{
                backgroundColor: "transparent",
                boxShadow: "3px 3px 5px var(--topic-clr)",
              }}
              onClick={() => handleClick("/topics/" + t.id)}
              onDoubleClick={() => handleDoubleClick(() => renameTopic(t.id, t.title))}
            >
              <strong>{t.title}</strong>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm("Delete topic?")) return;
                  await fetch("/api/topics/" + t.id, { method: "DELETE" });
                  load();
                }}
                className="mete-btn-danger"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* 📁 Files */}
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Files</h2>
          {section.files?.map((f: any) => (
            <div
              key={f.id}
              className="p-3 mb-3 rounded-xl border cursor-pointer card-shadow transition hover:scale-[1.01]"
              style={{
                backgroundColor: "transparent",
                boxShadow: "3px 3px 5px var(--file-clr)",
              }}
              onClick={() => handleClick("/files/" + f.id)}
              onDoubleClick={() =>
                handleDoubleClick(() => renameFile(f.id, f.filename, f.content))
              }
            >
              <span>📄 {f.filename}</span>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm("Delete file?")) return;
                  await fetch("/api/files/" + f.id, { method: "DELETE" });
                  load();
                }}
                className="mete-btn-danger float-right"
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
