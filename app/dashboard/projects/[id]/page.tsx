import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getStory } from "@/lib/stories";
import { StoryStatus } from "@/lib/story-status";
import { deleteStoryAction } from "@/app/actions/stories";
import DeleteButton from "../delete-button";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function StoryView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const story = await getStory(id, user.id);
  if (!story) notFound();

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl font-bold text-gray-900">{story.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {story.status === StoryStatus.Draft ? "Draft" : "Published"} &middot; Edited{" "}
            {formatDate(story.updatedAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/projects/${story.id}/edit`}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </Link>
          <DeleteButton action={deleteStoryAction.bind(null, story.id)} />
        </div>
      </div>

      <div className="mt-6 whitespace-pre-wrap font-serif text-lg leading-8 text-gray-800">
        {story.content || "This story is empty. Click Edit to start writing."}
      </div>
    </article>
  );
}

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Link href="/dashboard/projects" className="text-sm font-medium text-violet-700 hover:underline">
        &larr; Back to My Stories
      </Link>

      <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
        <StoryView params={params} />
      </Suspense>
    </div>
  );
}