"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/ui/Header";
import { CHALLENGES } from "@/challenges/data";
import { getProgress } from "@/lib/progress/storage";
import { CheckCircle2, Circle } from "lucide-react";

export default function ChallengesPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const progress = getProgress();
    setCompletedIds(progress.completed);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 w-full flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Debugging Challenges
            </h1>
            <p className="text-slate-400 text-sm">
              Select a broken piece of code to diagnose and repair.
            </p>
          </div>
          <div className="text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-2 rounded-md text-emerald-400">
            {completedIds.length} / {CHALLENGES.length} Completed
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHALLENGES.map((item) => {
            const isDone = completedIds.includes(item.id);
            return (
              <Link
                key={item.id}
                href={`/play?id=${item.id}`}
                className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-xl transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-slate-500 group-hover:text-emerald-400 transition">
                      #{item.id}
                    </span>
                    {isDone ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} className="text-slate-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-emerald-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-slate-800/80 text-slate-400">
                    {item.difficulty}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
