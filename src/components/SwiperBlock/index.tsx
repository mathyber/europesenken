import React, {FC, useEffect, useState} from 'react';
import './styles.scss';
import {ISongData} from "../../types/types";
import Card from "../Card";

interface SwiperBlockProps {
    songs: ISongData[]
}

interface positions {
    x?: number,
    y?: number,
    id?: number
}

const SwiperBlock: FC<SwiperBlockProps> = ({songs}) => {
    const [likedSongs, setLikedSongs] = useState<ISongData[]>([]);
    const [allSongs, setAllSongs] = useState<ISongData[]>(songs);
    const [dragElem, setDragElem] = useState<HTMLElement | null>(null)
    const [dragElemPositions, setDragElemPositions] = useState<positions>({})
    const [elemLiked, setElemLiked] = useState<boolean | null>(null)

    useEffect(() => {
        setAllSongs(songs);
    }, [songs]);
    const checkPosition = (clientX: number) => {
        const offsetWidth: number = (document.querySelector('#swiper-block') as HTMLElement).offsetWidth
        const centerX: number = offsetWidth / 2;
        const borderLeft: number = centerX - 100;
        const borderRight: number = centerX + 100;
        if (clientX < borderLeft) {
            setElemLiked(false);
            console.log('Song is not liked')
        } else if (clientX > borderRight) {
            setElemLiked(true)
            console.log('Song is liked')
        } else {
            setElemLiked(null)
            console.log('not change status')
        }
    };
    const onMouseDown = (event: React.MouseEvent, id: number):boolean => {
        setDragElem(event.target as HTMLElement)
        setDragElemPositions({id: id, x: event.pageX, y: event.pageY})
        return false;
    }

    const onMouseMove = (event: React.MouseEvent):boolean => {
        if (dragElem) {
            checkPosition(event.clientX)
            dragElem.style.position = 'absolute'
            dragElem.style.transform = `translate(${event.pageX - (dragElemPositions.x || 0)}px, ${event.pageY - (dragElemPositions.y || 0)}px)`
        }
        return false;
    }

    console.log(likedSongs)
    const dragOff = () => {
        if (dragElem) {
            if (elemLiked) {
                const likedSong: ISongData | any = allSongs.find(s => s.id === dragElemPositions.id)
                setLikedSongs(prevLiked => [...prevLiked, likedSong])
            }

            if (elemLiked !== null) {
                setAllSongs(prevAllSongs => prevAllSongs.filter(s => s.id !== dragElemPositions.id))
            }

            dragElem.style.position = 'relative';
            dragElem.style.transform = '';
            setDragElem(null);
            setDragElemPositions({});
        }
    }

    return (
        <div
            className='swiper-block'
            id='swiper-block'
            onMouseUp={dragOff}
            onMouseMove={onMouseMove}
        >
            {
                allSongs.map((song, index) => {
                    return <Card
                        key={song.id}
                        onMouseDown={(e) => onMouseDown(e, song.id)}
                        song={song}
                        zIndex={(allSongs.length || 0) - index}
                    />
                })
            }
        </div>
    );
};

export default SwiperBlock;