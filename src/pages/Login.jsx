import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Seo from "../components/Seo";
import { signInWithGoogle } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [error, setError] = useState("");

  if (!loading && user) {
    const redirectTo = location.state?.from || "/";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleGoogle() {
    setError("");
    try {
      await signInWithGoogle(location.state?.from || "/");
    } catch {
      setError("Couldn't start sign-in. Please try again.");
    }
  }

  return (
    <>
      <Seo path="/login" description="Sign in to IndiaGovJobs to save jobs and get a personalized eligibility profile." noindex />

      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-10">
        <h1 className="text-2xl font-bold text-ink">Sign in to IndiaGovJobs</h1>
        <p className="mt-2 text-sm text-ink_text-muted">
          Save jobs, build your eligibility profile, and get faster matches.
        </p>

        {error && (
          <p role="alert" className="mt-4 rounded-card bg-closed-50 px-3 py-2 text-sm text-closed">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          className="btn-secondary mt-6 w-full gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-ink_text-muted">
          By continuing, you agree that IndiaGovJobs is an independent information platform
          and not an official government website.
        </p>
      </div>
    </>
  );
}
