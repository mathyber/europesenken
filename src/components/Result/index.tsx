import React, {FC} from 'react';
import './styles.scss';
import {ISongWithAddParams} from "../../types/types";

interface ResultProps {
    songs: ISongWithAddParams[]
}

const Result: FC<ResultProps> = ({songs}) => {
    return (
        <div className='result'>
            <div>
                You liked:
            </div>
            <div className='result__songs'>
                {
                    songs.map(song => {
                        return <div
                            className='result__song'
                            style={{
                                background: `linear-gradient(153deg, ${song.color1}, ${song.color2})`
                            }}
                            key={song.id}
                        >
                            <div>Song No.{song.number}</div>
                            <div>{song.artist} - <b>{song.name}</b></div>
                            <div>{song.country}</div>
                        </div>
                    })
                }
            </div>
            <div>
                Share the results with your friends!
            </div>
        </div>
    );
};

export default Result;