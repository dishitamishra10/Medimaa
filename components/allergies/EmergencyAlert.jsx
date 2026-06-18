export default function EmergencyAlert({ allergies }) {
  const severeAllergies = allergies.filter((a) => a.severity === "Severe");
  if (severeAllergies.length === 0) return null;

  return (
    <div className="rounded-2xl border-l-[3px] border-l-rose-500 rounded-l-none border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/5 p-5 mb-8">

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
          Emergency medical protocols
        </p>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {severeAllergies.map((allergy, index) => (
          <div
            key={allergy.id}
            className={`grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-6 items-start ${
              index !== 0 ? "pt-3 border-t border-rose-200 dark:border-rose-500/20" : ""
            }`}
          >
            <div className="md:col-span-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
              <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                {allergy.allergyName}
              </span>
            </div>

            <div className="md:col-span-3">
              {allergy.emergencyNote ? (
                <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
                  {allergy.emergencyNote}
                </p>
              ) : (
                <p className="text-sm text-rose-400 dark:text-rose-500 italic">
                  No emergency instructions specified.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}