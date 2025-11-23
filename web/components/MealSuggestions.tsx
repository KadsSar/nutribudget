"use client";

import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import type { BasketItem } from "../types/plan";

type Props = {
    items: BasketItem[];
    dietType?: string;
};

export default function MealSuggestions({ items, dietType = "balanced" }: Props) {
    if (!items || items.length === 0) return null;

    const isVegan = dietType === "vegan";
    const isVeg = dietType === "veg" || dietType === "vegetarian";

    // Categorize items with diet awareness
    const proteins = items.filter(item => {
        const name = item.product_name?.toLowerCase() || "";
        const category = item.category?.toLowerCase() || "";

        if (isVegan) {
            // Vegan proteins: beans, lentils, tofu, nuts
            return name.includes("bean") || name.includes("lentil") ||
                name.includes("tofu") || name.includes("chickpea") ||
                name.includes("nut") || category.includes("legume");
        } else if (isVeg) {
            // Vegetarian proteins: add dairy, eggs
            return name.includes("egg") || name.includes("cheese") ||
                name.includes("yogurt") || name.includes("paneer") ||
                name.includes("bean") || name.includes("lentil");
        } else {
            // Non-veg: all proteins
            return category.includes("meat") || category.includes("seafood") ||
                name.includes("chicken") || name.includes("beef") ||
                name.includes("fish") || name.includes("egg");
        }
    });

    const carbs = items.filter(item => {
        const name = item.product_name?.toLowerCase() || "";
        return name.includes("bread") || name.includes("rice") ||
            name.includes("pasta") || name.includes("oat") ||
            name.includes("cereal") || name.includes("tortilla");
    });

    const veggies = items.filter(item => {
        const name = item.product_name?.toLowerCase() || "";
        const category = item.category?.toLowerCase() || "";
        return category.includes("produce") || category.includes("vegetable") ||
            name.includes("salad") || name.includes("broccoli") ||
            name.includes("carrot") || name.includes("spinach");
    });

    const fruits = items.filter(item => {
        const name = item.product_name?.toLowerCase() || "";
        return name.includes("apple") || name.includes("banana") ||
            name.includes("orange") || name.includes("berry");
    });

    // Generate meals based on available items
    const meals = [
        {
            time: "Breakfast",
            items: [
                carbs[0]?.product_name || (isVegan ? "Oatmeal" : "Eggs & Toast"),
                fruits[0]?.product_name || "Fresh Fruit",
            ].filter(Boolean),
            icon: "🌅"
        },
        {
            time: "Lunch",
            items: [
                proteins[0]?.product_name || (isVegan ? "Lentil Curry" : isVeg ? "Paneer" : "Grilled Chicken"),
                carbs[1]?.product_name || carbs[0]?.product_name || "Rice",
                veggies[0]?.product_name || "Mixed Vegetables",
            ].filter(Boolean),
            icon: "☀️"
        },
        {
            time: "Dinner",
            items: [
                proteins[1]?.product_name || proteins[0]?.product_name || (isVegan ? "Chickpeas" : "Protein"),
                veggies[1]?.product_name || veggies[0]?.product_name || "Salad",
                carbs[2]?.product_name || "Whole Grain",
            ].filter(Boolean),
            icon: "🌙"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
        >
            <div className="flex items-center gap-2 mb-3">
                <Utensils className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Sample Day Meals</h3>
            </div>

            <div className="space-y-2">
                {meals.map((meal, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{meal.icon}</span>
                            <span className="text-sm font-medium text-purple-400">{meal.time}</span>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1">
                            {meal.items.slice(0, 3).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span className="line-clamp-1">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <p className="text-xs text-slate-500 italic">
                * {isVegan ? "🌱 Vegan" : isVeg ? "🥬 Vegetarian" : "🍖 Non-Vegetarian"} meal suggestions from your basket
            </p>
        </motion.div>
    );
}
