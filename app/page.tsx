import Link from "next/link";
import { BoltIcon, TrophyIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Hero() {
    return (
        <div className="relative min-h-screen">
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-20">
                <div className="max-w-4xl text-center">
                    <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">
                        Your Esports Hub for{" "}
                        <span className="text-sky-400">League of Legends</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                        Stay up to date with upcoming matches, tournaments, and player statistics.
                        Track your favorite teams and never miss a game.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/matches"
                            className="rounded-lg px-6 py-3 font-medium bg-sky-400 text-slate-900 hover:bg-sky-300 transition-colors"
                        >
                            View Matches
                        </Link>
                        <Link
                            href="/tournaments"
                            className="rounded-lg border px-6 py-3 font-medium border-gray-700 bg-gray-800 text-white hover:bg-gray-800/50 transition-colors"
                        >
                            Browse Tournaments
                        </Link>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                    <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-sky-500/50 transition-all">
                        <BoltIcon className="h-8 w-8 text-sky-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white mb-2">Live Matches</h3>
                        <p className="text-gray-400 text-sm">
                            Follow live esports matches with real-time updates and statistics
                        </p>
                    </div>
                    <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-sky-500/50 transition-all">
                        <TrophyIcon className="h-8 w-8 text-sky-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white mb-2">Tournaments</h3>
                        <p className="text-gray-400 text-sm">
                            Discover upcoming tournaments and track your favorite competitions
                        </p>
                    </div>
                    <div className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-sm hover:border-sky-500/50 transition-all">
                        <UserGroupIcon className="h-8 w-8 text-sky-400 mb-3" />
                        <h3 className="text-xl font-semibold text-white mb-2">Player Stats</h3>
                        <p className="text-gray-400 text-sm">
                            Explore detailed player profiles and performance statistics
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
