"use client";

const CROSS_REACTIVE_MAP = {
  penicillin: [
    { name: "Amoxicillin", type: "Cross-reactive", style: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" },
    { name: "Penicillin V", type: "Cross-reactive", style: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" }
  ],
  peanuts: [
    { name: "Tree Nuts (Almonds, Walnuts)", type: "Related Risk", style: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" }
  ],
  shrimp: [
    { name: "Shellfish (Crab, Lobster)", type: "Cross-reactive", style: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" }
  ],
  ibuprofen: [
    { name: "Aspirin / Naproxen (NSAIDs)", type: "Cross-reactive", style: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30" }
  ]
};

const NOTE_TYPE_STYLES = {
  "Rescue Protocol": "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200/50",
  "Cross-Reactivity Warning": "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50",
  "Dietary / Lifestyle Plan": "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/50",
  "Immunotherapy Note": "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50",
};

export default function ReferenceInfo({ allergies, doctorNotes = [], onAddNoteClick }) {
  
  // 1. Severity Calculations Breakdown
  const severeCount = allergies.filter((a) => a.severity === "Severe").length;
  const moderateCount = allergies.filter((a) => a.severity === "Moderate").length;
  const mildCount = allergies.filter((a) => a.severity === "Mild").length;
  const total = allergies.length || 1;

  const severityBars = [
    { label: "Severe", count: severeCount, bar: "bg-rose-500", text: "text-rose-700 dark:text-rose-400", tag: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200" },
    { label: "Moderate", count: moderateCount, bar: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", tag: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200" },
    { label: "Mild", count: mildCount, bar: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", tag: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200" },
  ];

  // 2. Generate Avoid Items Cross-Reactivity Checklist
  const dynamicAvoidItems = [];
  allergies.forEach(allergy => {
    const nameKey = allergy.allergyName?.toLowerCase().trim();
    if (CROSS_REACTIVE_MAP[nameKey]) {
      CROSS_REACTIVE_MAP[nameKey].forEach(item => {
        if (!dynamicAvoidItems.some(i => i.name === item.name)) {
          dynamicAvoidItems.push(item);
        }
      });
    }
  });

  const cardClass = "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between min-h-[340px]";
  const iconWrap = (colorClass) => `h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`;

  return (
    <div className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">
        Reference information
      </p>

      <div className="grid md:grid-cols-3 gap-5 items-stretch">

        {/* Avoid List */}
        <div className={cardClass}>
          <div className="w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className={iconWrap("bg-rose-50 dark:bg-rose-500/10")}>
                <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Avoid list</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Cross-reactive substances</p>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 mb-4" />
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
              {dynamicAvoidItems.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic py-12 text-center">No cross-reactive items identified.</p>
              ) : (
                dynamicAvoidItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100/70 dark:border-gray-800/50">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${item.style}`}>{item.type}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className={cardClass}>
          <div className="w-full">
            <div className="flex items-center gap-3 mb-5">
              <div className={iconWrap("bg-blue-50 dark:bg-blue-500/10")}>
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Severity breakdown</h3>
                <p className="text-xs text-gray-400 mt-0.5">Across all allergies</p>
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 mb-4" />
            <div className="space-y-4">
              {allergies.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-12 text-center">No profiles saved yet.</p>
              ) : (
                severityBars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-medium ${bar.text}`}>{bar.label}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${bar.tag}`}>{bar.count}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${bar.bar}`} style={{ width: `${(bar.count / total) * 100}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Doctor's Notes Card with Premium Interior Sub-items */}
        <div className={cardClass}>
          <div className="w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-5 gap-2 shrink-0">
              <div className="flex items-center gap-3">
                <div className={iconWrap("bg-emerald-50 dark:bg-emerald-500/10")}>
                  <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Doctor's notes</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Medical recommendations</p>
                </div>
              </div>

              <button 
                onClick={onAddNoteClick}
                className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer shadow-sm shadow-emerald-500/10"
              >
                + Add Note
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 mb-4 shrink-0" />

            {/* Note Content Scroller Area */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 flex-1 [&::-webkit-scrollbar]:hidden">
              {doctorNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                    No official doctor recommendations found.
                  </p>
                  <p className="text-[10px] text-gray-400/70 dark:text-gray-500/60 mt-0.5">
                    Click "+ Add Note" to save medical guidelines.
                  </p>
                </div>
              ) : (
                doctorNotes.map((item, i) => {
                  const tagStyle = NOTE_TYPE_STYLES[item.noteType] || NOTE_TYPE_STYLES["Rescue Protocol"];
                  return (
                    <div
                      key={item.id || i}
                      className="rounded-xl p-3.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800/70 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">
                          {item.doctorName}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${tagStyle}`}>
                          {item.noteType || "General"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium bg-white/70 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800/30 p-2.5 rounded-lg">
                        "{item.note}"
                      </p>
                      
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 flex justify-end">
                        Logged on {item.date}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}