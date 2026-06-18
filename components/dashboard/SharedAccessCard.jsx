import { useState } from "react";

const AVATAR_ACCENTS = [
  {
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-700 dark:text-emerald-400",
    iconBorder: "border border-emerald-200 dark:border-emerald-500/30",
  },
  {
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-700 dark:text-blue-400",
    iconBorder: "border border-blue-200 dark:border-blue-500/30",
  },
  {
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-700 dark:text-violet-400",
    iconBorder: "border border-violet-200 dark:border-violet-500/30",
  },
  {
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-700 dark:text-rose-400",
    iconBorder: "border border-rose-200 dark:border-rose-500/30",
  },
];

const VIEWER_BADGE =
  "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30";

export default function SharedAccessCard({ users = [] }) {
  const [expandedUserId, setExpandedUserId] = useState(null);

  if (users.length === 0) return null;

  const handleCardClick = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Shared access
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {users.length} {users.length !== 1 ? "people" : "person"} with access
          </p>
        </div>
        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-800 mb-4" />

      <div className="space-y-2.5">
        {users.map((person, i) => {
          const av = AVATAR_ACCENTS[i % AVATAR_ACCENTS.length];
          const isExpanded = expandedUserId === person.id;
          const displayName = person.name || "Unknown";

          return (
            <div
              key={person.id}
              onClick={() => handleCardClick(person.id)}
              className={`flex flex-col rounded-xl px-3.5 py-3 bg-gray-50 dark:bg-gray-800/60 border transition-all duration-150 cursor-pointer ${
                isExpanded
                  ? "border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/20"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold ${av.iconBg} ${av.iconColor} ${av.iconBorder}`}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {displayName}
                    </p>
                  </div>
                </div>

                <span className={`text-xs font-medium px-2.5 py-1 rounded-md shrink-0 ml-3 ${VIEWER_BADGE}`}>
                  Viewer
                </span>
              </div>

              {isExpanded && person.email && (
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 dark:border-gray-700/60 text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-1 dynamic-fade-in">
                  <div>
                    <span className="font-medium text-gray-400 mr-1">Name:</span> {displayName}
                  </div>
                  <div>
                    <span className="font-medium text-gray-400 mr-1">Email:</span> {person.email}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}