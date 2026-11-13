"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Enquiry, Project } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "overview" | "enquiries" | "projects";

const statusStyle: Record<Enquiry["status"], string> = {
  new: "border-eng/50 text-eng",
  read: "border-ink/30 text-ink/70",
  responded: "border-tech/50 text-tech",
  archived: "border-line text-tech",
};

export function AdminDashboard({
  session,
  initialEnquiries,
  initialProjects,
  driver,
}: {
  session: { email: string; name: string; role: "ADMIN" | "EDITOR" };
  initialEnquiries: Enquiry[];
  initialProjects: Project[];
  driver: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [openEnquiry, setOpenEnquiry] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const canEdit = session.role === "ADMIN";

  const stats = useMemo(
    () => [
      { label: "Enquiries", value: enquiries.length },
      { label: "New enquiries", value: enquiries.filter((item) => item.status === "new").length },
      { label: "Projects", value: projects.length },
      { label: "Published", value: projects.filter((item) => item.published).length },
    ],
    [enquiries, projects],
  );

  async function updateEnquiry(id: string, status: Enquiry["status"]) {
    setBusy(true);
    const response = await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (data.ok && data.enquiry) {
      setEnquiries((current) => current.map((item) => (item.id === id ? data.enquiry : item)));
      setNotice("Enquiry updated.");
    } else {
      setNotice("Could not update the enquiry.");
    }
    setBusy(false);
  }

  async function deleteProject(id: string) {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (data.ok) {
      setProjects((current) => current.filter((item) => item.id !== id));
      setNotice("Project deleted.");
      router.refresh();
    } else {
      setNotice("Could not delete the project.");
    }
    setBusy(false);
  }

  async function togglePublished(project: Project) {
    setBusy(true);
    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published }),
    });
    const data = await response.json();
    if (data.ok && data.project) {
      setProjects((current) => current.map((item) => (item.id === project.id ? data.project : item)));
      setNotice(data.project.published ? "Project published." : "Project unpublished.");
      router.refresh();
    } else {
      setNotice(data.message || "Could not update the project.");
    }
    setBusy(false);
  }

  async function saveProject(payload: Record<string, unknown>, id?: string) {
    setBusy(true);
    setNotice("");
    const response = await fetch(id ? `/api/admin/projects/${id}` : "/api/admin/projects", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setBusy(false);
    if (!data.ok) {
      setNotice(data.message || "Could not save the project.");
      return data.fieldErrors as Record<string, string> | undefined;
    }
    setEditing(null);
    setNotice(id ? "Project updated." : "Project created.");
    const refreshed = await fetch("/api/admin/projects").then((res) => res.json());
    if (refreshed.ok) setProjects(refreshed.projects);
    router.refresh();
    return undefined;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="edge pb-20">
      <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-eng " />
            <span className="label text-tech">Control room · {driver === "postgresql" ? "PostgreSQL" : "local store"}</span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] uppercase leading-none tracking-[-0.03em] text-ink">
            Admin dashboard
          </h1>
          <p className="mt-2 text-sm text-muted">
            Signed in as {session.email} · {session.role}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/projects" className="btn !py-2.5 !px-4 text-[9px]">
            <span>View site</span>
          </Link>
          <button type="button" onClick={logout} className="btn !py-2.5 !px-4 text-[9px]">
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-line">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "enquiries", label: `Enquiries (${enquiries.length})` },
            { id: "projects", label: `Projects (${projects.length})` },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={cn(
              "px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
              tab === item.id ? "bg-eng text-white" : "text-muted hover:text-eng",
            )}
          >
            {item.label}
          </button>
        ))}
        {notice ? <p className="ml-auto self-center font-mono text-[9px] uppercase tracking-[0.14em] text-eng">{notice}</p> : null}
      </div>

      {tab === "overview" ? (
        <div className="mt-8 grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="border border-line bg-navy-800/40 p-5">
                <p className="font-display text-4xl leading-none text-ink">{stat.value}</p>
                <p className="mt-3 label-tight text-tech">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="border border-line">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <p className="label text-tech">Latest enquiries</p>
              <button type="button" onClick={() => setTab("enquiries")} className="label-tight text-eng hover:text-ink">
                All enquiries →
              </button>
            </div>
            {enquiries.slice(0, 5).map((enquiry) => (
              <div key={enquiry.id} className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-3 last:border-0">
                <span className={cn("border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em]", statusStyle[enquiry.status])}>
                  {enquiry.status}
                </span>
                <span className="text-sm text-ink/85">{enquiry.name}</span>
                <span className="text-xs text-tech">{enquiry.category}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-tech">
                  {formatDateTime(enquiry.createdAt)}
                </span>
              </div>
            ))}
            {!enquiries.length ? <p className="px-5 py-6 text-sm text-muted">No enquiries yet.</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/", label: "Public website", body: "Homepage, divisions, projects and contact." },
              { href: "/projects", label: "Works register", body: "Filter and review every published project." },
              { href: "/privacy", label: "Privacy policy", body: "How enquiry data is handled and retained." },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group border border-line p-5 transition-colors hover:border-ink/30">
                <p className="label-tight text-eng">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "enquiries" ? (
        <div className="mt-8 border border-line">
          <div className="hidden grid-cols-[2fr_1.4fr_1fr_0.8fr_0.9fr] gap-4 border-b border-line px-5 py-3 lg:grid">
            {["Contact", "Category", "Received", "Status", "Actions"].map((header) => (
              <span key={header} className="label-tight text-tech">
                {header}
              </span>
            ))}
          </div>
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="border-b border-line last:border-0">
              <div className="grid gap-4 px-5 py-4 lg:grid-cols-[2fr_1.4fr_1fr_0.8fr_0.9fr] lg:items-center">
                <div>
                  <p className="text-sm text-ink">{enquiry.name}</p>
                  <p className="text-xs text-tech">{enquiry.company || "—"}</p>
                  <a href={`mailto:${enquiry.email}`} className="text-xs text-muted hover:text-eng">
                    {enquiry.email}
                  </a>
                  <p className="text-xs text-muted">{enquiry.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/80">{enquiry.category}</p>
                  <p className="text-xs text-tech">{enquiry.location || "Location not given"}</p>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-tech">{formatDateTime(enquiry.createdAt)}</p>
                <span className={cn("w-fit border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em]", statusStyle[enquiry.status])}>
                  {enquiry.status}
                </span>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={enquiry.status}
                    disabled={busy}
                    onChange={(event) => updateEnquiry(enquiry.id, event.target.value as Enquiry["status"])}
                    className="border border-eng bg-eng px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-white"
                    aria-label={`Status for ${enquiry.name}`}
                  >
                    {(["new", "read", "responded", "archived"] as const).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setOpenEnquiry(openEnquiry === enquiry.id ? null : enquiry.id)}
                    className="border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted hover:text-ink"
                  >
                    {openEnquiry === enquiry.id ? "Hide" : "Read"}
                  </button>
                </div>
              </div>
              {openEnquiry === enquiry.id ? (
                <div className="border-t border-line bg-navy-800/40 px-5 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{enquiry.message}</p>
                  {enquiry.attachment ? (
                    <a
                      href={`/api/admin/enquiries/${enquiry.id}/attachment`}
                      className="mt-3 inline-block border-b border-eng/40 pb-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-eng"
                    >
                      Download attachment
                    </a>
                  ) : null}
                  <a
                    href={`mailto:${enquiry.email}?subject=Your%20SIG-TEL%20enquiry`}
                    className="ml-4 mt-3 inline-block border-b border-line-strong pb-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted hover:text-ink"
                  >
                    Reply by email
                  </a>
                </div>
              ) : null}
            </div>
          ))}
          {!enquiries.length ? <p className="px-5 py-8 text-sm text-muted">No enquiries received yet.</p> : null}
        </div>
      ) : null}

      {tab === "projects" ? (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
            <p className="text-sm text-muted">
              {canEdit ? "Create, edit, publish or remove works in the register." : "Your role can view but not edit projects."}
            </p>
            {canEdit ? (
              <button type="button" onClick={() => setEditing("new")} className="btn btn-solid !py-2.5 !px-4 text-[9px]">
                <span>New project</span>
              </button>
            ) : null}
          </div>

          {editing ? (
            <ProjectForm
              key={editing === "new" ? "new" : editing.id}
              project={editing === "new" ? null : editing}
              busy={busy}
              onCancel={() => setEditing(null)}
              onSubmit={saveProject}
            />
          ) : (
            <div className="border border-line">
              <div className="hidden grid-cols-[2.4fr_1fr_0.8fr_0.7fr_1fr] gap-4 border-b border-line px-5 py-3 lg:grid">
                {["Project", "Division", "Status", "Published", "Actions"].map((header) => (
                  <span key={header} className="label-tight text-tech">
                    {header}
                  </span>
                ))}
              </div>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="grid gap-3 border-b border-line px-5 py-4 last:border-0 lg:grid-cols-[2.4fr_1fr_0.8fr_0.7fr_1fr] lg:items-center"
                >
                  <div>
                    <p className="text-sm text-ink">{project.shortTitle}</p>
                    <p className="text-xs text-tech">
                      {project.client} · {project.location}
                    </p>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{project.division}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{project.status}</p>
                  <button
                    type="button"
                    onClick={() => canEdit && togglePublished(project)}
                    disabled={!canEdit || busy}
                    className={cn(
                      "w-fit border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em]",
                      project.published ? "border-eng/50 text-eng" : "border-line text-tech",
                    )}
                  >
                    {project.published ? "Live" : "Draft"}
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted hover:text-ink"
                    >
                      View
                    </Link>
                    {canEdit ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditing(project)}
                          className="border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted hover:text-ink"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(project.id)}
                          className="border border-signal/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-signal/80 hover:text-signal"
                        >
                          Delete
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ProjectForm({
  project,
  busy,
  onCancel,
  onSubmit,
}: {
  project: Project | null;
  busy: boolean;
  onCancel: () => void;
  onSubmit: (payload: Record<string, unknown>, id?: string) => Promise<Record<string, string> | undefined>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    data.forEach((value, key) => {
      payload[key] = value;
    });
    payload.published = data.get("published") === "on";
    const fieldErrors = await onSubmit(payload, project?.id);
    if (fieldErrors) setErrors(fieldErrors);
  }

  const field = (name: string) => errors[name];

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-navy-800/40 p-5">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <p className="label text-tech">{project ? `Editing · ${project.shortTitle}` : "New project"}</p>
        <button type="button" onClick={onCancel} className="label-tight text-muted hover:text-ink">
          Cancel
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Title" name="title" defaultValue={project?.title} required error={field("title")} className="lg:col-span-2" />
        <Input label="Short title" name="shortTitle" defaultValue={project?.shortTitle} required error={field("shortTitle")} />
        <Input label="Slug" name="slug" defaultValue={project?.slug} required error={field("slug")} />
        <Select
          label="Division"
          name="division"
          defaultValue={project?.division ?? "signalling"}
          options={[
            ["signalling", "Signalling"],
            ["telecom", "Telecommunications"],
          ]}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={project?.status ?? "ongoing"}
          options={[
            ["completed", "Completed"],
            ["ongoing", "Ongoing"],
          ]}
        />
        <Input label="Client" name="client" defaultValue={project?.client} required error={field("client")} />
        <Input label="Client division" name="clientDivision" defaultValue={project?.clientDivision} />
        <Input label="Location" name="location" defaultValue={project?.location} required error={field("location")} />
        <Input label="State" name="state" defaultValue={project?.state} required error={field("state")} />
        <Input label="Latitude" name="lat" defaultValue={String(project?.lat ?? 19.07)} error={field("lat")} />
        <Input label="Longitude" name="lng" defaultValue={String(project?.lng ?? 72.87)} error={field("lng")} />
        <Input label="Order" name="order" defaultValue={String(project?.order ?? 99)} />

        <Textarea label="Summary" name="summary" defaultValue={project?.summary} rows={3} className="sm:col-span-2 lg:col-span-3" error={field("summary")} />
        <Textarea label="Overview" name="overview" defaultValue={project?.overview} rows={4} className="sm:col-span-2 lg:col-span-3" error={field("overview")} />
        <Textarea label="Scope of work (one per line)" name="scope" defaultValue={project?.scope.join("\n")} rows={5} className="sm:col-span-2 lg:col-span-3" />
        <Textarea
          label="Challenges (Title | description, one per line)"
          name="challenges"
          defaultValue={(project?.challenges ?? []).map((item) => `${item.title} | ${item.body}`).join("\n")}
          rows={4}
          className="sm:col-span-2 lg:col-span-3"
        />
        <Textarea
          label="Approach (Title | description, one per line)"
          name="approach"
          defaultValue={(project?.approach ?? []).map((item) => `${item.title} | ${item.body}`).join("\n")}
          rows={4}
          className="sm:col-span-2 lg:col-span-3"
        />
        <Textarea label="Equipment (one per line)" name="equipment" defaultValue={project?.equipment.join("\n")} rows={4} />
        <Textarea label="Results (one per line)" name="results" defaultValue={project?.results.join("\n")} rows={4} />
        <Textarea
          label="Images (one path per line)"
          name="images"
          defaultValue={(project?.images ?? ["/images/hero-daylight.jpg"]).join("\n")}
          rows={4}
          error={field("images")}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <label className="flex items-center gap-3 text-sm text-muted">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="h-3.5 w-3.5 accent-[#183B56]" />
          Published on the website
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="btn !py-2.5 !px-4 text-[9px]">
            <span>Cancel</span>
          </button>
          <button type="submit" disabled={busy} className="btn btn-solid !py-2.5 !px-4 text-[9px] disabled:opacity-60">
            <span>{busy ? "Saving…" : project ? "Save changes" : "Create project"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function Input({
  label,
  name,
  defaultValue,
  required,
  error,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label mb-1 block">{label}</span>
      <input className="field !py-2" name={name} defaultValue={defaultValue} required={required} />
      {error ? <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-signal">{error}</span> : null}
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="field-label mb-1 block">{label}</span>
      <select className="field !py-2 bg-navy" name={name} defaultValue={defaultValue}>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  rows = 3,
  className,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  className?: string;
  error?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label mb-1 block">{label}</span>
      <textarea className="field !py-2 resize-y text-[0.85rem]" name={name} defaultValue={defaultValue} rows={rows} />
      {error ? <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-signal">{error}</span> : null}
    </label>
  );
}
