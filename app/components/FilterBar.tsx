"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

interface FilterBarProps {
    onGameChange?: (game: string) => void;
    onSearchChange?: (search: string) => void;
}

export default function FilterBar({ onGameChange, onSearchChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-end gap-4 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-gray-800 p-4">
            <div className="flex-1 min-w-[200px]">
                <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-2">
                    Game
                </label>
                <div className="relative grid grid-cols-1">
                    <select
                        id="game"
                        name="game"
                        onChange={(e) => onGameChange?.(e.target.value)}
                        className="col-start-1 row-start-1 w-full
                                appearance-none rounded-md bg-gray-800/50
                                py-2 pr-10 pl-3 text-base text-white
                                border border-gray-700
                                focus:outline-none focus:border-sky-500/50
                                transition-colors sm:text-sm"
                    >
                        <option value="lol">League of Legends</option>
                        <option value="valorant" disabled>
                            Valorant (Coming Soon)
                        </option>
                        <option value="cs2" disabled>
                            CS2 (Coming Soon)
                        </option>
                    </select>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1
                                    mr-3 size-5
                                    self-center justify-self-end
                                    text-gray-400"
                    />
                </div>
            </div>

            {/* Search input */}
            <div className="flex-1 min-w-[300px]">
                <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                    Search Teams
                </label>
                <div className="relative">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search by team name..."
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-md
                                bg-gray-800/50 border border-gray-700
                                text-white placeholder-gray-500
                                focus:outline-none focus:border-sky-500/50
                                transition-colors text-sm"
                    />
                    <MagnifyingGlassIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
}
