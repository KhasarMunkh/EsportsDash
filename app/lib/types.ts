
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
    date: string,
    beginAt: string,
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

export interface Team {
    id: number,
    name: string,
    location: string,
    acronym: string,
    imageURL: string,
}
