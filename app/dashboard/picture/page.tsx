import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import AvatarForm from "../profile/avatar-form";

async function PictureContent() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Picture</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a photo so readers know who&apos;s behind the stories.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <AvatarForm name={user.name} avatar={user.avatar} />
      </section>
    </div>
  );
}

export default function PicturePage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
      <PictureContent />
    </Suspense>
  );
}