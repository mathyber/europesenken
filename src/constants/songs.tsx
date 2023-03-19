import {ISongData} from "../types/types";
import audio1 from '../audio/1.mp3';
import audio2 from '../audio/2.mp3';
import audio3 from '../audio/3.mp3';
export const songsArray: ISongData[] = [
    {
        id: 1,
        artist: 'Point Charlie & Oleg Sidorov',
        name: 'Playing With A Life',
        country: 'Russia',
        audio: audio1
    },
    {
        id: 2,
        artist: 'Oleg Sidorov',
        name: 'Never Die',
        country: 'Russia',
        audio: audio3
    },
    {
        id: 3,
        artist: 'Point Charlie',
        name: 'Vopreki',
        country: 'Russia',
        audio: audio2
    }
]