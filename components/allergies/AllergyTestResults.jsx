"use client";

export default function AllergyTestResults({ testResults, onAddClick, onResultClick }) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Allergy test results</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Skin prick tests, IgE blood tests and more</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2 text-sm transition cursor-pointer"
        >
          + Add result
        </button>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 mb-6" />

      {/* Conditional Layout */}
      {!testResults || testResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 text-center">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">No test results added yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tap "Add result" to log your first test</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {testResults.map((result) => (
            <div 
              key={result.id}
              onClick={() => onResultClick(result)}
              className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 hover:border-blue-500 dark:hover:border-blue-400 flex justify-between items-start transition cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400">
                  {result.testType}
                </span>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                  {result.allergen}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span className="font-semibold">Value:</span> {result.resultValue}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                  Tested on {result.testDate}
                </p>
              </div>

              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                result.interpretation === "Positive" 
                  ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200" 
                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
              }`}>
                {result.interpretation}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}