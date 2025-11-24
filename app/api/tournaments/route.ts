import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://api.pandascore.co/lol/tournaments/running", {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${process.env.PANDA_KEY}`,
            },
            next: { revalidate: 600 },
        });

        if (!res.ok) {
            throw new Error(`PandaScore API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching tournaments:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch tournaments"
        return NextResponse.json(
            { error: errorMessage, details: String(error) },
            { status: 500 }
        );
    }
}
