import React, {FC} from 'react';
import './styles.scss';
import {ISongData} from "../../types/types";

interface CardProps {
    onMouseDown: (e: React.MouseEvent) => any,
    onTouchStart: (e: React.TouchEvent) => any,
    song: ISongData,
    zIndex?: number
}
const Card: FC<CardProps> = ({onMouseDown, onTouchStart, song, zIndex}) => {
    return (
        <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className='card'
            style={{zIndex}}
        >
            <div>{song.id}</div>
            <div>{song.country}</div>
            <div>{song.artist}</div>
            <div>{song.name}</div>
        </div>
    );
};

export default Card;