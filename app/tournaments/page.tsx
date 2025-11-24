"use client";

import useSWR from "swr";
import Image from "next/image";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to fetch data');
    }
    return res.json();
};

interface Tournament {
    id: number;
    name: string;
    slug: string;
    begin_at: string;
    end_at: string;
    league: {
        id: number;
        name: string;
        image_url: string;
    };
    serie: {
        name: string;
        full_name: string;
    };
}

function LoadingSkeleton() {
    return (
        <div className="rounded-lg bg-gray-900/90 border border-gray-800 overflow-hidden animate-pulse">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded bg-gray-800" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-800 rounded w-3/4" />
                        <div className="h-4 bg-gray-800 rounded w-1/2" />
                        <div className="h-3 bg-gray-800 rounded w-1/3" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
    const startDate = tournament.begin_at
        ? new Date(tournament.begin_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "TBD";

    const endDate = tournament.end_at
        ? new Date(tournament.end_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "TBD";

    return (
        <div className="rounded-lg bg-gray-900/90 backdrop-blur-sm border border-gray-800 overflow-hidden hover:border-sky-500/50 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {tournament.league?.image_url ? (
                        <Image
                            src={tournament.league.image_url}
                            alt={tournament.league.name}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded object-cover bg-gray-800"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                            🏆
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-white mb-1 truncate">
                            {tournament.name}
                        </h3>
                        <p className="text-sky-400 text-sm mb-2">
                            {tournament.league?.name || "League"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-mono">{startDate}</span>
                            <span>→</span>
                            <span className="font-mono">{endDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TournamentsPage() {
    const { data, error } = useSWR<Tournament[]>("/api/tournaments", fetcher);

    return (
        <div className="relative min-h-screen p-4">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Tournaments</h1>
                    <p className="text-gray-400">
                        Browse upcoming and ongoing League of Legends tournaments
                    </p>
                </div>

                {error && (
                    <div className="p-6 rounded-lg bg-red-900/20 border border-red-500/30 text-center">
                        <div className="text-red-400 text-lg font-semibold mb-2">
                            Failed to Load Tournaments
                        </div>
                        <p className="text-gray-400 text-sm">
                            Unable to fetch tournament data. Please try again later.
                        </p>
                    </div>
                )}

                {!data && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </div>
                )}

                {data && data.length === 0 && (
                    <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 text-center">
                        <div className="text-gray-400 text-lg">No tournaments found</div>
                    </div>
                )}

                {data && Array.isArray(data) && data.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.map((tournament) => (
                            <TournamentCard key={tournament.id} tournament={tournament} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
