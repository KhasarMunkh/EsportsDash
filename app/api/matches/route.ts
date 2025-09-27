import { NextResponse } from "next/server"
import type { Match } from "../../lib/types"

export async function GET(req: Request) {
    const res = await fetch("https://api.pandascore.co/lol/matches/upcoming", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.PANDA_KEY}`
        },
        next: { revalidate: 300 },
    })
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches: Match[] = data.map((m: any) => ({
        name: m.name,
        id: m.id,
        scheduled_at: m.scheduled_at,
        begin_at: m.begin_at,
        opponents: m.opponents,
        league: m.league,
    }))
    return NextResponse.json(matches)
}
