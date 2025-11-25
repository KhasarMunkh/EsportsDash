import { NextResponse } from "next/server";

interface PandaScorePlayer {
    id: number
    name: string
    first_name?: string
    last_name?: string
    image_url?: string
    role?: string
    hometown?: string
    current_team?: {
        id: number
        name: string
        acronym?: string
        image_url?: string
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        // If searching, use PandaScore search endpoint
        if (search) {
            const apiUrl = `https://api.pandascore.co/lol/players?search[name]=${encodeURIComponent(search)}&per_page=50`;
            const res = await fetch(apiUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.PANDA_KEY}`,
                },
                next: { revalidate: 300 }, // Cache searches for 5 min
            });

            if (!res.ok) {
                throw new Error(`PandaScore API error: ${res.status}`);
            }

            const data = await res.json();
            return NextResponse.json(data);
        }

        // Hardcoded team IDs for popular teams
        const teamIds = [
            126061, // T1
            390,    // Team Liquid
            88,     // G2 Esports
            2883,   // Hanwha Life Esports
            318,    // JD Gaming
            1566,   // Bilibili Gaming
            129972, // Weibo Gaming
            126059, // Top Esports
            126058, // LNG Esports
            2882,   // Gen.G
            1097,   // Cloud9
            126,    // Fnatic
        ];

        // Fetch players from these teams
        const teamPlayerPromises = teamIds.map(async (teamId) => {
            try {
                const res = await fetch(
                    `https://api.pandascore.co/lol/players?filter[team_id]=${teamId}&per_page=10`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.PANDA_KEY}`,
                        },
                        next: { revalidate: 3600 }, // Cache for 1 hour
                    }
                );

                if (res.ok) {
                    return await res.json();
                }
                return [];
            } catch (error) {
                console.error(`Error fetching players for team ${teamId}:`, error);
                return [];
            }
        });

        const teamPlayersArrays = await Promise.all(teamPlayerPromises);

        // Flatten and deduplicate by player ID
        const playerMap = new Map<number, PandaScorePlayer>();
        teamPlayersArrays.flat().forEach((player) => {
            if (player.id) {
                playerMap.set(player.id, player);
            }
        });

        const popularPlayers = Array.from(playerMap.values());

        return NextResponse.json(popularPlayers);
    } catch (error) {
        console.error("Error fetching players:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch players"
        return NextResponse.json(
            { error: errorMessage, details: String(error) },
            { status: 500 }
        );
    }
}
