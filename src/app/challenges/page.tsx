"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CHALLENGES } from "@/challenges/data";
import { getUserProfile, UserProfile } from "@/lib/progress";

export default function ChallengesPage() {
  const [profile, setProfile] = useState<UserProfile>({ name: "Guest Developer", avatar: "⚡", xp: 0, completedIds: [] });
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const categories = ["All", ...Array.from(new Set(CHALLENGES.map((c) => c.category)))];
  const filtered = filter === "All" ? CHALLENGES : CHALLENGES.filter((c) => c.category === filter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">BugGarden</h1>
          <p className="text-xs text-slate-400">Interactive Python Debugging Arena</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
          <span className="text-xl">{profile.avatar}</span>
          <div>
            <p className="text-xs font-semibold text-slate-200">{profile.name}</p>
            <p className="text-[10px] text-amber-400 font-mono font-bold">{profile.xp} XP • {profile.completedIds.length}/{CHALLENGES.length} Solved</p>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === cat ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400 hover:bg-slate-800"}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const isDone = profile.completedIds.includes(c.id);
            return (
              <div key={c.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex justify-between items-start hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 uppercase tracking-wider">{c.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono">#{c.id}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">{c.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                </div>
                <div className="flex flex-col items-end justify-between self-stretch pl-4">
                  {isDone ? <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded">✓ Solved</span> : <span className="text-xs text-amber-400 font-mono">+50 XP</span>}
                  <Link href={`/play?id=${c.id}`} className="mt-4 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-medium rounded text-white transition-colors">Solve</Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
