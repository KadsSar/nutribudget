"use client";
import React from "react";

type Props = {
  clusterBreakdown?: Record<string, number>;
  processingBreakdown?: Record<string, number>;
};

export default function ChartsSection({
  clusterBreakdown = {},
  processingBreakdown = {},
}: Props) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (
      (clusterBreakdown && Object.keys(clusterBreakdown).length > 0) ||
      (processingBreakdown && Object.keys(processingBreakdown).length > 0)
    ) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [clusterBreakdown, processingBreakdown]);

  // Calculate max value for better bar visualization
  const clusterMax = Math.max(...Object.values(clusterBreakdown), 1);
  const processingMax = Math.max(...Object.values(processingBreakdown), 1);

  return (
    <section className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cluster Breakdown */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-lg border-2 border-emerald-200">
          <h3 className="text-sm font-bold text-emerald-800 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>🏷️</span> By Category
          </h3>
          <ul className="space-y-3">
            {(!clusterBreakdown || Object.entries(clusterBreakdown).length === 0) && (
              <li className="text-gray-500 italic text-sm">No data available</li>
            )}
            {clusterBreakdown && Object.entries(clusterBreakdown).map(([label, count], i) => (
              <li
                key={label}
                className={`transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                  }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">{label}</span>
                  <span className="font-bold text-emerald-600">{count} items</span>
                </div>
                <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-emerald-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(count / clusterMax) * 100}%`,
                      transitionDelay: `${i * 80 + 80}ms`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Processing Breakdown */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-lg border-2 border-blue-200">
          <h3 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>🔬</span> Processing Level
          </h3>
          <ul className="space-y-3">
            {(!processingBreakdown || Object.entries(processingBreakdown).length === 0) && (
              <li className="text-gray-500 italic text-sm">No data available</li>
            )}
            {processingBreakdown && Object.entries(processingBreakdown).map(([label, count], i) => (
              <li
                key={label}
                className={`transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                  }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">{label}</span>
                  <span className="font-bold text-blue-600">{count} items</span>
                </div>
                <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-blue-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(count / processingMax) * 100}%`,
                      transitionDelay: `${i * 80 + 80}ms`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
