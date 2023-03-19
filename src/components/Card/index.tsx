import React, {FC} from 'react';
import './styles.scss';
import {ISongData} from "../../types/types";

interface CardProps {
    onMouseDown: (e: React.MouseEvent) => any,
    onTouchStart: (e: React.TouchEvent) => any,
    onPlay: () => void,
    song: ISongData,
    zIndex?: number,
    isPlay?: boolean
}

const stopPropagation = (e: any) => e.stopPropagation();

const stopPropagationProps = {
    onMouseDown: stopPropagation,
    onTouchStart: stopPropagation,
}

const Card: FC<CardProps> = ({onMouseDown, onTouchStart, song, zIndex, isPlay, onPlay}) => {
    return (
        <div
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className='card'
            style={{zIndex}}
        >
            <div {...stopPropagationProps}>
                {song.id}
            </div>
            <div
                {...stopPropagationProps}
                className='btn_play'
                onClick={(e) => {
                    e.preventDefault()
                    onPlay()
                }}>
                {isPlay ? 'PAUSE!' : 'PLAY!'}
            </div>
        </div>
    );
};

export default Card;