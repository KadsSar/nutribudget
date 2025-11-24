"use client";

import React from "react";
import { MapPin, Navigation, Store } from "lucide-react";
import type { BasketItem } from "../types/plan";

type Props = {
    items: BasketItem[];
};

export default function LocalShopper({ items }: Props) {
    // Extract unique stores from items
    const stores = React.useMemo(() => {
        if (!items) return [];
        const uniqueStores = new Set(items.map((item) => item.store));
        return Array.from(uniqueStores).filter(Boolean); // Filter out empty/null stores
    }, [items]);

    if (stores.length === 0) return null;

    return (
        <div className="rounded-xl p-6 bg-white border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 shadow-md hover:shadow-lg h-full">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Local Shopper</h2>
                    <p className="text-xs text-indigo-600 font-medium">Find Stores Near You</p>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-50">
                {stores.map((store, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                                <Store className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-gray-700">{store}</span>
                        </div>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store + " grocery store")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-md shadow-sm hover:shadow hover:scale-105 transition-all"
                        >
                            <Navigation className="w-3 h-3" />
                            Navigate
                        </a>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-100 text-center">
                <p className="text-xs text-gray-500 italic">
                    Click "Navigate" to find the nearest location on Google Maps
                </p>
            </div>
        </div>
    );
}
