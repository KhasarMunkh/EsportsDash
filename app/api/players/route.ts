import { NextResponse } from "next/server";

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

        // Known popular team IDs (hardcoded to avoid wrong teams like T1.A)
        const knownTeamIds = [
            2882,   // Gen.G
            1097,   // Cloud9
            126,    // Fnatic (from earlier logs, had 1 player)
        ];

        // Common terms that indicate non-main rosters
        const excludeTerms = ['academy', 'challenger', 'challengers', 'junior', 'first', 'second', '.a', '.b', 'youth'];

        // Teams to search for (to get current IDs)
        const teamsToSearch = [
            { name: 'T1', exactMatch: true },
            { name: 'Team Liquid', exactMatch: false },
            { name: 'G2 Esports', exactMatch: true },
            { name: 'Hanwha Life Esports', exactMatch: false },
            { name: 'JD Gaming', exactMatch: false },
            { name: 'Bilibili Gaming', exactMatch: false },
            { name: 'Weibo Gaming', exactMatch: false },
            { name: 'Top Esports', exactMatch: false },
            { name: 'LNG Esports', exactMatch: false },
        ];

        // Search for team IDs
        const searchedIdPromises = teamsToSearch.map(async ({ name, exactMatch }) => {
            try {
                const res = await fetch(
                    `https://api.pandascore.co/lol/teams?search[name]=${encodeURIComponent(name)}&per_page=10`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.PANDA_KEY}`,
                        },
                        next: { revalidate: 86400 }, // Cache for 24 hours
                    }
                );

                if (res.ok) {
                    const teams = await res.json();

                    // Filter out academy/challenger/junior teams
                    const mainTeams = teams.filter((team: any) => {
                        const teamName = team.name?.toLowerCase() || '';
                        // Exclude teams with any of the excluded terms
                        return !excludeTerms.some(term => teamName.includes(term));
                    });

                    let selectedTeam = null;

                    if (exactMatch) {
                        // For exact match, find the team with the exact name
                        selectedTeam = mainTeams.find((team: any) =>
                            team.name?.toLowerCase() === name.toLowerCase()
                        );
                    } else {
                        // For non-exact, prefer shorter names (main rosters usually have shorter names)
                        selectedTeam = mainTeams.sort((a: any, b: any) =>
                            (a.name?.length || 999) - (b.name?.length || 999)
                        )[0];
                    }

                    if (!selectedTeam && mainTeams.length > 0) {
                        selectedTeam = mainTeams[0];
                    }

                    if (selectedTeam) {
                        console.log(`Found team "${name}": ID ${selectedTeam.id} (${selectedTeam.name})`);
                        return selectedTeam.id;
                    }
                }
                console.log(`Could not find team "${name}"`);
                return null;
            } catch (error) {
                console.error(`Error searching for team ${name}:`, error);
                return null;
            }
        });

        const searchedIds = (await Promise.all(searchedIdPromises)).filter((id): id is number => id !== null);
        const teamIds = [...new Set([...knownTeamIds, ...searchedIds])];

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
                    const players = await res.json();
                    console.log(`Team ${teamId}: ${players.length} players`);
                    return players;
                }
                console.log(`Team ${teamId}: failed with status ${res.status}`);
                return [];
            } catch (error) {
                console.error(`Error fetching players for team ${teamId}:`, error);
                return [];
            }
        });

        const teamPlayersArrays = await Promise.all(teamPlayerPromises);

        // Flatten and deduplicate by player ID
        const playerMap = new Map();
        teamPlayersArrays.flat().forEach((player: any) => {
            if (player.id) {
                playerMap.set(player.id, player);
            }
        });

        const popularPlayers = Array.from(playerMap.values());

        console.log(`Fetched ${popularPlayers.length} popular players from ${teamIds.length} teams`);

        return NextResponse.json(popularPlayers);
    } catch (error) {
        console.error("Error fetching players:", error);
        return NextResponse.json(
            { error: "Failed to fetch players" },
            { status: 500 }
        );
    }
}
