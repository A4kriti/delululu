"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateProfile } from "@/app/actions/profile";
import type { FormState } from "@/lib/auth/helpers";

type Props = { name: string; email: string; bio: string };

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-100";

export default function ProfileForm({ name, email, bio }: Props) {
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState({});
    startTransition(async () => {
      setState(await updateProfile(data));
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-gray-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={name}
          maxLength={60}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          readOnly
          className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
        />
        <p className="mt-1 text-xs text-gray-400">Email can&apos;t be changed.</p>
      </div>

      <div>
        <label htmlFor="bio" className="mb-1.5 block text-xs font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={300}
          defaultValue={bio}
          placeholder="Tell readers a little about yourself and what you write."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-400">Up to 300 characters.</p>
      </div>

      {state.error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}
      {state.success && (
        <div role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Profile updated.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}