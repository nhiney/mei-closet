import { ConversationList } from "@/features/chat/components/ConversationList";

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl py-6">
      <div className="px-4 pb-4 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Messages
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Chats about listings — realtime when you&apos;re online.
        </p>
      </div>
      <ConversationList />
    </div>
  );
}
