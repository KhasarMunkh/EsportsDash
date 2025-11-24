"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import { UserCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch data');
    }
    return res.json();
};

interface Player {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    slug: string;
    image_url: string;
    role: string;
    hometown: string;
    current_team: {
        id: number;
        name: string;
        acronym: string;
        image_url: string;
    } | null;
}

function LoadingSkeleton() {
    return (
        <div className="rounded-lg bg-gray-900/90 border border-gray-800 overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-gray-800" />
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-800 rounded w-1/2" />
                        <div className="h-4 bg-gray-800 rounded w-1/3" />
                        <div className="h-3 bg-gray-800 rounded w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerCard({ player }: { player: Player }) {
    return (
        <div className="rounded-lg bg-gray-900/90 backdrop-blur-sm border border-gray-800 overflow-hidden hover:border-sky-500/50 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center gap-4">
                    {player.image_url ? (
                        <Image
                            src={player.image_url}
                            alt={player.name}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-full object-cover bg-gray-800 border-2 border-gray-700"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 border-2 border-gray-700">
                            <UserCircleIcon className="h-12 w-12 text-gray-500" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-white mb-1 truncate">
                            {player.name}
                        </h3>
                        {player.first_name && player.last_name && (
                            <p className="text-gray-400 text-sm mb-1">
                                {player.first_name} {player.last_name}
                            </p>
                        )}
                        <div className="flex items-center gap-3 flex-wrap">
                            {player.role && (
                                <span className="text-xs px-2 py-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                    {player.role}
                                </span>
                            )}
                            {player.current_team && (
                                <div className="flex items-center gap-2">
                                    {player.current_team.image_url && (
                                        <Image
                                            src={player.current_team.image_url}
                                            alt={player.current_team.name}
                                            width={16}
                                            height={16}
                                            className="h-4 w-4 rounded"
                                        />
                                    )}
                                    <span className="text-xs text-gray-400">
                                        {player.current_team.acronym || player.current_team.name}
                                    </span>
                                </div>
                            )}
                            {player.hometown && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPinIcon className="h-3 w-3" />
                                    {player.hometown}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PlayersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Load initial 100 players
    const { data: initialPlayers, error } = useSWR<Player[]>("/api/players", fetcher);

    // Debounce search for API call (only if search has 2+ characters)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 800);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // API search (only triggers if search has 2+ characters)
    const shouldSearch = debouncedSearch.length >= 2;
    const searchUrl = shouldSearch ? `/api/players?search=${encodeURIComponent(debouncedSearch)}` : null;
    const { data: searchResults, isLoading: isSearching } = useSWR<Player[]>(searchUrl, fetcher);

    // Show searching indicator when debounce is active
    const isTyping = searchQuery !== debouncedSearch && searchQuery.length >= 2;

    // Instant client-side filtering of initial players
    const instantResults = useMemo(() => {
        if (!initialPlayers || !searchQuery) return initialPlayers;
        const query = searchQuery.toLowerCase();
        return initialPlayers.filter((player) =>
            player.name.toLowerCase().includes(query) ||
            player.first_name?.toLowerCase().includes(query) ||
            player.last_name?.toLowerCase().includes(query) ||
            player.current_team?.name.toLowerCase().includes(query)
        );
    }, [initialPlayers, searchQuery]);

    // Merge results: prioritize API search results if available, otherwise use instant results
    const filteredPlayers = useMemo(() => {
        if (shouldSearch && searchResults) {
            // Merge and deduplicate by ID
            const resultMap = new Map<number, Player>();

            // Add search results first (higher priority)
            searchResults.forEach(player => resultMap.set(player.id, player));

            // Add instant results that aren't already in search results
            instantResults?.forEach(player => {
                if (!resultMap.has(player.id)) {
                    resultMap.set(player.id, player);
                }
            });

            return Array.from(resultMap.values());
        }
        return instantResults;
    }, [shouldSearch, searchResults, instantResults]);

    return (
        <div className="relative min-h-screen p-4">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Players</h1>
                    <p className="text-gray-400 mb-6">
                        Browse players from top teams like Gen.G, T1, Team Liquid, and more
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search players by name or team..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-900/90 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50 transition-colors"
                            />
                            {(isTyping || isSearching) && searchQuery.length >= 2 && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        {searchQuery.length >= 2 && (
                            <p className="mt-2 text-xs text-gray-500">
                                Showing instant results. {isTyping || isSearching ? 'Searching all players...' : 'Search complete.'}
                            </p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="p-6 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
                        <div className="text-red-400 text-lg font-semibold mb-2">
                            Failed to Load Players
                        </div>
                        <p className="text-gray-400 text-sm">
                            Unable to fetch player data. Please try again later.
                        </p>
                    </div>
                )}

                {!initialPlayers && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </div>
                )}

                {filteredPlayers && filteredPlayers.length === 0 && (
                    <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 text-center">
                        <div className="text-gray-400 text-lg">
                            {searchQuery ? "No players found matching your search" : "No players found"}
                        </div>
                    </div>
                )}

                {filteredPlayers && Array.isArray(filteredPlayers) && filteredPlayers.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPlayers.map((player) => (
                            <PlayerCard key={player.id} player={player} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
