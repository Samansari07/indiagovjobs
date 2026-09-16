import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import JobCard from "../components/JobCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../hooks/useAuth";
import { listMyBookmarks } from "../services/bookmarksService";

export default function SavedJobs() {
  const { user } = useAuth();
  const [status, setStatus] = useState("loading");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    listMyBookmarks(user.id)
      .then((data) => mounted && (setBookmarks(data), setStatus("ready")))
      .catch(() => mounted && setStatus("error"));
    return () => { mounted = false; };
  }, [user]);

  return (
    <>
      <Seo path="/saved-jobs" description="Your saved government job listings." noindex />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-ink">Saved jobs</h1>

        <div className="mt-6">
          {status === "loading" && <LoadingSkeleton count={4} />}
          {status === "error" && <ErrorState />}
          {status === "ready" && bookmarks.length === 0 && (
            <EmptyState
              title="No saved jobs yet"
              description="Save jobs while browsing to find them here later."
              action={<Link to="/jobs" className="btn-primary">Browse Government Jobs</Link>}
            />
          )}
          {status === "ready" && bookmarks.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((b) => b.jobs && <JobCard key={b.id} job={b.jobs} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
