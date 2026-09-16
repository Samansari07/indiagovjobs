import { Link } from "react-router-dom";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo path="" title="Page not found" noindex />
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-ink_text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link to="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    </>
  );
}
