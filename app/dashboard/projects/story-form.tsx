
"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Link from "next/link";
import type { FormState } from "@/lib/auth/helpers";
import { StoryStatus } from "@/lib/story-status";
import { hand, marker } from "./notebook-fonts";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  story?: {
    title: string;
    content: string;
    status: StoryStatus;
  };
  submitLabel: string;
  heading: string;
  subtitle: string;
};

const initialState: FormState = {};

const PAGE_BREAK = "\f";
const LINE = 32;
const PAGE_LINES = 14;

const statusOptions = [
  { value: StoryStatus.Draft, label: "Draft", tilt: "-rotate-2" },
  { value: StoryStatus.Published, label: "Published", tilt: "rotate-2" },
];

// Delululu theme: pale pink leather cover
const LEATHER_STYLE = {
  backgroundColor: "#FFF8FC",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
} as const;

// Cream notebook paper
const PAPER_STYLE = {
  backgroundColor: "#FFFDF7",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .35 0 0 0 0 .25 0 0 0 .04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
} as const;

const ruledPaper = {
  lineHeight: `${LINE}px`,
  height: `${LINE * PAGE_LINES}px`,
  backgroundImage: `repeating-linear-gradient(transparent, transparent ${
    LINE - 1
  }px, #F9DCE8 ${LINE - 1}px, #F9DCE8 ${LINE}px)`,
  backgroundAttachment: "local",
} as const;

const stickerButton =
  "rounded-xl border border-dashed border-[#F9A8D4] bg-[#FFF8FC] px-3 py-1.5 text-base font-bold text-[#BE185D] transition hover:bg-[#FCE7F3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE185D] disabled:cursor-not-allowed disabled:opacity-40";

function fits(el: HTMLTextAreaElement, text: string) {
  if (el.value !== text) el.value = text;
  return el.scrollHeight <= el.clientHeight + 1;
}

function cutPoint(el: HTMLTextAreaElement, text: string) {
  let lo = 0;
  let hi = text.length;

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);

    if (fits(el, text.slice(0, mid))) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  let cut = Math.max(lo, 1);

  if (
    cut < text.length &&
    !/\s/.test(text[cut - 1]) &&
    !/\s/.test(text[cut])
  ) {
    const ws = Math.max(
      text.lastIndexOf(" ", cut - 1),
      text.lastIndexOf("\n", cut - 1)
    );

    if (ws >= Math.floor(cut * 0.5)) {
      cut = ws + 1;
    }
  }

  return cut;
}

function reflow(
  el: HTMLTextAreaElement,
  input: string[],
  start: number,
  all = false
) {
  const pages = [...input];
  const saved = el.value;

  let cut0 = -1;
  let lead0 = 0;

  for (let i = start; i < pages.length; i++) {
    if (fits(el, pages[i])) {
      if (all) continue;
      break;
    }

    const cut = cutPoint(el, pages[i]);
    const rest = pages[i].slice(cut);
    const overflow = rest.replace(/^[ \t]+/, "");
    const lead = rest.length - overflow.length;

    pages[i] = pages[i].slice(0, cut);

    if (i === start) {
      cut0 = cut;
      lead0 = lead;
    }

    if (overflow) {
      if (i + 1 < pages.length) {
        const next = pages[i + 1];
        const glue =
          !/\s$/.test(overflow) && !/^\s/.test(next) && next
            ? " "
            : "";

        pages[i + 1] = overflow + glue + next;
      } else {
        pages.push(overflow);
      }
    }
  }

  el.value = saved;

  return { pages, cut: cut0, lead: lead0 };
}

function Ring() {
  return (
    <div className="relative h-5 w-[88px]">
      <span className="absolute left-0 top-0.5 h-4 w-4 rounded-full bg-stone-800 shadow-[inset_0_2px_3px_rgba(0,0,0,0.8)] ring-1 ring-black/20" />
      <span className="absolute right-0 top-0.5 h-4 w-4 rounded-full bg-stone-800 shadow-[inset_0_2px_3px_rgba(0,0,0,0.8)] ring-1 ring-black/20" />
      <span className="absolute inset-x-2 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-white via-gray-300 to-gray-500 shadow-[0_2px_3px_rgba(0,0,0,0.45)] ring-1 ring-gray-500/50" />
    </div>
  );
}

