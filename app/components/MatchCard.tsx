"use client";

import type { Match, Player } from "../lib/types";
import Image from "next/image";
import { useState } from "react";

function PlayerList({ players }: { players?: Player[] }) {
    if (!players || players.length === 0) {
        return (
            <div className="text-xs text-gray-500 italic">
                No player information available
            </div>
        );
    }

    // Define role order
    const roleOrder: { [key: string]: number } = {
        'top': 1,
        'jun': 2,
        'mid': 3,
        'adc': 4,
        'sup': 5,
    };

    // Sort players by role
    const sortedPlayers = [...players].sort((a, b) => {
        const roleA = roleOrder[a.role?.toLowerCase()] || 999;
        const roleB = roleOrder[b.role?.toLowerCase()] || 999;
        return roleA - roleB;
    });

    return (
        <div className="space-y-2">
            {sortedPlayers.map((player) => (
                <div key={player.id} className="flex items-center gap-2">
                    {player.image_url ? (
                        <Image
                            src={player.image_url}
                            alt={player.name}
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover bg-gray-800"
                        />
                    ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-[10px]">
                            ?
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                            {player.name}
                        </div>
                    </div>
                    {player.role && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 uppercase">
                            {player.role}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function MatchCard({ match }: { match: Match }) {
    const { league, begin_at, opponents } = match;
    const leagueIcon = league.image_url;
    const [isHovered, setIsHovered] = useState(false);

    // Get team data
    const teamA = opponents?.[0]?.opponent;
    const teamB = opponents?.[1]?.opponent;

    // Format date
    const matchDate = begin_at ? new Date(begin_at).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }) : "TBD";

    return (
        <div
            className="mt-4 z-10 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-gray-800 overflow-hidden hover:border-sky-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* League Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                {leagueIcon ? (
                    <Image
                        src={leagueIcon}
                        alt={league.name || "League Icon"}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded object-cover"
                    />
                ) : (
                    <div className="h-6 w-6 rounded bg-gray-700" />
                )}
                <div className="flex-1 min-w-0">
                    <div className="truncate text-sm font-semibold text-white">
                        {league.name || "League"}
                    </div>
                </div>
                <time className="font-mono text-xs text-gray-400">
                    {matchDate}
                </time>
            </div>

            {/* Teams Section */}
            <div className="p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    {/* Team A */}
                    <div className="flex items-center gap-3">
                        {teamA?.image_url ? (
                            <Image
                                src={teamA.image_url}
                                alt={teamA.name || "Team"}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded object-cover bg-gray-800"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                                ?
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="font-semibold text-white truncate">
                                {teamA?.acronym || "TBD"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                                {teamA?.name || "To Be Determined"}
                            </div>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30">
                            VS
                        </span>
                    </div>

                    {/* Team B */}
                    <div className="flex items-center gap-3 flex-row-reverse">
                        {teamB?.image_url ? (
                            <Image
                                src={teamB.image_url}
                                alt={teamB.name || "Team"}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded object-cover bg-gray-800"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                                ?
                            </div>
                        )}
                        <div className="min-w-0 flex-1 text-right">
                            <div className="font-semibold text-white truncate">
                                {teamB?.acronym || "TBD"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                                {teamB?.name || "To Be Determined"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded Player Rosters - Shows on Hover */}
                <div
                    className={`grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-800 transition-all duration-300 ${
                        isHovered ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                >
                    {/* Team A Players */}
                    <div>
                        <h4 className="text-xs font-semibold text-sky-400 mb-3 uppercase tracking-wide">
                            {teamA?.acronym || "Team A"} Roster
                        </h4>
                        <PlayerList players={teamA?.players} />
                    </div>

                    {/* Team B Players */}
                    <div>
                        <h4 className="text-xs font-semibold text-sky-400 mb-3 uppercase tracking-wide">
                            {teamB?.acronym || "Team B"} Roster
                        </h4>
                        <PlayerList players={teamB?.players} />
                    </div>
                </div>
            </div>
        </div>
    );
}
