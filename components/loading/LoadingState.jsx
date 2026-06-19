export default function LoadingState({ message = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
    </div>
  );
}