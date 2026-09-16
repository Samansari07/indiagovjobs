import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import FindJobsWizard from "../components/FindJobsWizard";
import MatchScore from "../components/MatchScore";
import MatchReasons from "../components/MatchReasons";
import DeadlineBadge from "../components/DeadlineBadge";
import VerificationBadge from "../components/VerificationBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { matchJobs, buildMatchReasons } from "../services/matchService";
import { useAuth } from "../hooks/useAuth";

export default function FindMyJobs() {
  const { profile } = useAuth();
  const [status, setStatus] = useState("form"); // form | loading | results | error
  const [results, setResults] = useState([]);
  const [inputs, setInputs] = useState(null);

  async function handleComplete(values) {
    setInputs(values);
    setStatus("loading");
    try {
      const data = await matchJobs({
        qualification: values.qualification,
        state: values.state,
        stream: values.stream,
        category: values.category,
        gender: values.gender,
        age: Number(values.age),
      });
      setResults(data);
      setStatus("results");
    } catch {
      setStatus("error");
    }
  }

  const initialValues = profile
    ? {
        qualification: profile.qualification || "",
        stream: profile.stream || "",
        age: profile.age || "",
        state: profile.state || "",
        category: profile.category || "",
        gender: profile.gender || "",
      }
    : {};

  return (
    <>
      <Seo path="/find-my-jobs" description="Answer a few quick questions and see which government jobs you may be eligible for." />

      <div className="mx-auto max-w-4xl px-4 py-10">
        {status === "form" && (
          <FindJobsWizard onComplete={handleComplete} initialValues={initialValues} />
        )}

        {status === "loading" && (
          <div className="mx-auto max-w-lg">
            <LoadingSkeleton count={3} />
          </div>
        )}

        {status === "error" && (
          <ErrorState onRetry={() => setStatus("form")} />
        )}

        {status === "results" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-ink">Your matches</h1>
              <button type="button" onClick={() => setStatus("form")} className="text-sm font-medium text-ink_text-muted hover:text-ink">
                Edit answers
              </button>
            </div>

            {results.length === 0 ? (
              <EmptyState
                title="No matches found right now"
                description="This doesn't mean nothing is available — try browsing all government jobs directly, or check back as new notifications are added."
                action={<Link to="/jobs" className="btn-primary">Browse Government Jobs</Link>}
              />
            ) : (
              <div className="space-y-4">
                {results.map((job) => {
                  const reasons = buildMatchReasons(inputs, job);
                  return (
                    <div key={job.id} className="card border-l-4 border-l-ink-100">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-semibold text-ink">{job.title}</h2>
                          <p className="mt-0.5 truncate text-sm text-ink_text-muted">{job.organization}</p>
                        </div>
                        <MatchScore score={job.match_score} />
                      </div>

                      <MatchReasons reasons={reasons} />

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <DeadlineBadge status="open" applicationEnd={job.application_end} />
                          <VerificationBadge lastVerifiedAt={job.last_verified_at} />
                        </div>
                        <Link to={`/jobs/${job.slug}`} className="btn-secondary text-sm">
                          View Job
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
