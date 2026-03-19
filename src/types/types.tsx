export interface ISongData {
    id: number,
    country: string,
    artist: string,
    name: string,
    audio?: object
}

export interface ISongWithAddParams extends ISongData {
    color1: string,
    color2: string,
    number: number
}

export interface ScoreboardEntry {
    song_id: number;
    likes_count: number;
    percentage: number;
}

export interface ScoreboardRow extends ISongData {
    likes_count: number;
    percentage: number;
}