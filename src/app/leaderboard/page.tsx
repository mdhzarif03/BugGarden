import { getLeaderboard } from "../actions";

export default async function LeaderboardPage() {
  const players = await getLeaderboard();

  return (
    <div className="max-w-4xl mx-auto w-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">
          Global Competitor Rankings
        </h1>
        <p className="text-sm text-slate-400">
          Solve challenges faster to gain ELO rating and climb the leaderboard.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Player</th>
              <th className="p-4 text-right">Rating (ELO)</th>
              <th className="p-4 text-right">Total XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {players.map((player, idx) => (
              <tr key={player.id} className="hover:bg-slate-800/30 transition">
                <td className="p-4 font-mono font-bold text-slate-400">
                  #{idx + 1}
                </td>
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={player.image || "/default-avatar.png"}
                    className="w-7 h-7 rounded-full"
                    alt=""
                  />
                  <span className="font-semibold text-slate-200">
                    {player.name}
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-emerald-400">
                  {player.rating}
                </td>
                <td className="p-4 text-right font-mono text-amber-400">
                  {player.xp} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
