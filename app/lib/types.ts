
export interface Match {
    Name: string,
    Id: number,
    Date: string,
    BeginAt: string,
    Opponents: OpponentEntry[],
    League: League,
}

export interface League {
    Id: number,
    Name: string,
    ImageURL: string,
}

export interface OpponentEntry {
    Opponent: Team,
}

export interface Team {
    Id: number,
    Name: string,
    Location: string,
    Acronym: string,
    ImageURL: string,
}
