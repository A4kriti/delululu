"use client";

import { useActionState } from "react";
import Link from "next/link";
import StorySlideshow from "@/component/slideshow";
import { login } from "@/app/actions/auth";
import type { FormState } from "@/lib/auth/helpers";

// Same photos as the register page. Files live in: public/images/
const BACKGROUND_IMAGES = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
];

const initialState: FormState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Main Split Card */}
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">

        {/* Left Side: slideshow background with content */}
        <div className="relative flex min-h-[440px] flex-col justify-between overflow-hidden p-8 text-white md:min-h-[580px] md:w-1/2 md:p-12">

          {/* 1. Looping photo slideshow */}
          <StorySlideshow images={BACKGROUND_IMAGES} />

          {/* 2. Dark overlay so the text stays readable */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/50 to-black/60" />

          {/* 3. Brand Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="15" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Delululu</span>
          </div>

          {/* 4. Welcome Message */}
          <div className="relative z-10 my-10 space-y-4 md:my-0">
            <div className="text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold leading-snug md:text-3xl">
              Welcome back. Your story is waiting.
            </h2>
            <p className="text-sm leading-relaxed text-gray-200">
              Pick up your drafts right where you left off.
            </p>
          </div>

          {/* 5. Footer */}
          <div className="relative z-10 text-xs text-gray-300">
            <p>Your next chapter begins here.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your email and password to continue writing.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {state.error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}