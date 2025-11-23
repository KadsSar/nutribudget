"use client";

import { useState } from "react";
import BudgetForm from "./BudgetForm";
import BasketList from "./BasketList";
import NutritionSummary from "./NutritionSummary";
import ChartsSection from "./ChartsSection";
import MagicBento from "./MagicBento";
import type { PlanResponse } from "../types/plan";

export default function PlanShell() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(params: {
    budget: number;
    people: number;
    dietType: string;
    goal: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      // Use 127.0.0.1 to avoid localhost IPv6 resolution issues
      const res = await fetch("http://127.0.0.1:5000/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data: PlanResponse = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error("Plan generation error:", err);
      // Show more detailed error if available
      setError(err.message || "Failed to connect to backend. Ensure server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-full space-y-6 py-8 text-white">
      <section>
        <h1 className="text-3xl font-bold text-black mb-2 tracking-tight text-center">
          NutriBudget — Plan Builder
        </h1>
      </section>

      <MagicBento
        className="grid gap-6 grid-cols-1 max-w-2xl mx-auto"
        textAutoHide={true}
        enableStars={false} // Too busy
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={0} // Remove particles for cleaner look
        glowColor="16, 185, 129" // Emerald
      >
        <div className="rounded-2xl p-6 bg-black/40 backdrop-blur-md border border-white/10 h-full">
          <BudgetForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-6 bg-black/40 backdrop-blur-md border border-white/10 h-full">
          <NutritionSummary
            totals={plan ? plan.totals : null}
            coverage={plan ? plan.coverage : null}
          />
        </div>

        <div className="rounded-2xl p-6 bg-black/40 backdrop-blur-md border border-white/10 h-full">
          <h2 className="text-xl font-medium text-white mb-4">Basket</h2>
          <BasketList items={plan ? plan.items : []} />
        </div>

        <div className="rounded-2xl p-6 bg-black/40 backdrop-blur-md border border-white/10 h-full">
          <ChartsSection
            clusterBreakdown={plan ? plan.clusterBreakdown : {}}
            processingBreakdown={plan ? plan.processingBreakdown : {}}
          />
        </div>
      </MagicBento>
    </div>
  );
}
