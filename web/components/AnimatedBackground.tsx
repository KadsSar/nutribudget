"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Animated gradient mesh */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                    ],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Floating shapes */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70"
                    style={{
                        width: `${Math.random() * 300 + 100}px`,
                        height: `${Math.random() * 300 + 100}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: [
                            "linear-gradient(45deg, #10b981, #3b82f6)",
                            "linear-gradient(45deg, #3b82f6, #a855f7)",
                            "linear-gradient(45deg, #f59e0b, #10b981)",
                        ][i % 3],
                    }}
                    animate={{
                        x: [0, Math.random() * 100 - 50, 0],
                        y: [0, Math.random() * 100 - 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 2,
                    }}
                />
            ))}
        </div>
    );
}
