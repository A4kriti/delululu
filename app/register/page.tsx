"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Feather, BookOpen } from "lucide-react";
import StorySlideshow from "@/component/slideshow";
import { signUp } from "@/app/actions/auth";
import type { FormState } from "@/lib/auth/helpers";

// Your own photos. Put the files in: public/images/
const BACKGROUND_IMAGES = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
];

const initialState: FormState = {};

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  // After the account is created, send the user to the login page
  useEffect(() => {
    if (!state.success) return;
    const timer = setTimeout(() => router.push("/login"), 1500);
    return () => clearTimeout(timer);
  }, [state.success, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Main Split Card */}
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:flex-row">

        {/* Left Section: slideshow background with content */}
        <section className="relative flex min-h-[440px] flex-col justify-between overflow-hidden p-8 text-white md:min-h-[580px] md:w-1/2 md:p-12">

          {/* 1. Looping photo slideshow */}
          <StorySlideshow images={BACKGROUND_IMAGES} />

          {/* 2. Dark overlay so the text stays readable */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/50 to-black/60" />

          {/* 3. Brand content */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow">
                <Feather size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">Delululu</span>
            </Link>
          </div>

          <div className="relative z-10 my-10 space-y-4 md:my-0">
            <BookOpen size={36} className="text-blue-300" />

            <h1 className="text-2xl font-bold leading-snug md:text-3xl">
              Every great story starts with an idea.
            </h1>

            <p className="text-sm leading-relaxed text-gray-200">
              Create your space, capture your imagination, and turn your
              thoughts into stories worth sharing.
            </p>

            <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-sm italic text-gray-200">
                &quot;Your imagination deserves a place to live.&quot;
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-xs text-gray-300">
            <p>Your next chapter begins here.</p>
          </div>
        </section>

        {/* Right Section: Registration Form */}
        <section className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-bold text-blue-600 md:hidden"
          >
            <Feather size={20} />
            Delululu
          </Link>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Start writing, save your drafts, and bring stories to life.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-gray-700"
              >
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

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
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                autoComplete="new-password"
                placeholder="Create a password"
                minLength={8}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <p className="mt-1 text-xs text-gray-400">
                Must be at least 8 characters.
              </p>
            </div>

            {state.error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {state.error}
              </div>
            )}

            {state.success && (
              <div
                role="status"
                className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700"
              >
                Account created successfully. Taking you to sign in...
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || state.success}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-gray-400">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </section>

      </div>
    </main>
  );
}