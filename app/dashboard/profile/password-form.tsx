"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updatePassword } from "@/app/actions/profile";
import type { FormState } from "@/lib/auth/helpers";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-100";

export default function PasswordForm() {
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState({});
    startTransition(async () => {
      const result = await updatePassword(data);
      setState(result);
      if (result.success) form.reset(); // clear the password fields
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4">
      <div>
        <label htmlFor="current" className="mb-1.5 block text-xs font-medium text-gray-700">
          Current password
        </label>
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="next" className="mb-1.5 block text-xs font-medium text-gray-700">
          New password
        </label>
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters.</p>
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-gray-700">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      {state.error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}
      {state.success && (
        <div role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Password changed.
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}