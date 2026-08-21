"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CHALLENGES } from "@/challenges/data";
import { runPythonTests } from "@/lib/execution/pyodideRunner";
import { markChallengeComplete, getUserProfile, UserProfile } from "@/lib/progress";
import { TestResult } from "@/types";

function PlayContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "01";
  const challenge = CHALLENGES.find((c) => c.id === id) || CHALLENGES[0];
  const [code, setCode] = useState(challenge.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({ name: "Guest Developer", avatar: "⚡", xp: 0, completedIds: [] });

  useEffect(() => {
    setCode(challenge.starterCode);
    setResults([]);
    setShowHint(false);
    setProfile(getUserProfile());
  }, [id, challenge]);

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await runPythonTests(code, challenge.tests);
      setResults(res);
      const allPassed = res.length > 0 && res.every((r) => r.passed);
      if (allPassed) {
        const updated = markChallengeComplete(challenge.id, 50);
        setProfile(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const isSolved = profile.completedIds.includes(challenge.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 px-6 py-3 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-4">
          <Link href="/challenges" className="text-xs text-slate-400 hover:text-slate-200">← Back to Hub</Link>
          <h1 className="text-lg font-bold text-emerald-400">BugGarden</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-amber-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">{profile.xp} XP</span>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <section className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">{challenge.category}</span>
              {isSolved && <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">✓ Solved</span>}
            </div>
            <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">{challenge.description}</p>
          </div>
          <div>
            {showHint ? (
              <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-amber-200 text-xs"><strong>Hint:</strong> {challenge.hints[0]}</div>
            ) : (
              <button onClick={() => setShowHint(true)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 border border-slate-700">Reveal Hint</button>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex-1 flex flex-col">
            <div className="bg-slate-800/80 px-4 py-2.5 flex justify-between items-center border-b border-slate-700">
              <span className="text-xs font-mono text-slate-400">main.py</span>
              <div className="space-x-2">
                <button onClick={() => setCode(challenge.starterCode)} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-xs rounded text-slate-200">Reset</button>
                <button onClick={handleRun} disabled={isRunning} className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold rounded text-white">{isRunning ? "Running..." : "► Run Code"}</button>
              </div>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full flex-1 bg-slate-950 p-4 font-mono text-sm text-slate-200 resize-none focus:outline-none" rows={10} />
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 min-h-[160px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Execution Output</h3>
            {isRunning && <p className="text-xs text-amber-400 animate-pulse">Running Python test suite...</p>}
            {!isRunning && results.length === 0 && <p className="text-xs text-slate-500 italic">Click "Run Code" to test your solution...</p>}
            {!isRunning && results.length > 0 && (
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className={`p-2.5 rounded-lg border text-xs font-mono ${r.passed ? "bg-emerald-950/40 border-emerald-800 text-emerald-300" : "bg-rose-950/40 border-rose-800 text-rose-300"}`}>
                    <div>{r.passed ? "✓ PASSED" : "✕ FAILED"}: <span className="text-slate-200">{r.expression}</span></div>
                    <div className="mt-1">Expected: <span className="text-slate-300">{r.expected}</span> | Received: <span className="text-slate-300">{r.received}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function PlayPage() {
  return <Suspense fallback={<div className="p-8 text-slate-400">Loading...</div>}><PlayContent /></Suspense>;
}
