import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { listStories } from "@/lib/stories";
import { StoryStatus } from "@/lib/story-status";
import { deleteStoryAction } from "@/app/actions/stories";
import DeleteButton from "./delete-button";

const badge: Record<StoryStatus, string> = {
  [StoryStatus.Draft]: "bg-amber-50 text-amber-800",
  [StoryStatus.Published]: "bg-emerald-50 text-emerald-800",
};

function wordCount(text: string) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function StoryList() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stories = await listStories(user.id);

  if (stories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="font-medium text-gray-900">No stories yet</p>
        <p className="mt-1 text-sm text-gray-500">Your stories will appear here after you write them.</p>
        <Link
          href="/dashboard/projects/new"
          className="mt-4 inline-block text-sm font-medium text-violet-700 hover:underline"
        >
          Create your first story
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {stories.map((story) => (
        <li
          key={story.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="min-w-0">
            <Link
              href={`/dashboard/projects/${story.id}`}
              className="block truncate font-medium text-gray-900 hover:text-violet-700"
            >
              {story.title}
            </Link>
            <p className="mt-0.5 text-sm text-gray-500">
              {wordCount(story.content).toLocaleString()} words &middot; Edited{" "}
              {formatDate(story.updatedAt)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge[story.status]}`}>
              {story.status === StoryStatus.Draft ? "Draft" : "Published"}
            </span>
            <Link
              href={`/dashboard/projects/${story.id}/edit`}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit
            </Link>
            <DeleteButton action={deleteStoryAction.bind(null, story.id)} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Stories</h1>
          <p className="mt-1 text-sm text-gray-500">Write and manage your stories in one place.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800"
        >
          Write a story
        </Link>
      </div>

      <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
        <StoryList />
      </Suspense>
    </div>
  );
}