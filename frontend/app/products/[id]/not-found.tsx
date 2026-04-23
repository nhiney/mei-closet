import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Listing not found
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        It may have been removed, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mx-auto mt-2 inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
      >
        Back to feed
      </Link>
    </div>
  );
}
