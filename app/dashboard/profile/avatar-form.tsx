"use client";

import { useState, useTransition } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { removeAvatar, saveAvatar } from "@/app/actions/profile";
import type { FormState } from "@/lib/auth/helpers";

type Props = { name: string; avatar?: string };

const PUBLIC_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY ?? "";

// Ask the CDN for a 256x256 square so every avatar loads fast.
function squareUrl(cdnUrl: string) {
  const base = cdnUrl.endsWith("/") ? cdnUrl : `${cdnUrl}/`;
  return `${base}-/scale_crop/256x256/center/`;
}

export default function AvatarForm({ name, avatar }: Props) {
  const [newImage, setNewImage] = useState<string | null>(null); // uploaded, not saved yet
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();

  const shown = newImage ?? avatar;

  function onSave() {
    if (!newImage) return;
    const data = new FormData();
    data.set("avatar", newImage);
    setState({});
    startTransition(async () => {
      const result = await saveAvatar(data);
      setState(result);
      if (result.success) setNewImage(null);
    });
  }

  function onRemove() {
    setState({});
    startTransition(async () => {
      const result = await removeAvatar();
      setState(result);
      if (result.success) setNewImage(null);
    });
  }

  if (!PUBLIC_KEY) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
        Missing NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY in .env. Add it and restart the dev server.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      {/* Preview */}
      <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-violet-100">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Your profile picture" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-violet-800">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="w-full space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Upload a new photo</p>
          <p className="mt-1 text-xs text-gray-500">
            Choose a photo, crop it to a square, then press Save picture.
          </p>
        </div>

        <FileUploaderRegular
          pubkey={PUBLIC_KEY}
          multiple={false}
          imgOnly
          useCloudImageEditor
          cropPreset="1:1"
          sourceList="local, camera"
          onChange={(e) => {
            const url = e.successEntries?.[0]?.cdnUrl;
            if (url) {
              setState({});
              setNewImage(squareUrl(url));
            }
          }}
        />

        {state.error && (
          <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}
        {state.success && (
          <div role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            Picture updated.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={!newImage || pending}
            className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save picture"}
          </button>

          {avatar && !newImage && (
            <button
              type="button"
              onClick={onRemove}
              disabled={pending}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove picture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}