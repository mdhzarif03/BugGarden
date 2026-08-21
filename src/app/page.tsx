import Link from "next/link";
import Header from "@/components/ui/Header";
import { ArrowRight, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-slate-800 bg-slate-900 px-3 py-1 rounded-full text-xs text-emerald-400 mb-6">
          <Terminal size={14} /> Open-Source Debugging Playground
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Find the bug. Fix the code. Understand why.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-xl">
          A tiny open-source debugging playground for learning how to think like
          a programmer.
        </p>

        <div className="flex gap-4 mb-12">
          <Link
            href="/play"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg text-sm transition"
          >
            Start Debugging <ArrowRight size={16} />
          </Link>
          <Link
            href="/challenges"
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium px-6 py-3 rounded-lg text-sm transition"
          >
            View Challenges
          </Link>
        </div>

        {/* Visual Preview */}
        <div className="w-full text-left bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-500">
            preview.py
          </div>
          <pre className="p-4 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed overflow-x-auto">
            <code>
              <span className="text-purple-400">def</span>{" "}
              <span className="text-blue-400">sum_two</span>(a, b):{"\n"}
              {"    "}
              <span className="text-slate-500">
                # Bug: Subtracts instead of adds!
              </span>
              {"\n"}
              {"    "}
              <span className="text-purple-400">return</span> a - b
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
}
