import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import JobCard from "../components/JobCard";
import ExamCard from "../components/ExamCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { listClosingSoonJobs, listLatestJobs } from "../services/jobsService";
import { listPopularExams } from "../services/examsService";

function JobSection({ title, jobs, loading }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4">
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : jobs.length === 0 ? (
          <EmptyState title="No listings right now" description="Check back soon — new jobs are added regularly." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const [closingSoon, setClosingSoon] = useState([]);
  const [latest, setLatest] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([listClosingSoonJobs(3), listLatestJobs(6), listPopularExams(3)])
      .then(([cs, lt, ex]) => {
        if (!mounted) return;
        setClosingSoon(cs);
        setLatest(lt);
        setExams(ex);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Seo
        path="/"
        description="Find government jobs and exams in India you may be eligible for — with official sources, deadlines and clear eligibility information."
      />

      <section className="border-b border-surface-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-5 md:items-center md:py-20">
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
              India&apos;s Government Jobs, Made Simple.
            </h1>
            <p className="mt-4 max-w-prose text-base text-ink_text-muted md:text-lg">
              Find government jobs and exams you may be eligible for — with official sources,
              deadlines and clear eligibility information.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/find-my-jobs" className="btn-primary text-base">
                Find My Jobs
              </Link>
              <Link to="/jobs" className="btn-secondary text-base">
                Browse Government Jobs
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink_text-muted">
              <span>Official-source focused</span>
              <span>Eligibility-first</span>
              <span>Deadline-aware</span>
              <span>Last verified</span>
            </div>
          </div>
          <div className="hidden md:col-span-2 md:block" aria-hidden="true">
            <div className="card border-l-4 border-l-verified">
              <p className="text-sm font-semibold text-ink">SSC CGL 2026</p>
              <p className="mt-1 text-xs text-ink_text-muted">Staff Selection Commission</p>
              <p className="mt-3 text-xs text-verified">92% Match · 7 Days Left</p>
            </div>
          </div>
        </div>
      </section>

      <JobSection title="Closing Soon" jobs={closingSoon} loading={loading} />
      <JobSection title="Latest Government Jobs" jobs={latest} loading={loading} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-semibold text-ink">Popular Government Exams</h2>
        <div className="mt-4">
          {loading ? (
            <LoadingSkeleton count={3} />
          ) : exams.length === 0 ? (
            <EmptyState title="No exams listed yet" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((e) => <ExamCard key={e.id} exam={e} />)}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-surface-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-xl font-semibold text-ink">Why IndiaGovJobs</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-ink">Eligibility-first</h3>
              <p className="mt-1.5 text-sm text-ink_text-muted">
                We tell you why you match a job, not just a percentage — qualification, age, state and more.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Official-source focused</h3>
              <p className="mt-1.5 text-sm text-ink_text-muted">
                Every listing links to the official notification. We never hide the source.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Deadline-aware</h3>
              <p className="mt-1.5 text-sm text-ink_text-muted">
                Clear, accurate deadline labels — closed recruitment is never shown as open.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-xl font-semibold text-ink">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="card">
            <p className="text-sm font-semibold text-ink">1. Tell us about you</p>
            <p className="mt-1.5 text-sm text-ink_text-muted">Qualification, age, state, category and gender.</p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-ink">2. See what matches</p>
            <p className="mt-1.5 text-sm text-ink_text-muted">We explain exactly why each job fits — or doesn&apos;t.</p>
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-ink">3. Apply on the official site</p>
            <p className="mt-1.5 text-sm text-ink_text-muted">We always send you to the real, official application page.</p>
          </div>
        </div>
      </section>
    </>
  );
}
