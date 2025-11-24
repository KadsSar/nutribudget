"use client";

import { useState } from "react";
import { Download, TrendingDown } from "lucide-react";
import BudgetForm from "./BudgetForm";
import BasketList from "./BasketList";
import NutritionSummary from "./NutritionSummary";
import ChartsSection from "./ChartsSection";
import SDGSection from "./SDGSection";
import MealSuggestions from "./MealSuggestions";
import SmartChef from "./SmartChef";
import LocalShopper from "./LocalShopper";
import PlanSkeleton from "./PlanSkeleton";
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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
      const res = await fetch(`${API_URL}/api/plan`, {
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
    <div className="mx-auto w-full max-w-7xl space-y-8 py-8">
      {/* Hero Header */}
      <section className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="inline-flex items-center gap-3 mb-2 group">
          <span className="text-5xl animate-bounce">🥗</span>
          <h1 className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 tracking-tight hover:scale-105 transition-transform duration-300 drop-shadow-lg">
            NutriBudget
          </h1>
        </div>
        <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
          Smart grocery planning that balances <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">nutrition</span> and <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">budget</span>
        </p>

        {/* Savings Badge */}
        {plan?.savings && (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-full text-amber-900 font-medium text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-top">
            <TrendingDown className="w-5 h-5 text-amber-600" />
            <span>
              You saved <strong className="text-amber-700">${plan.savings.amount.toFixed(2)}</strong> ({plan.savings.percentage}% less than typical shopping)
            </span>
          </div>
        )}
      </section>

      {/* Show skeleton while loading */}
      {loading ? (
        <PlanSkeleton />
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Input Form */}
          <div className="group rounded-xl p-6 bg-white/90 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-500 shadow-lg hover:shadow-emerald-500/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h2 className="text-xl font-semibold text-gray-800">Plan Your Budget</h2>
            </div>
            <BudgetForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
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
          <div className="rounded-xl p-6 bg-white border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🥗</span>
              <h2 className="text-xl font-semibold text-gray-800">Nutrition Summary</h2>
            </div>
            <NutritionSummary
              totals={plan ? plan.totals : null}
              coverage={plan ? plan.coverage : null}
            />
          </div>

          {/* Meal Suggestions */}
          {plan && plan.items.length > 0 && (
            <div className="group rounded-xl p-6 bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-500 shadow-lg hover:shadow-blue-500/30 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
              <MealSuggestions items={plan.items} dietType={plan.inputs.dietType} />
            </div>
          )}

          {/* Smart Chef */}
          {plan && plan.items.length > 0 && (
            <div className="lg:col-span-2">
              <SmartChef items={plan.items} />
            </div>
          )}

          {/* Basket with Export */}
          <div className="group rounded-xl p-6 bg-white/90 backdrop-blur-sm border-2 border-amber-200 hover:border-amber-400 transition-all duration-500 shadow-lg hover:shadow-amber-500/30 hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <h2 className="text-xl font-semibold text-gray-800">Your Shopping Basket</h2>
              </div>
              {plan && plan.items.length > 0 && (
                <button
                  onClick={() => exportShoppingList(plan.items, plan.totals)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Export List
                </button>
              )}
            </div>
            <BasketList items={plan ? plan.items : []} />
          </div>

          {/* Charts & Local Shopper Grid */}
          {plan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:col-span-2">
              <div className="lg:col-span-2 rounded-xl p-6 bg-white border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📊</span>
                  <h2 className="text-xl font-semibold text-gray-800">Basket Analysis</h2>
                </div>
                <ChartsSection
                  clusterBreakdown={plan.clusterBreakdown}
                  processingBreakdown={plan.processingBreakdown}
                />
              </div>
              <div className="lg:col-span-1">
                <LocalShopper items={plan.items} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer Footer */}
      <div className="max-w-6xl mx-auto mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="font-medium text-gray-700 mb-1">Data Disclaimer</p>
            <p>
              Prices and nutritional information are estimates based on Canadian grocery data (2024-2025).
              Actual prices may vary by location and time. Nutritional data sourced from Health Canada and USDA databases.
              Always verify with your local store before purchasing.
            </p>
            <p className="text-xs text-gray-500 mt-2">Last updated: November 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
