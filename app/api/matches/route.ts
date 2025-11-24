import { NextResponse } from "next/server"
import type { Match } from "../../lib/types"

interface PandaScorePlayer {
    id: number
    name: string
    first_name: string
    last_name: string
    image_url: string
    role: string
}

interface PandaScoreOpponent {
    opponent?: {
        id: number
        name: string
        location: string
        acronym: string
        image_url: string
    }
}

interface PandaScoreMatch {
    name: string
    id: number
    scheduled_at: string
    begin_at: string
    opponents?: PandaScoreOpponent[]
    league: {
        id: number
        name: string
        image_url: string
        slug?: string
    }
}

export async function GET() {
    try {
        const res = await fetch("https://api.pandascore.co/lol/matches/upcoming", {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.PANDA_KEY}`
            },
            next: { revalidate: 300 },
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch matches: ${res.status}`)
        }

        const matchesData = await res.json() as PandaScoreMatch[]

        // Extract all unique team IDs
        const teamIds = new Set<number>()
        matchesData.forEach((match) => {
            match.opponents?.forEach((opp) => {
                if (opp.opponent?.id) {
                    teamIds.add(opp.opponent.id)
                }
            })
        })

        // Fetch players for each team
        const teamPlayersMap = new Map<number, PandaScorePlayer[]>()

        await Promise.all(
            Array.from(teamIds).map(async (teamId) => {
                try {
                    // Try fetching players directly for the team
                    const playersRes = await fetch(`https://api.pandascore.co/lol/players?filter[team_id]=${teamId}&per_page=20`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.PANDA_KEY}`
                        },
                        next: { revalidate: 3600 }, // Cache player data for 1 hour
                    })

                    if (playersRes.ok) {
                        const players = await playersRes.json() as PandaScorePlayer[]
                        teamPlayersMap.set(teamId, players || [])
                    } else {
                        teamPlayersMap.set(teamId, [])
                    }
                } catch (error) {
                    console.error(`Error fetching players for team ${teamId}:`, error)
                    teamPlayersMap.set(teamId, [])
                }
            })
        )

        // Map matches with player data
        const matches: Match[] = matchesData.map((m) => ({
            name: m.name,
            id: m.id,
            scheduled_at: m.scheduled_at,
            begin_at: m.begin_at,
            opponents: m.opponents?.map((opp) => {
                const teamId = opp.opponent?.id || 0
                const players = teamPlayersMap.get(teamId) || []

                return {
                    opponent: {
                        id: opp.opponent?.id || 0,
                        name: opp.opponent?.name || '',
                        location: opp.opponent?.location || '',
                        acronym: opp.opponent?.acronym || '',
                        image_url: opp.opponent?.image_url || '',
                        players: players.map((p) => ({
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
            league: {
                ...m.league,
                slug: m.league.slug || '',
            },
        }))

        return NextResponse.json(matches)
    } catch (error) {
        console.error("Error in matches API:", error)
        return NextResponse.json(
            { error: "Failed to fetch matches" },
            { status: 500 }
        )
    }
}
