"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, TrendingUp } from "lucide-react";

type Props = {
    totalSpent: number;
    proteinPerDollar: number;
};

export default function SDGSection({ totalSpent, proteinPerDollar }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-xl border border-emerald-500/20 shadow-lg"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-blue-500/30 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-emerald-400" fill="currentColor" />
                </div>
                <h3 className="font-semibold text-white">🌍 Social Impact</h3>
            </div>

            <p className="text-sm text-slate-300 mb-4">
                This plan supports UN Sustainable Development Goals:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                    <div className="text-3xl mb-1">🌾</div>
                    <div className="text-xs text-emerald-400 font-semibold">SDG 2</div>
                    <div className="text-xs text-slate-300">Zero Hunger</div>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                    <div className="text-3xl mb-1">💪</div>
                    <div className="text-xs text-blue-400 font-semibold">SDG 3</div>
                    <div className="text-xs text-slate-300">Good Health</div>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div className="text-2xl">💰</div>
                    <div className="flex-1">
                        <div className="text-slate-400 text-xs">Optimized Budget</div>
                        <div className="text-white font-semibold">${totalSpent.toFixed(2)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div className="text-2xl">🥗</div>
                    <div className="flex-1">
                        <div className="text-slate-400 text-xs">Protein Value</div>
                        <div className="text-white font-semibold">{proteinPerDollar.toFixed(1)}g per dollar</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
