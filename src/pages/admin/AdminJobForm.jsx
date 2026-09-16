import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  adminGetJob, adminCreateJob, adminUpdateJob, adminSetJobStatus,
} from "../../services/adminService";
import { slugify } from "../../utils/slugify";
import { QUALIFICATIONS, STREAMS, CATEGORIES, GENDERS, INDIAN_STATES } from "../../utils/options";
import ErrorState from "../../components/ErrorState";

const EMPTY = {
  title: "", slug: "", organization: "", department: "", state: "",
  job_type: "", qualification: "", stream: "", vacancies: "",
  age_min: "", age_max: "", salary_min: "", salary_max: "",
  application_start: "", application_end: "", exam_date: "",
  selection_process: "", description: "", official_url: "", notification_url: "",
  eligible_categories: [], eligible_genders: [], eligible_states: [],
};

function toFormValues(job) {
  if (!job) return EMPTY;
  return {
    ...EMPTY,
    ...job,
    vacancies: job.vacancies ?? "",
    age_min: job.age_min ?? "",
    age_max: job.age_max ?? "",
    salary_min: job.salary_min ?? "",
    salary_max: job.salary_max ?? "",
    application_start: job.application_start?.slice(0, 10) ?? "",
    application_end: job.application_end?.slice(0, 10) ?? "",
    exam_date: job.exam_date?.slice(0, 10) ?? "",
    eligible_categories: job.eligible_categories ?? [],
    eligible_genders: job.eligible_genders ?? [],
    eligible_states: job.eligible_states ?? [],
  };
}

function toPayload(values) {
  return {
    ...values,
    vacancies: values.vacancies === "" ? null : Number(values.vacancies),
    age_min: values.age_min === "" ? null : Number(values.age_min),
    age_max: values.age_max === "" ? null : Number(values.age_max),
    salary_min: values.salary_min === "" ? null : Number(values.salary_min),
    salary_max: values.salary_max === "" ? null : Number(values.salary_max),
    application_start: values.application_start || null,
    application_end: values.application_end || null,
    exam_date: values.exam_date || null,
  };
}

function MultiCheck({ label, options, selected, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() =>
                onChange(checked ? selected.filter((s) => s !== opt) : [...selected, opt])
              }
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                checked ? "border-ink bg-ink text-white" : "border-surface-border text-ink_text-muted hover:border-ink"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminJobForm() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState(isNew ? "ready" : "loading");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [jobStatus, setJobStatus] = useState("draft");
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    if (isNew) return;
    adminGetJob(id)
      .then((job) => {
        if (!job) { setStatus("error"); return; }
        setValues(toFormValues(job));
        setJobStatus(job.status || "draft");
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id, isNew]);

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleTitleChange(val) {
    update("title", val);
    if (!slugTouched) update("slug", slugify(val));
  }

  async function handleSave(publish) {
    setError("");
    if (!values.title || !values.slug || !values.organization) {
      setError("Title, slug and organization are required.");
      return;
    }
    if (publish) {
      const checklistOk =
        values.official_url &&
        values.application_end &&
        (values.qualification || values.eligible_categories.length) &&
        values.vacancies !== "";
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
        saved = await adminCreateJob({ ...payload, status: publish ? "open" : "draft" });
      } else {
        saved = await adminUpdateJob(id, payload);
        if (publish) saved = await adminSetJobStatus(id, "open");
      }
      navigate(`/admin/jobs/${saved.id}`);
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
    { label: "Eligibility verified", ok: Boolean(values.qualification || values.eligible_categories.length) },
    { label: "Vacancies verified", ok: values.vacancies !== "" },
    { label: "Last verified date present", ok: !isNew },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">{isNew ? "Create job" : "Edit job"}</h1>
        <Link to="/admin/jobs" className="text-sm text-ink_text-muted hover:text-ink">Back to jobs</Link>
      </div>
      {!isNew && <p className="mt-1 text-xs uppercase tracking-wide text-ink_text-muted">Status: {jobStatus}</p>}

      {error && <p role="alert" className="mt-4 rounded-card bg-closed-50 px-3 py-2 text-sm text-closed">{error}</p>}

      <form className="mt-5 space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink">Title *</label>
            <input id="title" value={values.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
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
            <label htmlFor="department" className="mb-1 block text-sm font-medium text-ink">Department</label>
            <input id="department" value={values.department} onChange={(e) => update("department", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label htmlFor="state" className="mb-1 block text-sm font-medium text-ink">State</label>
            <select id="state" value={values.state} onChange={(e) => update("state", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
              <option value="">Select</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="job_type" className="mb-1 block text-sm font-medium text-ink">Job type</label>
            <select id="job_type" value={values.job_type} onChange={(e) => update("job_type", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
              <option value="">Select</option>
              <option>Permanent</option><option>Temporary</option><option>Contract</option>
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
            <label htmlFor="stream" className="mb-1 block text-sm font-medium text-ink">Stream</label>
            <select id="stream" value={values.stream} onChange={(e) => update("stream", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
              <option value="">Select</option>
              {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="vacancies" className="mb-1 block text-sm font-medium text-ink">Vacancies</label>
            <input id="vacancies" type="number" min="0" value={values.vacancies} onChange={(e) => update("vacancies", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="age_min" className="mb-1 block text-sm font-medium text-ink">Min age</label>
              <input id="age_min" type="number" value={values.age_min} onChange={(e) => update("age_min", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="age_max" className="mb-1 block text-sm font-medium text-ink">Max age</label>
              <input id="age_max" type="number" value={values.age_max} onChange={(e) => update("age_max", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="salary_min" className="mb-1 block text-sm font-medium text-ink">Min salary (₹)</label>
              <input id="salary_min" type="number" value={values.salary_min} onChange={(e) => update("salary_min", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="salary_max" className="mb-1 block text-sm font-medium text-ink">Max salary (₹)</label>
              <input id="salary_max" type="number" value={values.salary_max} onChange={(e) => update("salary_max", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
            </div>
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
          <label htmlFor="selection_process" className="mb-1 block text-sm font-medium text-ink">Selection process</label>
          <textarea id="selection_process" rows={3} value={values.selection_process} onChange={(e) => update("selection_process", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">Description</label>
          <textarea id="description" rows={5} value={values.description} onChange={(e) => update("description", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
        </div>

        <MultiCheck label="Eligible categories" options={CATEGORIES} selected={values.eligible_categories} onChange={(v) => update("eligible_categories", v)} />
        <MultiCheck label="Eligible genders" options={GENDERS} selected={values.eligible_genders} onChange={(v) => update("eligible_genders", v)} />
        <MultiCheck label="Eligible states" options={INDIAN_STATES} selected={values.eligible_states} onChange={(v) => update("eligible_states", v)} />

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
          <button type="button" disabled={saving} onClick={() => handleSave(false)} className="btn-secondary">
            Save as draft
          </button>
          <button type="button" disabled={saving} onClick={() => handleSave(true)} className="btn-primary">
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
