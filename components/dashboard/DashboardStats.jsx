export default function DashboardStats({ totalMedicines, todaysDoses, pendingDoses }) {
  const stats = [
    {
      label: "Total medicines",
      value: totalMedicines,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/30",
    },
    {
      label: "Today's doses",
      value: todaysDoses,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/30",
    },
    {
      label: "Pending doses",
      value: pendingDoses,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
      iconColor: "text-rose-500 dark:text-rose-400",
      valueColor: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`
            bg-white dark:bg-gray-900
            rounded-2xl border ${stat.border}
            p-5 flex items-center gap-4
            transition-all duration-200 hover:-translate-y-0.5
            cursor-default
          `}
        >
          {/* Icon */}
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
            {stat.icon}
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-semibold ${stat.valueColor}`}>
              {stat.value}
            </p>
          </div>

        </div>
      ))}
    </div>
  );
}