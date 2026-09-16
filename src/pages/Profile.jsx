import { useState } from "react";
import Seo from "../components/Seo";
import ProfileForm from "../components/ProfileForm";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../services/authService";

export default function Profile() {
  const { user, profile, setProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(values) {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateProfile(user.id, values);
      setProfile(updated);
      setSaved(true);
    } catch {
      // ProfileForm shows its own validation; a network/DB error here is
      // rare enough that a quiet failure with unset "saved" is acceptable,
      // but we still stop the spinner.
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Seo path="/profile" description="Manage your IndiaGovJobs eligibility profile." noindex />

      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-2xl font-bold text-ink">Your profile</h1>
        <p className="mt-1 text-sm text-ink_text-muted">{user?.email}</p>

        {saved && (
          <p role="status" className="mt-4 rounded-card bg-verified-50 px-3 py-2 text-sm text-verified">
            Profile saved.
          </p>
        )}

        <div className="mt-6">
          <ProfileForm initialValues={profile} onSave={handleSave} saving={saving} />
        </div>
      </div>
    </>
  );
}