export default function StoryForm({
  action,
  story,
  submitLabel,
  heading,
  subtitle,
}: Props) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );

  const [title, setTitle] = useState(story?.title ?? "");
  const [status, setStatus] = useState<StoryStatus>(
    story?.status ?? StoryStatus.Draft
  );

  const [pages, setPages] = useState<string[]>(() =>
    (story?.content ?? "").split(PAGE_BREAK)
  );

  const [current, setCurrent] = useState(0);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const caretRef = useRef<number | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const caret = caretRef.current;
    const el = taRef.current;

    if (caret === null || !el) return;

    caretRef.current = null;
    el.focus();

    const position = Math.min(caret, el.value.length);
    el.setSelectionRange(position, position);
  }, [current, pages]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const el = taRef.current;

    if (
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    el.animate(
      [
        { opacity: 0, transform: "translateX(14px)" },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 260, easing: "ease-out" }
    );
  }, [current]);

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      const el = taRef.current;

      if (cancelled || !el) return;

      setPages((prev) => {
        const { pages: next } = reflow(el, prev, 0, true);

        const same =
          next.length === prev.length &&
          next.every((page, i) => page === prev[i]);

        return same ? prev : next;
      });
    };

    document.fonts.ready.then(run);

    return () => {
      cancelled = true;
    };
  }, []);

  function goTo(index: number, caret = 0) {
    caretRef.current = caret;
    setCurrent(index);
  }

  function goNext() {
    if (current < pages.length - 1) {
      goTo(current + 1);
    } else if (pages[current].trim()) {
      setPages([...pages, ""]);
      goTo(current + 1);
    }
  }

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const position = el.selectionStart;

    const draft = pages.map((page, i) =>
      i === current ? el.value : page
    );

    const { pages: next, cut, lead } = reflow(el, draft, current);

    setPages(next);

    if (cut >= 0) {
      if (position > cut) {
        caretRef.current = Math.max(0, position - cut - lead);
        setCurrent(current + 1);
      } else {
        caretRef.current = position;
      }
    }
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;

    if (
      e.key === "Backspace" &&
      current > 0 &&
      el.selectionStart === 0 &&
      el.selectionEnd === 0
    ) {
      e.preventDefault();
      goTo(current - 1, pages[current - 1].length);
    }
  }

  let used = pages.length;

  while (used > 1 && !pages[used - 1].trim()) {
    used--;
  }

  const contentValue = pages.slice(0, used).join(PAGE_BREAK);
  const trimmed = contentValue.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const isLastPage = current === pages.length - 1;

  return (
    <form
      action={formAction}
      style={LEATHER_STYLE}
      className={`${hand.className} relative rounded-[28px] p-3 shadow-[0_18px_55px_rgba(120,75,80,0.13)] sm:p-5`}
    >
      {/* Notebook page-turning strap */}
      <button
        type="button"
        onClick={goNext}
        disabled={isLastPage && !pages[current].trim()}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute -right-1.5 top-1/2 z-30 hidden h-24 w-14 -translate-y-1/2 items-center justify-center rounded-l-md border-y border-l border-dashed border-[#F9A8D4] bg-gradient-to-b from-[#FCE7F3] to-[#F9A8D4] shadow-md transition hover:-translate-x-1 disabled:opacity-50 md:flex"
      >
        <svg
          width="34"
          height="18"
          viewBox="0 0 28 14"
          fill="none"
          stroke="#BE185D"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 8c6-3 13-3 22-1M18 2l7 5-7 5" />
        </svg>
      </button>

      {/* Stitched notebook cover */}
      <div className="rounded-xl border-2 border-dashed border-[#F9A8D4]/70 p-2 sm:p-3">
        <div
          style={PAPER_STYLE}
          className="relative grid overflow-hidden rounded-xl shadow-[1px_1px_0_#f0e6df,2px_2px_0_#e9ddd6,3px_3px_0_#f0e6df,4px_4px_12px_rgba(90,60,60,0.12)] md:grid-cols-2"
        >
          {/* Bookmark ribbon */}
          <span
            aria-hidden="true"
            className="absolute right-4 top-0 z-20 hidden h-14 w-5 bg-[#BE185D] shadow-md [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] md:block"
          />

          {/* Notebook spine */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-24 -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(190,140,145,0.05)_40%,rgba(190,140,145,0.12)_50%,rgba(190,140,145,0.05)_60%,transparent)] md:block"
          />

          {/* Binder rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col justify-between md:flex"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <Ring key={i} />
            ))}
          </div>

          {/* Left page */}
          <section className="space-y-6 p-6 sm:p-10 md:pr-14">
            <div>
              <h1
                className={`${marker.className} text-4xl leading-tight text-[#BE185D] sm:text-5xl`}
              >
                {heading}
              </h1>

              <svg
                viewBox="0 0 200 8"
                className="mt-1 h-2 w-56"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5 C 30 1, 60 8, 100 4 S 170 2, 198 5"
                  stroke="#F9A8D4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <p className="mt-3 text-base text-[#9D8291]">
                {subtitle}
              </p>
            </div>

            {/* Story title */}
            <div>
              <label
                htmlFor="title"
                className="text-base font-bold tracking-wide text-[#4A2638]"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                placeholder="Give your story a title"
                required
                className="mt-1 w-full border-0 border-b-2 border-[#F9A8D4] bg-transparent px-1 py-2 text-xl text-[#4A2638] outline-none transition placeholder:text-[#9D8291]/60 focus:border-[#BE185D]"
              />
            </div>

            {/* Story status */}
            <fieldset>
              <legend className="text-base font-bold tracking-wide text-[#4A2638]">
                Status
              </legend>

              <div className="mt-2 flex flex-wrap gap-3">
                {statusOptions.map((option) => {
                  const selected = status === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`${option.tilt} cursor-pointer rounded-md px-4 py-1.5 text-lg font-bold shadow-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#BE185D] ${
                        selected
                          ? "bg-[#BE185D] text-white"
                          : "border-2 border-dashed border-[#F9A8D4] bg-[#FFF8FC] text-[#4A2638] hover:bg-[#FCE7F3]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={selected}
                        onChange={() => setStatus(option.value)}
                        className="sr-only"
                      />

                      {option.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Word and page counters */}
            <div
              aria-live="polite"
              className="flex flex-wrap items-start gap-6 pt-3"
            >
              <div className="relative w-32 -rotate-2 rounded-sm bg-white p-2 pb-3 shadow-md ring-1 ring-[#F9A8D4]/40">
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 rotate-3 bg-[#FCE7F3]/90 shadow-sm"
                />

                <div className="flex h-20 items-center justify-center bg-gradient-to-br from-[#FCE7F3] to-[#FFFDF7]">
                  <span className={`${marker.className} text-4xl text-[#BE185D]`}>
                    {words.toLocaleString()}
                  </span>
                </div>

                <p className="mt-1.5 text-center text-base text-[#4A2638]">
                  {words === 1 ? "word" : "words"}
                </p>
              </div>

              <div className="relative w-32 rotate-2 rounded-sm bg-white p-2 pb-3 shadow-md ring-1 ring-[#F9A8D4]/40">
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-2 bg-[#FCE7F3]/90 shadow-sm"
                />

                <div className="flex h-20 items-center justify-center bg-gradient-to-br from-[#FFFDF7] to-[#FCE7F3]">
                  <span className={`${marker.className} text-4xl text-[#BE185D]`}>
                    {used}
                  </span>
                </div>

                <p className="mt-1.5 text-center text-base text-[#4A2638]">
                  {used === 1 ? "page" : "pages"}
                </p>
              </div>
            </div>

            {/* Writing tip */}
            <p className="w-52 rotate-1 rounded-sm bg-[#FCE7F3] p-3 text-base leading-snug text-[#4A2638] shadow-sm">
              Tip: page full? Keep typing. Your words flow onto the next page.
            </p>
          </section>

          {/* Right page: story editor */}
          <section className="flex flex-col p-6 sm:p-10 md:pl-14">
            <div className="flex items-center justify-between gap-3">
              <label
                htmlFor="content"
                className="text-base font-bold tracking-wide text-[#4A2638]"
              >
                Your story
              </label>

              <span
                aria-live="polite"
                className="text-lg font-bold text-[#BE185D]"
              >
                Page {current + 1} of {pages.length}
              </span>
            </div>

            {/* All pages are submitted in one field */}
            <input
              type="hidden"
              name="content"
              value={contentValue}
            />

            <div className="relative mt-2">
              {/* Pink margin lines */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-8 w-px bg-[#F9A8D4]/60"
              />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[35px] w-px bg-[#F9A8D4]/40"
              />

              <textarea
                id="content"
                ref={taRef}
                value={pages[current] ?? ""}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={
                  current === 0
                    ? "Once upon a time..."
                    : "Keep writing..."
                }
                style={ruledPaper}
                className="block w-full resize-none overflow-y-auto border-0 bg-transparent py-0 pl-12 pr-1 text-base text-[#4A2638] outline-none placeholder:text-[#9D8291]"
              />
            </div>

            {/* Page navigation */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  goTo(current - 1, pages[current - 1]?.length ?? 0)
                }
                disabled={current === 0}
                className={stickerButton}
              >
                &larr; Previous
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={isLastPage && !pages[current].trim()}
                className={stickerButton}
              >
                {isLastPage ? "New page +" : "Next page →"}
              </button>
            </div>

            {/* Server action error */}
            {state.error && (
              <div
                role="alert"
                className="mt-4 -rotate-1 rounded-md border border-red-200 bg-red-50 p-3 text-base text-red-700 shadow-sm"
              >
                {state.error}
              </div>
            )}

            {/* Save and cancel */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-3 rounded-md border-2 border-dashed border-[#F9A8D4] bg-[#BE185D] px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-[#9D174D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE185D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : submitLabel}

                <svg
                  width="28"
                  height="14"
                  viewBox="0 0 28 14"
                  fill="none"
                  stroke="#FCE7F3"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 8c6-3 13-3 22-1M18 2l7 5-7 5" />
                </svg>
              </button>

              <Link
                href="/dashboard/projects"
                className="text-base font-bold tracking-wide text-[#4A2638] underline decoration-[#F9A8D4] decoration-2 underline-offset-4 transition hover:text-[#BE185D] hover:decoration-[#BE185D]"
              >
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
