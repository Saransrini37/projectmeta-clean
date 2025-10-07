import { useEffect, useState } from "react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clickTimeout, setClickTimeout] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
  }

  async function createProject() {
    const name = prompt("Enter project name:");
    if (!name?.trim()) {
      alert("⚠️ Please enter a project name!");
      return;
    }
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name }),
    });
    load();
  }

  async function renameProject(id: number, currentTitle: string) {
    const name = prompt("Rename project:", currentTitle);
    if (!name?.trim()) return;
    await fetch("/api/projects/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: name }),
    });
    load();
  }

  async function deleteProject(id: number) {
    if (!confirm("Delete project?")) return;
    await fetch("/api/projects/" + id, { method: "DELETE" });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  const handleClick = (id: number, title: string) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    const timeout = setTimeout(() => {
      window.location.href = "/projects/" + id;
    }, 150);
    setClickTimeout(timeout);
  };

  const handleDoubleClick = (id: number, title: string) => {
    if (clickTimeout) clearTimeout(clickTimeout);
    renameProject(id, title);
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex gap-4 mb-4 flex-wrap items-center">
          <h2
            className="text-2xl font-bold mb-4"
          >
            Projects
          </h2>

          <div className="mb-4">
            <button
              onClick={createProject}
              className="px-3 py-1 text-black rounded hover:scale-105 transition"
              style={{ background: "var(--project-clr)" }}
            >
              ➕ Project
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-3 py-2 mb-3 rounded-xl border cursor-pointer transition card-shadow hover:scale-[1.01]"
              style={{
                backgroundColor: "transparent",
                boxShadow: "3px 3px 5px var(--project-clr)",
                borderColor: "var(--project-clr)",
              }}
              onClick={() => handleClick(p.id, p.title)}
              onDoubleClick={() => handleDoubleClick(p.id, p.title)}
            >
              <h3 className="font-semibold text-2xl text-[var(--text-primary)] select-none">
                {p.title}
              </h3>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(p.id);
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
