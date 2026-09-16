import { useState } from "react";
import { QUALIFICATIONS, STREAMS, CATEGORIES, GENDERS, INDIAN_STATES } from "../utils/options";

export default function ProfileForm({ initialValues, onSave, saving }) {
  const [values, setValues] = useState({
    full_name: initialValues?.full_name || "",
    qualification: initialValues?.qualification || "",
    stream: initialValues?.stream || "",
    age: initialValues?.age || "",
    state: initialValues?.state || "",
    category: initialValues?.category || "",
    gender: initialValues?.gender || "",
  });
  const [error, setError] = useState("");

  function update(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (values.age && (values.age < 10 || values.age > 80)) {
      setError("Please enter a valid age between 10 and 80.");
      return;
    }
    onSave({ ...values, age: values.age ? Number(values.age) : null });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p role="alert" className="rounded-card bg-closed-50 px-3 py-2 text-sm text-closed">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-ink">Full name</label>
        <input
          id="full_name"
          type="text"
          value={values.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm focus-visible:border-ink"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="mb-1 block text-sm font-medium text-ink">Age</label>
          <input id="age" type="number" min="10" max="80" value={values.age} onChange={(e) => update("age", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="state" className="mb-1 block text-sm font-medium text-ink">State</label>
          <select id="state" value={values.state} onChange={(e) => update("state", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
            <option value="">Select</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-ink">Category</label>
          <select id="category" value={values.category} onChange={(e) => update("category", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="gender" className="mb-1 block text-sm font-medium text-ink">Gender</label>
          <select id="gender" value={values.gender} onChange={(e) => update("gender", e.target.value)} className="w-full rounded-card border border-surface-border px-3 py-2.5 text-sm">
            <option value="">Select</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
