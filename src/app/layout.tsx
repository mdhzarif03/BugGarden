import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold text-emerald-400 tracking-tight flex items-center gap-2"
            >
              <span>⚡</span> BugGarden Competitive
            </Link>
            <nav className="flex gap-4 text-sm font-medium text-slate-400">
              <Link href="/arena" className="hover:text-emerald-400 transition">
                Arena
              </Link>
              <Link
                href="/leaderboard"
                className="hover:text-emerald-400 transition"
              >
                Leaderboard
              </Link>
            </nav>
          </div>

          <div>
            {session?.user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">
                    {session.user.name}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono">
                    Ranked Competitor
                  </div>
                </div>
                <img
                  src={session.user.image || ""}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-emerald-500/50"
                />
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <button
                  type="submit"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition shadow-lg shadow-emerald-950"
                >
                  Sign In with GitHub
                </button>
              </form>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
