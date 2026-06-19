import { AlertCircle } from "lucide-react"; // adjust import to match your icon source

export default function AccessRestricted({
  message = "Please log in to access this page.",
}) {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2 max-w-sm text-center border border-gray-200 dark:border-gray-800 p-6 rounded-xl bg-gray-50/50 dark:bg-gray-900/30">
        <AlertCircle className="text-red-400" size={28} />
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
          Access Restricted
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}