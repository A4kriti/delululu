import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getStory } from "@/lib/stories";
import { updateStoryAction } from "@/app/actions/stories";
import StoryForm from "../../story-form";

async function EditContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const story = await getStory(id, user.id);
  if (!story) notFound();

  return (
    <StoryForm
      action={updateStoryAction.bind(null, story.id)}
      story={{ title: story.title, content: story.content, status: story.status }}
      heading="Edit story"
      subtitle="Change anything, then save."
      submitLabel="Save changes"
    />
  );
}

export default function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
        <EditContent params={params} />
      </Suspense>
    </div>
  );
}