"use client"
import FilterBar from "../components/FilterBar";
import MatchCard from "../components/MatchCard";
import type { Match } from "../lib/types"
import useSWR from "swr";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function LoadingSkeleton() {
    return (
        <div className="mt-4 rounded-lg bg-gray-900/90 border border-gray-800 overflow-hidden animate-pulse">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <div className="h-6 w-6 rounded bg-gray-700" />
                <div className="flex-1 h-4 bg-gray-700 rounded w-32" />
                <div className="h-3 w-24 bg-gray-700 rounded" />
            </div>
            <div className="p-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-gray-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-800 rounded w-16" />
                            <div className="h-3 bg-gray-800 rounded w-24" />
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-gray-800 w-12 h-6" />
                    <div className="flex items-center gap-3 flex-row-reverse">
                        <div className="h-10 w-10 rounded bg-gray-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-800 rounded w-16 ml-auto" />
                            <div className="h-3 bg-gray-800 rounded w-24 ml-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ErrorState({ error }: { error: Error }) {
    return (
        <div className="mt-8 p-6 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
            <div className="text-red-400 text-lg font-semibold mb-2">
                Failed to Load Matches
            </div>
            <p className="text-gray-400 text-sm">
                {error.message || "Unable to fetch match data. Please try again later."}
            </p>
        </div>
    );
}

function MatchesContent() {
    const { data, error } = useSWR<Match[]>(`/api/matches`, fetcher);
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setSearchQuery(q);
        }
    }, [searchParams]);

    const filteredMatches = useMemo(() => {
        if (!data) return null;
        if (!searchQuery) return data;

        const query = searchQuery.toLowerCase();
        return data.filter((match) => {
            const teamA = match.opponents?.[0]?.opponent?.name?.toLowerCase() || "";
            const teamB = match.opponents?.[1]?.opponent?.name?.toLowerCase() || "";
            const leagueName = match.league?.name?.toLowerCase() || "";
            return teamA.includes(query) || teamB.includes(query) || leagueName.includes(query);
        });
    }, [data, searchQuery]);

    return (
        <div className="p-4 relative mx-auto max-w-4xl min-h-screen">
            <FilterBar onSearchChange={setSearchQuery} />
            <div className="mt-6">
                {error && <ErrorState error={error} />}
                {!data && !error && (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                )}
                {filteredMatches && filteredMatches.length === 0 && (
                    <div className="mt-8 p-6 rounded-lg bg-gray-900/50 border border-gray-800 text-center">
                        <div className="text-gray-400 text-lg">
                            {searchQuery
                                ? "No matches found matching your search"
                                : "No upcoming matches found"}
                        </div>
                    </div>
                )}
                {filteredMatches && filteredMatches.map((match: Match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </div>
    );
}

export default function Matches() {
    return (
        <Suspense fallback={
            <div className="p-4 relative mx-auto max-w-4xl min-h-screen">
                <div className="mt-6">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                </div>
            </div>
        }>
            <MatchesContent />
        </Suspense>
    );
}
