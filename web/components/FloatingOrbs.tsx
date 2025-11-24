"use client";

import { motion } from "framer-motion";

export default function FloatingOrbs() {
    const orbs = [
        { size: "w-72 h-72", color: "bg-emerald-400/20", delay: 0, duration: 20 },
        { size: "w-96 h-96", color: "bg-blue-400/15", delay: 2, duration: 25 },
        { size: "w-64 h-64", color: "bg-purple-400/20", delay: 4, duration: 22 },
        { size: "w-80 h-80", color: "bg-amber-400/15", delay: 1, duration: 23 },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {orbs.map((orb, index) => (
                <motion.div
                    key={index}
                    className={`${orb.size} ${orb.color} rounded-full blur-3xl absolute`}
                    animate={{
                        x: [
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50,
                        ],
                        y: [
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50,
                            Math.random() * 100 - 50,
                        ],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: orb.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        left: `${20 + index * 20}%`,
                        top: `${10 + index * 15}%`,
                    }}
                />
            ))}
        </div>
    );
}
