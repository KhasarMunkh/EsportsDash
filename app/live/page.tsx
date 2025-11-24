"use client";

import React from "react";
import useSWR from "swr";
import Image from "next/image";
import type { Match } from "../lib/types";
import { TvIcon } from "@heroicons/react/24/outline";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function LoadingSkeleton() {
    return (
        <div className="rounded-lg bg-gray-900/90 border border-gray-800 overflow-hidden animate-pulse">
            <div className="flex items-center gap-3 px-4 py-3 bg-red-900/20 border-b border-red-500/30">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-4 w-20 bg-gray-800/50 rounded" />
            </div>
            <div className="p-6">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded bg-gray-800" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 bg-gray-800 rounded w-20" />
                            <div className="h-3 bg-gray-800 rounded w-32" />
                        </div>
                    </div>
                    <div className="h-8 w-16 bg-gray-800 rounded" />
                    <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="h-16 w-16 rounded bg-gray-800" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 bg-gray-800 rounded w-20 ml-auto" />
                            <div className="h-3 bg-gray-800 rounded w-32 ml-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerList({ players }: { players?: { id: number; name: string; image_url: string; role: string }[] }) {
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

function LiveMatchCard({ match }: { match: Match }) {
    const { league, opponents } = match;
    const teamA = opponents?.[0]?.opponent;
    const teamB = opponents?.[1]?.opponent;
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            className="rounded-lg bg-gray-900/90 backdrop-blur-sm border border-red-500/50 overflow-hidden animate-pulse-subtle hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Live indicator */}
            <div className="flex items-center gap-3 px-4 py-2 bg-red-900/20 border-b border-red-500/30">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 text-sm font-semibold">LIVE NOW</span>
                </div>
                {league?.name && (
                    <>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm">{league.name}</span>
                    </>
                )}
            </div>

            {/* Match content */}
            <div className="p-6">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                    {/* Team A */}
                    <div className="flex items-center gap-4">
                        {teamA?.image_url ? (
                            <Image
                                src={teamA.image_url}
                                alt={teamA.name || "Team"}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded object-cover bg-gray-800"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                                ?
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <div className="text-2xl font-bold text-white truncate">
                                {teamA?.acronym || "TBD"}
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                                {teamA?.name || "To Be Determined"}
                            </div>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="flex flex-col items-center justify-center gap-2">
                        <span className="px-4 py-2 rounded-lg bg-red-900/20 text-red-400 text-sm font-bold border border-red-500/30">
                            LIVE
                        </span>
                    </div>

                    {/* Team B */}
                    <div className="flex items-center gap-4 flex-row-reverse">
                        {teamB?.image_url ? (
                            <Image
                                src={teamB.image_url}
                                alt={teamB.name || "Team"}
                                width={64}
                                height={64}
                                className="h-16 w-16 rounded object-cover bg-gray-800"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                                ?
                            </div>
                        )}
                        <div className="min-w-0 flex-1 text-right">
                            <div className="text-2xl font-bold text-white truncate">
                                {teamB?.acronym || "TBD"}
                            </div>
                            <div className="text-sm text-gray-400 truncate">
                                {teamB?.name || "To Be Determined"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded Player Rosters - Shows on Hover */}
                <div
                    className={`grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-red-500/30 transition-all duration-300 ${
                        isHovered ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                >
                    {/* Team A Players */}
                    <div>
                        <h4 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wide">
                            {teamA?.acronym || "Team A"} Roster
                        </h4>
                        <PlayerList players={teamA?.players} />
                    </div>

                    {/* Team B Players */}
                    <div>
                        <h4 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wide">
                            {teamB?.acronym || "Team B"} Roster
                        </h4>
                        <PlayerList players={teamB?.players} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LivePage() {
    const { data, error } = useSWR<Match[]>("/api/live", fetcher, {
        refreshInterval: 30000, // Refresh every 30 seconds
    });

    return (
        <div className="relative min-h-screen p-4">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white">Live Matches</h1>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-500/30">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-400 text-sm font-semibold">LIVE</span>
                        </div>
                    </div>
                    <p className="text-gray-400">
                        Watch ongoing League of Legends matches in real-time
                    </p>
                </div>

                {error && (
                    <div className="p-6 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
                        <div className="text-red-400 text-lg font-semibold mb-2">
                            Failed to Load Live Matches
                        </div>
                        <p className="text-gray-400 text-sm">
                            Unable to fetch live match data. Please try again later.
                        </p>
                    </div>
                )}

                {!data && !error && (
                    <div className="space-y-4">
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </div>
                )}

                {data && data.length === 0 && (
                    <div className="p-12 rounded-lg bg-gray-900/90 border border-gray-800 text-center">
                        <div className="flex justify-center mb-4">
                            <TvIcon className="h-16 w-16 text-gray-500" />
                        </div>
                        <div className="text-gray-400 text-xl mb-2">No Live Matches</div>
                        <p className="text-gray-500 text-sm">
                            There are no matches currently in progress. Check back soon!
                        </p>
                    </div>
                )}

                {data && data.length > 0 && (
                    <div className="space-y-6">
                        {data.map((match) => (
                            <LiveMatchCard key={match.id} match={match} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
