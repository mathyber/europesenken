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

    const setStartPositions = (element: HTMLElement, x: number, y: number, id: number) => {
        setDragElem(element);
        setDragElemPositions({id, x, y});
    }

    const setNewPosition = (clientX: number, pageX: number, pageY: number) => {
        if (dragElem) {
            checkPosition(clientX)
            dragElem.style.cursor = 'grabbing';
            dragElem.style.transform = `translate(${pageX - (dragElemPositions.x || 0)}px, ${pageY - (dragElemPositions.y || 0)}px)`
        }
    }

    const onMouseDown = (event: React.MouseEvent, id: number):boolean => {
        setStartPositions(event.target as HTMLElement, event.pageX, event.pageY, id)
        return false;
    }

    const onMouseMove = (event: React.MouseEvent):boolean => {
        setNewPosition(event.clientX, event.pageX, event.pageY)
        return false;
    }
    const onTouchMove = (event: React.TouchEvent) => {
        const coordinates = event.changedTouches[0];
        setNewPosition(coordinates.clientX, coordinates.pageX, coordinates.pageY)
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

            dragElem.style.transform = '';
            dragElem.style.cursor = 'grab';
            setDragElem(null);
            setElemLiked(null);
            setDragElemPositions({});
        }
    }

    const handleTouchEvent = (event: React.TouchEvent, id: number) => {
        const coordinates = event.changedTouches[0];
        setStartPositions(event.target as HTMLElement, coordinates.pageX, coordinates.pageY, id)
    };

    const classByElemLiked = ():string => {
        if (elemLiked) return 'b_like';
        else if (elemLiked === false) return 'b_dislike';
        else return ''
    }

    return (
        <div
            className={`swiper-block ${classByElemLiked()}`}
            id='swiper-block'
            onMouseUp={dragOff}
            onTouchEnd={dragOff}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
        >
            {
                allSongs.map((song, index) => {
                    return <Card
                        key={song.id}
                        onTouchStart={(e) => handleTouchEvent(e, song.id)}
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