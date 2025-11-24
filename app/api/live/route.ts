import { NextResponse } from "next/server";
import type { Match } from "../../lib/types";

export async function GET() {
    try {
        const res = await fetch("https://api.pandascore.co/lol/matches/running", {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.PANDA_KEY}`,
            },
            cache: "no-store", // Don't cache live data
        });

        if (!res.ok) {
            throw new Error(`PandaScore API error: ${res.status}`);
        }

        const matchesData = await res.json();

        // Extract all unique team IDs
        const teamIds = new Set<number>()
        matchesData.forEach((match: any) => {
            match.opponents?.forEach((opp: any) => {
                if (opp.opponent?.id) {
                    teamIds.add(opp.opponent.id)
                }
            })
        })

        // Fetch players for each team
        const teamPlayersMap = new Map<number, any[]>()

        await Promise.all(
            Array.from(teamIds).map(async (teamId) => {
                try {
                    // Fetch players directly for the team
                    const playersRes = await fetch(`https://api.pandascore.co/lol/players?filter[team_id]=${teamId}&per_page=20`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.PANDA_KEY}`
                        },
                        cache: "no-store", // Don't cache for live matches
                    })

                    if (playersRes.ok) {
                        const players = await playersRes.json()
                        teamPlayersMap.set(teamId, players || [])
                    } else {
                        teamPlayersMap.set(teamId, [])
                    }
                } catch (error) {
                    console.error(`Live - Error fetching players for team ${teamId}:`, error)
                    teamPlayersMap.set(teamId, [])
                }
            })
        )

        // Map matches with player data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const matches: Match[] = matchesData.map((m: any) => ({
            name: m.name,
            id: m.id,
            scheduled_at: m.scheduled_at,
            begin_at: m.begin_at,
            opponents: m.opponents?.map((opp: any) => {
                const teamId = opp.opponent?.id
                const players = teamPlayersMap.get(teamId) || []

                return {
                    opponent: {
                        id: opp.opponent?.id,
                        name: opp.opponent?.name,
                        location: opp.opponent?.location,
                        acronym: opp.opponent?.acronym,
                        image_url: opp.opponent?.image_url,
                        players: players.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            first_name: p.first_name,
                            last_name: p.last_name,
                            image_url: p.image_url,
                            role: p.role,
                        })),
                    }
                }
            }) || [],
            league: m.league,
        }));

        return NextResponse.json(matches);
    } catch (error) {
        console.error("Error fetching live matches:", error);
        return NextResponse.json(
            { error: "Failed to fetch live matches" },
            { status: 500 }
        );
    }
}
