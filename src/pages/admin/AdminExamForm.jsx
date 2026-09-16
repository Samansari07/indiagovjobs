import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  adminGetExam, adminCreateExam, adminUpdateExam, adminSetExamStatus,
} from "../../services/adminService";
import { slugify } from "../../utils/slugify";
import { QUALIFICATIONS } from "../../utils/options";
import ErrorState from "../../components/ErrorState";

const EMPTY = {
  name: "", slug: "", organization: "", level: "", qualification: "",
  description: "", official_url: "", notification_url: "",
  application_start: "", application_end: "", exam_date: "", selection_process: "",
};

function toFormValues(exam) {
  if (!exam) return EMPTY;
  return {
    ...EMPTY,
    ...exam,
    application_start: exam.application_start?.slice(0, 10) ?? "",
    application_end: exam.application_end?.slice(0, 10) ?? "",
    exam_date: exam.exam_date?.slice(0, 10) ?? "",
  };
}

function toPayload(values) {
  return {
    ...values,
    application_start: values.application_start || null,
    application_end: values.application_end || null,
    exam_date: values.exam_date || null,
  };
}

export default function AdminExamForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState(isNew ? "ready" : "loading");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [examStatus, setExamStatus] = useState("draft");
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminGetExam(id)
      .then((exam) => {
        if (!exam) { setStatus("error"); return; }
        setValues(toFormValues(exam));
        setExamStatus(exam.status || "draft");
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id, isNew]);

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleNameChange(val) {
    update("name", val);
    if (!slugTouched) update("slug", slugify(val));
  }

  async function handleSave(publish) {
    setError("");
    if (!values.name || !values.slug || !values.organization) {
      setError("Name, slug and organization are required.");
      return;
    }
    if (publish) {
      const checklistOk = values.official_url && values.application_end && values.qualification;
      if (!checklistOk) {
        setShowChecklist(true);
        setError("Complete the pre-publish checklist before publishing.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = toPayload(values);
      let saved;
      if (isNew) {
        saved = await adminCreateExam({ ...payload, status: publish ? "open" : "draft" });
      } else {
        saved = await adminUpdateExam(id, payload);
        if (publish) saved = await adminSetExamStatus(id, "open");
      }
      navigate(`/admin/exams/${saved.id}`);
    } catch (e) {
      setError(e.message?.includes("duplicate") ? "That slug is already in use." : "Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") return <p className="text-sm text-ink_text-muted">Loading…</p>;
  if (status === "error") return <ErrorState />;

  const checklistItems = [
    { label: "Official source available", ok: Boolean(values.official_url) },
    { label: "Application dates verified", ok: Boolean(values.application_end) },
    { label: "Qualification specified", ok: Boolean(values.qualification) },
    { label: "Last verified date present", ok: !isNew },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">{isNew ? "Create exam" : "Edit exam"}</h1>
        <Link to="/admin/exams" className="text-sm text-ink_text-muted hover:text-ink">Back to exams</Link>
      </div>
      {!isNew && <p className="mt-1 text-xs uppercase tracking-wide text-ink_text-muted">Status: {examStatus}</p>}

      {error && <p role="alert" className="mt-4 rounded-card bg-closed-50 px-3 py-2 text-sm text-closed">{error}</p>}

      <form className="mt-5 space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Name *</label>
            <input id="name" value={values.name} onChange={(e) => handleNameChange(e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium text-ink">Slug *</label>
            <input id="slug" value={values.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="organization" className="mb-1 block text-sm font-medium text-ink">Organization *</label>
            <input id="organization" value={values.organization} onChange={(e) => update("organization", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="level" className="mb-1 block text-sm font-medium text-ink">Level</label>
            <select id="level" value={values.level} onChange={(e) => update("level", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
              <option value="">Select</option>
              <option>National</option><option>State</option><option>Regional</option>
            </select>
          </div>
          <div>
            <label htmlFor="qualification" className="mb-1 block text-sm font-medium text-ink">Qualification</label>
            <select id="qualification" value={values.qualification} onChange={(e) => update("qualification", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
              <option value="">Select</option>
              {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="application_start" className="mb-1 block text-sm font-medium text-ink">Application start</label>
            <input id="application_start" type="date" value={values.application_start} onChange={(e) => update("application_start", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="application_end" className="mb-1 block text-sm font-medium text-ink">Application deadline</label>
            <input id="application_end" type="date" value={values.application_end} onChange={(e) => update("application_end", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="exam_date" className="mb-1 block text-sm font-medium text-ink">Exam date</label>
            <input id="exam_date" type="date" value={values.exam_date} onChange={(e) => update("exam_date", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="official_url" className="mb-1 block text-sm font-medium text-ink">Official URL</label>
            <input id="official_url" type="url" value={values.official_url} onChange={(e) => update("official_url", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="notification_url" className="mb-1 block text-sm font-medium text-ink">Notification URL</label>
            <input id="notification_url" type="url" value={values.notification_url} onChange={(e) => update("notification_url", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea id="description" rows={5} value={values.description} onChange={(e) => update("description", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
        </div>

        {showChecklist && (
          <div className="card border-l-4 border-l-amber">
            <p className="text-sm font-semibold text-ink">Pre-publish checklist</p>
            <ul className="mt-2 space-y-1 text-sm">
              {checklistItems.map((c) => (
                <li key={c.label} className={c.ok ? "text-verified" : "text-closed"}>
                  {c.ok ? "✓" : "✕"} {c.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-t border-surface-border pt-5">
          <button type="button" disabled={saving} onClick={() => handleSave(false)} className="btn-secondary">Save as draft</button>
          <button type="button" disabled={saving} onClick={() => handleSave(true)} className="btn-primary">{saving ? "Saving…" : "Publish"}</button>
        </div>
      </form>
    </div>
  );
}
