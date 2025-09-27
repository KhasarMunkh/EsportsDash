"use client"
import FilterBar from "../components/FilterBar";
import MatchCard from "../components/MatchCard";
import type { Match } from "../lib/types"
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Matches() {
    const { data, error } = useSWR<Match[]>(`/api/matches`, fetcher);
    console.log(data)
    if (error) return <div> FAILED.. </div>
    if (!data) return <div> LOADING.. </div>
    return (
        <div className="p-4 relative mx-auto max-w-2xl">
            <FilterBar />
            {data.map((data: Match) => (

                <MatchCard key={data.id} match={data} />
            ))}
        </div>
    )
}
