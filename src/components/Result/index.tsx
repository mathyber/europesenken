import React, {FC} from 'react';
import './styles.scss';
import {ISongData} from "../../types/types";

interface ResultProps {
    songs: ISongData[]
}
const Result: FC<ResultProps> = ({songs}) => {
    return (
        <div className='result'>
            <div>
                You liked:
            </div>
            {
                songs.map(song => {
                    return <div key={song.id}>
                        {song.artist} - <b>{song.name}</b> ({song.country})
                    </div>
                })
            }
        </div>
    );
};

export default Result;