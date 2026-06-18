export default function AllergyCard({ allergy }) {
  const severityConfig = {
    Severe: {
      badge:
        "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30",
      symptomTag:
        "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
      accent: "border-l-[4px] border-l-rose-500 rounded-l-none",
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
      iconColor: "text-rose-500 dark:text-rose-400",
      dot: "bg-rose-400",
      hover: "hover:border-rose-200 dark:hover:border-rose-500/40",
    },
    Moderate: {
      badge:
        "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
      symptomTag:
        "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
      accent: "border-l-[4px] border-l-amber-500 rounded-l-none",
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-500 dark:text-amber-400",
      dot: "bg-amber-400",
      hover: "hover:border-amber-200 dark:hover:border-amber-500/40",
    },
    Mild: {
      badge:
        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
      symptomTag:
        "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
      accent: "border-l-[4px] border-l-emerald-500 rounded-l-none",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-500 dark:text-emerald-400",
      dot: "bg-emerald-400",
      hover: "hover:border-emerald-200 dark:hover:border-emerald-500/40",
    },
  };

  const CATEGORY_ICONS = {
    Drug: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
      </svg>
    ),
    Food: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    Environmental: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  };

  const config = severityConfig[allergy.severity] ?? severityConfig.Mild;
  const icon = CATEGORY_ICONS[allergy.category] ?? CATEGORY_ICONS.Drug;

  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        rounded-xl
        border border-gray-200 dark:border-gray-800
        flex flex-col justify-between
        min-h-[300px] h-full
        transition-all duration-200
        hover:-translate-y-1
        hover:shadow-md dark:hover:shadow-gray-950/40
        ${config.accent}
        ${config.hover}
      `}
    >
      {/* Upper Segment Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        
        {/* Header Block */}
        <div className="flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}>
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate tracking-tight">
                {allergy.allergyName}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                {allergy.category}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md shrink-0 ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
            {allergy.severity}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800/60 shrink-0" />

        {/* Symptoms Section */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Symptoms
          </p>
          <div className="flex flex-wrap gap-1.5">
            {allergy.symptoms?.length > 0 ? (
              allergy.symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${config.symptomTag}`}
                >
                  {symptom}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                No symptoms recorded
              </p>
            )}
          </div>
        </div>

        {/* ── FIX: Removed the restrictive fixed height container and line-clamping ── */}
        <div className="w-full mt-auto">
          <div className="rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              Emergency Note
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {allergy.emergencyNote || "No active safety protocol listed."}
            </p>
          </div>
        </div>

      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between bg-gray-50/20 dark:bg-transparent rounded-b-xl shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Diagnosed
        </p>
        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
          {allergy.diagnosedDate || "—"}
        </p>
      </div>
    </div>
  );
}