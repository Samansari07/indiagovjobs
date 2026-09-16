import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import FindMyJobs from "./pages/FindMyJobs";
import GovtJobs from "./pages/GovtJobs";
import JobDetails from "./pages/JobDetails";
import Exams from "./pages/Exams";
import ExamDetails from "./pages/ExamDetails";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import NotFound from "./pages/NotFound";

import AdminOverview from "./pages/admin/AdminOverview";
import AdminJobsList from "./pages/admin/AdminJobsList";
import AdminJobForm from "./pages/admin/AdminJobForm";
import AdminExamsList from "./pages/admin/AdminExamsList";
import AdminExamForm from "./pages/admin/AdminExamForm";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/find-my-jobs" element={<FindMyJobs />} />
        <Route path="/jobs" element={<GovtJobs />} />
        <Route path="/jobs/:slug" element={<JobDetails />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/:slug" element={<ExamDetails />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="jobs" element={<AdminJobsList />} />
        <Route path="jobs/new" element={<AdminJobForm />} />
        <Route path="jobs/:id" element={<AdminJobForm />} />
        <Route path="exams" element={<AdminExamsList />} />
        <Route path="exams/new" element={<AdminExamForm />} />
        <Route path="exams/:id" element={<AdminExamForm />} />
      </Route>
    </Routes>
  );
}
