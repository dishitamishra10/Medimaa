"use client";

const severityConfig = {
  Severe: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
  Moderate: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
  Mild: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
};

export default function ReactionHistory({ reactions, onAddClick, onReactionClick }) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-7">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reaction history</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Log every reaction so your doctor can track patterns</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2 text-sm transition cursor-pointer"
        >
          + Log reaction
        </button>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

      {/* Conditional Rendering */}
      {reactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">No reactions logged yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tap "Log reaction" to add your first entry</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reactions.map((rx) => {
            const badgeStyle = severityConfig[rx.severity] || severityConfig.Mild;
            return (
              <div
                key={rx.id}
                onClick={() => onReactionClick(rx)}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer flex justify-between items-start"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{rx.allergen}</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{rx.reactionDate || "Unknown Date"}</p>
                  {rx.treatment && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span className="font-semibold">Treatment:</span> {rx.treatment}
                    </p>
                  )}
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${badgeStyle}`}>
                  {rx.severity}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}