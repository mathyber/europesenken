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