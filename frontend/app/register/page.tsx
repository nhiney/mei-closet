import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Join Mei Closet to sell pieces from your closet.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="mx-auto h-40 w-full max-w-md animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        }
      >
        <RegisterForm />
      </Suspense>
      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to feed
        </Link>
      </div>
    </div>
  );
}
