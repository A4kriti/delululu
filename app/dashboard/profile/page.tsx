
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import AvatarForm from "./avatar-form";
import ProfileForm from "./profile-form";
import PasswordForm from "./password-form";

async function ProfileContent() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#4A2638]">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-[#9D8291]">
          Manage your photo, personal details, and password.
        </p>
      </div>

      {/* Profile Picture */}
      <section className="rounded-2xl border border-[#F9A8D4] bg-[#FFFBFE] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#4A2638]">
          Profile Picture
        </h2>

        <p className="mt-1 text-sm text-[#9D8291]">
          Add a photo so readers know who&apos;s behind your stories.
        </p>

        <div className="mt-5">
          <AvatarForm
            name={user.name}
            avatar={user.avatar}
          />
        </div>
      </section>

      {/* Personal Details */}
      <section className="rounded-2xl border border-[#F9A8D4] bg-[#FFFBFE] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#4A2638]">
          Personal Details
        </h2>

        <p className="mb-5 mt-1 text-sm text-[#9D8291]">
          Update your name and author bio.
        </p>

        <ProfileForm
          name={user.name}
          email={user.email}
          bio={user.bio ?? ""}
        />
      </section>

      {/* Change Password */}
      <section className="rounded-2xl border border-[#F9A8D4] bg-[#FFFBFE] p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#4A2638]">
          Change Password
        </h2>

        <p className="mb-5 mt-1 text-sm text-[#9D8291]">
          Keep your storytelling account secure.
        </p>

        <PasswordForm />
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-[#9D8291]">
          Loading your profile...
        </p>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
