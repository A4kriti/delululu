"use server";

import { redirect } from "next/navigation";
import { AuthError } from "@/lib/auth/enums";
import { authErrorMessages } from "@/lib/auth/helpers";
import type { FormState } from "@/lib/auth/helpers";
import { createUser, verifyCredentials } from "@/lib/auth/users";
import { createSession, destroySession } from "@/lib/auth/session";

// Register: creates the account only. The user must then log in.
export async function signUp(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email) {
    return { error: "Please fill in all fields." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const user = await createUser({ name, email, password });
  if (!user) {
    return { error: authErrorMessages[AuthError.EmailTaken] };
  }

  return { success: true };
}

// Login: only works with the correct email and password.
export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Same message for wrong email and wrong password, so attackers
  // can't find out which emails have accounts.
  const user = await verifyCredentials(email, password);
  if (!user) {
    return { error: authErrorMessages[AuthError.InvalidCredentials] };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signOut() {
  await destroySession();
  redirect("/login");
}