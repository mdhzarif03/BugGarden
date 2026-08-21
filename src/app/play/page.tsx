"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DynamicEditor from "@/components/editor/CodeEditor";
import { CHALLENGES } from "@/challenges/data";
import { runPythonTests } from "@/lib/execution/pyodideRunner";
import {
  getProgress,
  markCompleted,
  recordHintUsed,
} from "@/lib/progress/storage";
import { TestResult, Challenge } from "@/types";
import {
  Play,
  RotateCcw,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import Header from "@/components/ui/Header";

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const challengeId = searchParams.get("id") || "01";

  const challenge: Challenge =
    CHALLENGES.find((c) => c.id === challengeId) || CHALLENGES[0];

  const [code, setCode] = useState(challenge.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setCode(challenge.starterCode);
    setResults([]);
    setHintLevel(0);
    setIsSuccess(false);
  }, [challengeId]);

  const handleRun = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      const res = await runPythonTests(code, challenge.tests);
      setResults(res);

      const allPassed = res.length > 0 && res.every((t) => t.passed);
      if (allPassed) {
        setIsSuccess(true);
        markCompleted(challenge.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const showNextHint = () => {
    if (hintLevel < challenge.hints.length) {
      const next = hintLevel + 1;
      setHintLevel(next);
      recordHintUsed(challenge.id, next);
    }
  };

  const getNextChallengeId = () => {
    const currentIndex = CHALLENGES.findIndex((c) => c.id === challenge.id);
    if (currentIndex < CHALLENGES.length - 1) {
      return CHALLENGES[currentIndex + 1].id;
    }
    return CHALLENGES[0].id;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden border-t border-slate-800">
        {/* LEFT PANEL: Challenge Info */}
        <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto max-h-[calc(100vh-65px)] bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
            <span>Challenge #{challenge.id}</span>
            <span>•</span>
            <span className="text-slate-400">{challenge.category}</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-100 mb-3">
            {challenge.title}
          </h1>

          <div className="flex gap-2 mb-6">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                challenge.difficulty === "Beginner"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : challenge.difficulty === "Intermediate"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {challenge.language}
            </span>
          </div>

          <div className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
            {challenge.description}
          </div>

          {/* HINT SYSTEM */}
          <div className="border-t border-slate-800 pt-4 mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold flex items-center gap-1.5 text-amber-400">
                <Lightbulb size={16} /> Hints ({hintLevel}/
                {challenge.hints.length})
              </span>
              {hintLevel < challenge.hints.length && (
                <button
                  onClick={showNextHint}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded border border-slate-700 transition"
                >
                  Reveal Hint
                </button>
              )}
            </div>

            <div className="space-y-2">
              {challenge.hints.slice(0, hintLevel).map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-amber-950/20 border border-amber-800/30 rounded text-xs text-amber-200/90"
                >
                  <strong>Hint {idx + 1}:</strong> {hint}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Code Editor & Output */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-65px)]">
          {/* Action Toolbar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400">main.py</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCode(challenge.starterCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded font-medium transition"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded font-medium transition disabled:opacity-50"
              >
                <Play size={14} /> {isRunning ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 bg-slate-950">
            <DynamicEditor code={code} onChange={(v) => setCode(v || "")} />
          </div>

          {/* Test Results Output Drawer */}
          <div className="h-64 bg-slate-900 border-t border-slate-800 p-4 overflow-y-auto font-mono text-xs">
            <div className="text-slate-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Execution Output
            </div>

            {results.length === 0 && !isRunning && (
              <div className="text-slate-500 italic">
                Click "Run Code" to test your fix...
              </div>
            )}

            {isRunning && (
              <div className="text-amber-400 animate-pulse">
                Running Pyodide WebAssembly tests...
              </div>
            )}

            <div className="space-y-3">
              {results.map((res, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border ${
                    res.passed
                      ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                      : "bg-rose-950/20 border-rose-800/40 text-rose-300"
                  }`}
                >
                  <div className="flex justify-between font-bold mb-1">
                    <span>
                      {res.passed ? "✓ Test Passed" : "✗ Test Failed"}
                    </span>
                    <span>{res.expression}</span>
                  </div>
                  {res.error ? (
                    <div className="text-rose-400 mt-1">{res.error}</div>
                  ) : (
                    <div className="flex justify-between text-slate-400 text-[11px] mt-1">
                      <span>Expected: {res.expected}</span>
                      <span>Received: {res.received}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* SUCCESS MODAL */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-2">
              <CheckCircle size={22} /> Bug Fixed!
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {challenge.title}
            </h2>
            <p className="text-sm text-slate-300 mb-4">
              {challenge.explanation}
            </p>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-6 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Concept:</span>{" "}
              {challenge.concept}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded transition"
              >
                Review Fix
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  router.push(`/play?id=${getNextChallengeId()}`);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded transition"
              >
                Next Challenge <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-slate-400 font-mono">
          Loading playground...
        </div>
      }
    >
      <PlaygroundContent />
    </Suspense>
  );
}
