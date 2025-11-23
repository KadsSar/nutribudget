"use client";

import { useState } from "react";
import { Download, TrendingDown } from "lucide-react";
import BudgetForm from "./BudgetForm";
import BasketList from "./BasketList";
import NutritionSummary from "./NutritionSummary";
import ChartsSection from "./ChartsSection";
import MagicBento from "./MagicBento";
import SDGSection from "./SDGSection";
import MealSuggestions from "./MealSuggestions";
import { exportShoppingList } from "../utils/exportList";
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
      const res = await fetch("http://127.0.0.1:5000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  const proteinPerDollar = plan
    ? plan.totals.protein / plan.totals.total_spent
    : 0;

  return (
    <div className="mx-auto w-full max-w-full space-y-8 py-8 text-white">
      <section className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 tracking-tight">
          NutriBudget
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Smart grocery planning for your health and budget
        </p>

        {/* Savings Badge */}
        {plan?.savings && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm animate-in fade-in slide-in-from-top">
            <TrendingDown className="w-4 h-4" />
            <span>
              You saved <strong>${plan.savings.amount.toFixed(2)}</strong> ({plan.savings.percentage}% less)
            </span>
          </div>
        )}
      </section>

      <MagicBento
        className="grid gap-6 grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto"
        textAutoHide={true}
        enableStars={false}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={0}
        glowColor="16, 185, 129"
      >
        {/* Input Form */}
        <div className="rounded-2xl p-6 bg-black/50 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 h-full shadow-lg shadow-black/50">
          <BudgetForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* SDG Impact */}
        {plan && (
          <SDGSection
            totalSpent={plan.totals.total_spent}
            proteinPerDollar={proteinPerDollar}
          />
        )}

        {/* Nutrition Summary */}
        <div className="rounded-2xl p-6 bg-black/50 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 h-full shadow-lg shadow-black/50">
          <h2 className="text-xl font-semibold text-white mb-4 text-cyan-400">Nutrition Summary</h2>
          <NutritionSummary
            totals={plan ? plan.totals : null}
            coverage={plan ? plan.coverage : null}
          />
        </div>

        {/* Meal Suggestions */}
        {plan && plan.items.length > 0 && (
          <div className="rounded-2xl p-6 bg-black/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full shadow-lg shadow-black/50">
            <MealSuggestions items={plan.items} dietType={plan.inputs.dietType} />
          </div>
        )}

        {/* Basket with Export */}
        <div className="rounded-2xl p-6 bg-black/50 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full shadow-lg shadow-black/50 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white text-purple-400">Your Basket</h2>
            {plan && plan.items.length > 0 && (
              <button
                onClick={() => exportShoppingList(plan.items, plan.totals)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Export List
              </button>
            )}
          </div>
          <BasketList items={plan ? plan.items : []} />
        </div>

        {/* Charts */}
        <div className="rounded-2xl p-6 bg-black/50 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 h-full shadow-lg shadow-black/50 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4 text-blue-400">Analysis</h2>
          <ChartsSection
            clusterBreakdown={plan ? plan.clusterBreakdown : {}}
            processingBreakdown={plan ? plan.processingBreakdown : {}}
          />
        </div>
      </MagicBento>
    </div>
  );
}
