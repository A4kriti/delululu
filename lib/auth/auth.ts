"use server";

import { redirect } from "next/navigation";
import { AuthError, UserRole } from "@/lib/auth/enums";
import { authErrorMessages } from "@/lib/auth/helpers";
import type { AuthResult, AuthUser, FormState } from "@/lib/auth/helpers";

type StoredUser = AuthUser & { password: string };

// DEMO ONLY. No database yet, so users live in memory and disappear when the
// dev server restarts. In a real app: save to a database and store hashed
// passwords (bcrypt or argon2), never plain text.
const users: StoredUser[] = [
  {
    id: "1",
    name: "Asha",
    email: "asha@example.com",
    password: "password123",
    role: UserRole.Writer,
  },
];

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
  if (users.some((u) => u.email === email)) {
    return { error: authErrorMessages[AuthError.EmailTaken] };
  }

  users.push({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    role: UserRole.Writer,
  });

  // TODO: create a session cookie here so the user is really logged in.
  redirect("/dashboard");
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const found = users.find((u) => u.email === email.trim().toLowerCase());

  // Same error for "no such user" and "wrong password", so the message
  // doesn't reveal which emails have accounts.
  if (!found || found.password !== password) {
    return { ok: false, error: AuthError.InvalidCredentials };
  }

  const { password: _omit, ...user } = found;
  return { ok: true, user };
}

export async function signOut() {
  // TODO: delete the session cookie here.
  redirect("/");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  // TODO: read the session cookie and look the user up.
  // Returns a demo writer so the dashboard has someone to show.
  return { id: "1", name: "Asha", email: "asha@example.com", role: UserRole.Writer };
}

export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await signIn(email, password);
  if (!result.ok) {
    return { error: authErrorMessages[result.error] };
  }

  // TODO: create a session cookie here.
  redirect("/dashboard");
}