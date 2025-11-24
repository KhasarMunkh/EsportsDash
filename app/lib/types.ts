
export interface RawOpponentEntry {
    opponent: {
        id: number
        name: string
        location: string
        acronym: string
        image_url: string
    }
}


export interface Match {
    name: string,
    id: number,
    scheduled_at: string,
    begin_at: string,
    opponents: OpponentEntry[],
    league: League,
}

export interface League {
    id: number,
    name: string,
    image_url: string,
    slug: string
}

export interface OpponentEntry {
    opponent: Team,
}

export interface Player {
    id: number,
    name: string,
    first_name: string,
    last_name: string,
    image_url: string,
    role: string,
    active?: boolean,
    age?: number,
    birthday?: string,
    slug?: string,
}

export interface Team {
    id: number,
    name: string,
    location: string,
    acronym: string,
    image_url: string,
    players?: Player[],
}
