"use client";

import type { Match, League, OpponentEntry, Team } from "../lib/types";
import Image from "next/image";


export default function MatchCard(match: Match) {
    const { name, id, date, beginAt, opponents, league } = match
    const leagueIcon = league.image_url
    return (
        <div
            className="mt-5 z-10 h-30 rounded-md  bg-gray-900 p-4 shadow-cyan-300/50"
        >
            <div className="flex items-center gap-3">
                {leagueIcon ? (
                    <Image src={leagueIcon}
                        alt={league.name || "League Icon"}
                        className="h-8 w-8 rounded-md border object-cover"
                        loading="lazy" />
                ) : (
                    <div className="h-8 w-8 rounded-md border bg-gray-100 dark:bg-gray-700" />
                )}
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {league.name || "League"}
                    </div>
                    <time dateTime={date} className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {beginAt}
                    </time>
                </div>

                {/* Optional status/BO3 badge on the right */}
                {/* <span className="ml-auto rounded-full border px-3 py-1 text-xs">BO3</span> */}
            </div>
        </div>
    )
}



// export default function MatchCard({ match, onClick }) {
//     // Accepts your PandaScore-ish shape
//     const league = match.league || {};
//     const leagueIcon = league.image_url || league.icon || null;
//
//     const whenISO = match.scheduled_at || match.begin_at || match.whenISO || "";
//     const when = whenISO ? new Date(whenISO).toLocaleString() : "TBD";
//
//     const A = match.opponents?.[0]?.opponent ?? match.opponents?.[0] ?? {};
//     const B = match.opponents?.[1]?.opponent ?? match.opponents?.[1] ?? {};
//     const scoreA = A.score;
//     const scoreB = B.score;
//
//     return (
//         <article
//             role="button"
//             tabIndex={0}
//             onClick={onClick}
//             className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm
//                  dark:divide-white/10 dark:bg-gray-800/50 dark:shadow-none dark:outline dark:-outline-offset-1 dark:outline-white/10"
//         >
//             {/* Header (from Tailwind example) */}
//             <div className="px-4 py-5 sm:px-6">
//             </div>
//
//             {/* Body (from Tailwind example) */}
//             <div className="px-4 py-5 sm:p-6">
//                 <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
//                     <TeamSlot team={A} score={scoreA} side="left" />
//                     <div className="flex flex-col items-center justify-center">
//                         <div className="rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide">VS</div>
//                     </div>
//                     <TeamSlot team={B} score={scoreB} side="right" />
//                 </div>
//             </div>
//         </article>
//     );
// }
