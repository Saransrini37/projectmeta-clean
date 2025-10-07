// 📁 File: pages/projects/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<any>(null);
  const [clickTimeout, setClickTimeout] = useState<any>(null);

  async function load() {
    if (!id) return;
    const res = await fetch("/api/projects/" + id);
    if (res.ok) setProject(await res.json());
  }

  useEffect(() => {
    load();
  }, [id]);

  async function addSection() {
    const title = prompt("Enter section name:");
    if (!title?.trim()) {
      alert("⚠️ Please enter a section name!");
      return;
    }
    await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, projectId: project.id }),
    });
    load();
  }

  async function addFile() {
    const filename = prompt("Enter file name:");
    if (!filename?.trim()) {
      alert("⚠️ Please enter a file name!");
      return;
    }
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content: "", projectId: project.id }),
    });
    load();
  }

  async function renameSection(id: number, currentTitle: string) {
    const name = prompt("Rename section:", currentTitle);
    if (!name?.trim()) return;
    await fetch("/api/sections/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name }),
    });
    load();
  }

  async function renameFile(id: number, currentName: string, content: string) {
    const name = prompt("Rename file:", currentName);
    if (!name?.trim()) return;
    await fetch("/api/files/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: name, content }),
    });
    load();
  }

  // 🧠 Handle single click and double click
  const handleClick = (url: string) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeout = setTimeout(() => {
      window.location.href = url;
    }, 300); // single click delay
    setClickTimeout(timeout);
  };

  const handleDoubleClick = (renameFunc: () => void) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    renameFunc();
  };

  if (!project)
    return (
      <Layout>
        <div className="p-6">Loading…</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* 🔹 Header */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="nav-button" style={{ boxShadow: "3px 3px 5px var(--primary)" }}
          >
            ⬅ Dashboard
          </button>
          <h1
            className="text-2xl font-bold mt-0.5"
            style={{ color: "var(--project-clr)" }}
          >
            {project.title}
          </h1>
          <div className="flex gap-3 mt-1">
            <button
              onClick={addSection}
              className="px-3 py-1 text-black rounded"
              style={{ background: "var(--section-clr)" }}
            >
              ➕ Section
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

        {/* 📂 Sections */}
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Sections</h2>
          {project.sections?.map((s: any) => (
            <div
              key={s.id}
              className="p-3 mb-3 rounded-xl border cursor-pointer card-shadow transition hover:scale-[1.01]"
              style={{ backgroundColor: "transparent", boxShadow: "3px 3px 5px var(--section-clr)" }}
              onClick={() => handleClick("/sections/" + s.id)}
              onDoubleClick={() =>
                handleDoubleClick(() => renameSection(s.id, s.title))
              }
            >
              <strong>{s.title}</strong>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!confirm("Delete section?")) return;
                  await fetch("/api/sections/" + s.id, { method: "DELETE" });
                  load();
                }}
                className="mete-btn-danger float-right"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* 📄 Files */}
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Files</h2>
          {project.files?.map((f: any) => (
            <div
              key={f.id}
              className="p-3 mb-3 rounded-xl border cursor-pointer card-shadow transition hover:scale-[1.01]"
              style={{ backgroundColor: "transparent", boxShadow: "3px 3px 5px var(--file-clr)" }}
              onClick={() => handleClick("/files/" + f.id)}
              onDoubleClick={() =>
                handleDoubleClick(() =>
                  renameFile(f.id, f.filename, f.content)
                )
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
