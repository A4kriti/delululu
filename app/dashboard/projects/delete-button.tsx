
"use client";

export default function DeleteButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this story? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-[#F9A8D4] bg-[#FFF8FC] px-3 py-1.5 text-sm font-medium text-[#BE185D] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-[#FCE7F3]"
      >
        Delete
      </button>
    </form>
  );
}
