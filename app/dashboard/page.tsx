import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { listStories } from "@/lib/stories";
import { StoryStatus } from "@/lib/story-status";

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

async function RecentStories() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stories = (await listStories(user.id)).slice(0, 5);

  if (stories.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="font-medium text-gray-900">No stories yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Your stories will appear here after you write them.
        </p>
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
      {stories.map((story) => {
        const words = wordCount(story.content);
        return (
          <li key={story.id}>
            <Link
              href={`/dashboard/projects/${story.id}`}
              className="flex flex-col gap-2 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{story.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {words.toLocaleString()} {words === 1 ? "word" : "words"} &middot; Edited{" "}
                  {formatDate(story.updatedAt)}
                </p>
              </div>
              <span
                className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badge[story.status]}`}
              >
                {story.status === StoryStatus.Draft ? "Draft" : "Published"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Stories</h1>
        <p className="mt-1 text-sm text-gray-500">
          Write and manage your stories in one place.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your writing space</h2>
          <p className="mt-1 text-sm text-gray-500">
            Start a new story or continue writing an existing one.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-violet-700 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-violet-800"
        >
          Write a story
        </Link>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Stories</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium text-violet-700 hover:underline"
          >
            View all
          </Link>
        </div>

        <Suspense fallback={<p className="text-sm text-gray-500">Loading...</p>}>
          <RecentStories />
        </Suspense>
      </section>
    </div>
  );
}