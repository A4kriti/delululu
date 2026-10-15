"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/lib/auth/helpers";
import { getCurrentUser } from "@/lib/auth/session";
import { changePassword, updateUser } from "@/lib/auth/users";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function updateProfile(formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (!name) return { error: "Name can't be empty." };
  if (name.length > 60) return { error: "Name must be 60 characters or less." };
  if (bio.length > 300) return { error: "Bio must be 300 characters or less." };

  await updateUser(user.id, { name, bio });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (next !== confirm) {
    return { error: "New passwords don't match." };
  }

  const ok = await changePassword(user.id, current, next);
  if (!ok) return { error: "Current password is incorrect." };

  return { success: true };
}

function isAllowedAvatarUrl(value: string): boolean {
  if (value.length > 500) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  const hosts = (process.env.UPLOADCARE_CDN_HOSTS ?? "ucarecdn.com")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  return url.protocol === "https:" && hosts.includes(url.hostname);
}

export async function saveAvatar(formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const url = String(formData.get("avatar") ?? "");

  // TEMP DEBUG: remove once saving works
  console.log("avatar url:", url, "allowed:", isAllowedAvatarUrl(url));

  // Never trust the browser: only accept links from your Uploadcare CDN.
  if (!isAllowedAvatarUrl(url)) {
    return { error: "Please choose a valid image." };
  }

  await updateUser(user.id, { avatar: url });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function removeAvatar(): Promise<FormState> {
  const user = await requireUser();

  await updateUser(user.id, { avatar: undefined });
  revalidatePath("/dashboard", "layout");
  return { success: true };
}