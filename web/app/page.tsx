import PlanShell from "../components/PlanShell";
import ColorBends from "../components/ColorBends";
import GradualBlur from "../components/GradualBlur";


export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <ColorBends
          colors={["#10B981", "#06B6D4", "#8B5CF6"]} // Emerald, Cyan, Purple
          rotation={35}
          speed={0.25}
          scale={1.3}
          frequency={1.5}
          warpStrength={1.1}
          mouseInfluence={0.7}
          parallax={0.5}
          noise={0.06}
          transparent
        />
      </div>

      {/* Subtle vignette for depth */}
      <div
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
        }}
      />

      <main className="w-full max-w-[95vw] py-6 px-6 z-10 relative">
        {/* <TopNav /> */}
        <div className="py-6">
          <PlanShell />
        </div>
      </main>

      <GradualBlur
        position="bottom"
        height="6rem"
        strength={1.5}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={0.8}
        target="page"
        zIndex={50}
      />
    </div>
  );
}
