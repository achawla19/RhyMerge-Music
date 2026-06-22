import ProfileEditForm from "../profile/ProfileEditForm";

// This now reuses the exact same form as the "Edit Profile" button on your
// public profile page — one source of truth for every editable field, so
// there's no more duplicate/conflicting "Role" field between tabs.
const ProfileSection = () => {
  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-1">Profile</h2>
      <p className="text-sm mb-5" style={{ color: "var(--rm-text-muted)" }}>
        Everything shown on your public profile
      </p>
      <ProfileEditForm compact />
    </div>
  );
};

export default ProfileSection;
