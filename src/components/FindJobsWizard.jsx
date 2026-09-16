import { useState } from "react";
import { QUALIFICATIONS, STREAMS, CATEGORIES, GENDERS, INDIAN_STATES } from "../utils/options";

const STEPS = ["qualification", "stream", "age", "state", "category", "gender"];

const STEP_META = {
  qualification: { question: "What is your highest qualification?", options: QUALIFICATIONS },
  stream: { question: "What is your stream?", options: STREAMS },
  age: { question: "What is your age?" },
  state: { question: "Which state are you in?", options: INDIAN_STATES },
  category: { question: "What is your category?", options: CATEGORIES },
  gender: { question: "What is your gender?", options: GENDERS },
};

export default function FindJobsWizard({ onComplete, initialValues = {} }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState({
    qualification: initialValues.qualification || "",
    stream: initialValues.stream || "",
    age: initialValues.age || "",
    state: initialValues.state || "",
    category: initialValues.category || "",
    gender: initialValues.gender || "",
  });
  const [ageError, setAgeError] = useState("");

  const stepKey = STEPS[stepIndex];
  const meta = STEP_META[stepKey];
  const isLast = stepIndex === STEPS.length - 1;

  function select(val) {
    setValues((v) => ({ ...v, [stepKey]: val }));
    if (isLast) {
      onComplete({ ...values, [stepKey]: val });
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function handleAgeNext() {
    const n = Number(values.age);
    if (!values.age || Number.isNaN(n) || n < 10 || n > 80) {
      setAgeError("Please enter a valid age between 10 and 80.");
      return;
    }
    setAgeError("");
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-1.5" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-ink" : "bg-ink-100"}`}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold text-ink">{meta.question}</h2>

      {stepKey === "age" ? (
        <div className="mt-5">
          <label htmlFor="wizard-age" className="sr-only">Age</label>
          <input
            id="wizard-age"
            type="number"
            inputMode="numeric"
            min="10"
            max="80"
            autoFocus
            value={values.age}
            onChange={(e) => setValues((v) => ({ ...v, age: e.target.value }))}
            className="w-full rounded-card border border-surface-border px-4 py-3 text-base focus-visible:border-ink"
            aria-describedby={ageError ? "age-error" : undefined}
          />
          {ageError && (
            <p id="age-error" role="alert" className="mt-2 text-sm text-closed">
              {ageError}
            </p>
          )}
          <div className="mt-5 flex gap-3">
            {stepIndex > 0 && (
              <button type="button" onClick={goBack} className="btn-secondary">
                Back
              </button>
            )}
            <button type="button" onClick={handleAgeNext} className="btn-primary flex-1">
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {meta.options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => select(opt)}
                className={`rounded-card border px-3 py-3 text-sm font-medium transition-colors ${
                  values[stepKey] === opt
                    ? "border-ink bg-ink text-white"
                    : "border-surface-border bg-white text-ink_text hover:border-ink"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {stepIndex > 0 && (
            <button type="button" onClick={goBack} className="btn-secondary mt-5">
              Back
            </button>
          )}
        </div>
      )}
    </div>
  );
}
