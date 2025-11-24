import PlanShell from "../components/PlanShell";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 relative overflow-hidden">
      {/* Stunning animated background */}
      <AnimatedBackground />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlanShell />
      </main>
    </div>
  );
}
