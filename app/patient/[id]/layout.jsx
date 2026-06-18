export default function PatientLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f4f2] dark:bg-[#030712] transition-colors duration-300">
      <main className="max-w-[760px] mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}