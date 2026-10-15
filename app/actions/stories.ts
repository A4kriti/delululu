"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/lib/auth/helpers";
import { getCurrentUser } from "@/lib/auth/session";
import { createStory, deleteStory, updateStory } from "@/lib/stories";
import { isStoryStatus, type StoryInput } from "@/lib/story-status";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Reads the form and checks it. Gives back an error message OR clean data.
function readForm(formData: FormData): { error: string } | { data: StoryInput } {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const status = formData.get("status");

  if (!title) return { error: "Please give your story a title." };
  if (title.length > 120) return { error: "Title must be 120 characters or less." };
  if (content.length > 50000) return { error: "Story is too long (max 50,000 characters)." };
  if (!isStoryStatus(status)) return { error: "Please choose a status." };

  return { data: { title, content, status } };
}

// CREATE
export async function createStoryAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const result = readForm(formData);
  if ("error" in result) return { error: result.error };

  await createStory(user.id, result.data);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/projects");
}

// UPDATE (id is attached with .bind in the page)
export async function updateStoryAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  const result = readForm(formData);
  if ("error" in result) return { error: result.error };

  const updated = await updateStory(id, user.id, result.data);
  if (!updated) return { error: "Story not found." };

  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/projects/${id}`);
}

// DELETE
export async function deleteStoryAction(id: string) {
  const user = await requireUser();

  await deleteStory(id, user.id);
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/projects");
}