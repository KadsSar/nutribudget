import React, { useEffect, useState } from "react";
import type { PlanTotals, PlanCoverage } from "../types/plan";

type Props = {
  totals: PlanTotals | null;
  coverage: PlanCoverage | null;
};

export default function NutritionSummary({ totals, coverage }: Props) {
  const [dispCost, setDispCost] = useState(0);
  const [dispCalories, setDispCalories] = useState(0);
  const [dispProtein, setDispProtein] = useState(0);

  useEffect(() => {
    if (!totals) {
      setDispCost(0);
      setDispCalories(0);
      setDispProtein(0);
      return;
    }

    const duration = 700;
    const start = performance.now();
    const fromCost = dispCost;
    const fromCal = dispCalories;
    const fromProt = dispProtein;
    const targetCost = totals.total_spent;
    const targetCalories = totals.calories;
    const targetProtein = totals.protein;

    let raf = 0;
    function animate(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // simple ease
      setDispCost(
        Math.round((fromCost + (targetCost - fromCost) * ease) * 100) / 100
      );
      setDispCalories(Math.round(fromCal + (targetCalories - fromCal) * ease));
      setDispProtein(
        Math.round((fromProt + (targetProtein - fromProt) * ease) * 10) / 10
      );
      if (t < 1) raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals]);

  if (!totals || !coverage) {
    return <p className="italic text-gray-500">No summary yet.</p>;
  }

  return (
    <section className="h-full flex flex-col justify-center">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-emerald-600">${dispCost.toFixed(2)}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Calories</p>
          <p className="text-2xl font-bold text-blue-600">{dispCalories.toFixed(0)}</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Protein</p>
          <p className="text-2xl font-bold text-amber-600">{dispProtein.toFixed(1)}g</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Calorie Coverage</span>
            <span className="font-semibold text-blue-600">{coverage.calories.percentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${Math.min(coverage.calories.percentage, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Protein Coverage</span>
            <span className="font-semibold text-emerald-600">{coverage.protein.percentage.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${Math.min(coverage.protein.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
