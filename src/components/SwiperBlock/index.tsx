import React, {FC, useEffect, useState} from 'react';
import './styles.scss';
import {ISongData, ISongWithAddParams} from "../../types/types";
import Card from "../Card";
import Result from "../Result";
import {getRandomContrastColor, shuffleArray} from "../../utils";
import {debounce} from 'lodash';
import Start from "../Start";

interface SwiperBlockProps {
    songs: ISongData[],
    volume: number
}

interface positions {
    x?: number,
    y?: number,
    id?: number
}

const SwiperBlock: FC<SwiperBlockProps> = ({songs, volume}) => {
    const [likedSongs, setLikedSongs] = useState<ISongWithAddParams[]>([]);
    const [allSongs, setAllSongs] = useState<ISongWithAddParams[]>([]);
    const [dragElem, setDragElem] = useState<HTMLElement | null>(null)
    const [dragElemPositions, setDragElemPositions] = useState<positions>({})
    const [elemLiked, setElemLiked] = useState<boolean | null>(null)
    const [globalPlay, setGlobalPlay] = useState<boolean>(false);
    const [play, setPlay] = useState<boolean>(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

    useEffect(() => {
        audio?.pause();
        let newAudio: HTMLAudioElement | null = null;
        if (allSongs[0]?.audio) {
            newAudio = document.createElement('audio');
            newAudio.src = allSongs[0].audio?.toString();
            newAudio.volume = volume;
        }

        setAudio(newAudio);
    }, [allSongs, volume]);

    useEffect(() => {
        play ? audio?.play() : audio?.pause();
    }, [audio, play])

    useEffect(() => {
        setAllSongs(shuffleArray(songs).map((s, index) => ({
            ...s,
            color1: getRandomContrastColor(),
            color2: getRandomContrastColor(),
            number: index + 1
        })));
    }, [songs]);

    const checkPosition = (clientX: number) => {
        const offsetWidth: number = (document.querySelector('#swiper-block') as HTMLElement).offsetWidth
        const centerX: number = offsetWidth / 2;
        const borderLeft: number = centerX - 100;
        const borderRight: number = centerX + 100;
        if (clientX < borderLeft) {
            setElemLiked(false);
        } else if (clientX > borderRight) {
            setElemLiked(true)
        } else {
            setElemLiked(null)
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

    const onMouseDown = (event: React.MouseEvent, id: number): boolean => {
        setStartPositions(event.target as HTMLElement, event.pageX, event.pageY, id)
        return false;
    }

    const onMouseMove = (event: React.MouseEvent): boolean => {
        setNewPosition(event.clientX, event.pageX, event.pageY)
        return false;
    }
    const onTouchMove = (event: React.TouchEvent) => {
        const coordinates = event.changedTouches[0];
        setNewPosition(coordinates.clientX, coordinates.pageX, coordinates.pageY)
    }

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

    const classByElemLiked = (): string => {
        if (elemLiked) return 'b_like';
        else if (elemLiked === false) return 'b_dislike';
        else return ''
    }

    const setClassInBody = () => {
        // @ts-ignore
        document.querySelector('body').className = classByElemLiked()
    }

    const setClassInBodyDebounce = debounce(setClassInBody, 100);

    useEffect(() => {
        setClassInBodyDebounce();
    }, [elemLiked])

    useEffect(() => {
        globalPlay && setPlay(true);
    }, [globalPlay]);

    return (
        <div
            className={`swiper-block`}
            id='swiper-block'
            onMouseUp={dragOff}
            onTouchEnd={dragOff}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
        >
            {
                (!allSongs.length && play)
                    ? <Result songs={likedSongs} volume={volume}/>
                    : (
                        !globalPlay
                            ? <Start play={() => setGlobalPlay(true)}/>
                            : <div className='cards'>
                                {
                                    allSongs.slice(0, 2).map((song, index) => {
                                        return <Card
                                            key={song.id}
                                            onTouchStart={(e) => handleTouchEvent(e, song.id)}
                                            onMouseDown={(e) => onMouseDown(e, song.id)}
                                            song={song}
                                            isPlay={play}
                                            onPlay={() => setPlay(prev => !prev)}
                                            zIndex={(allSongs.length || 0) - index}
                                        />
                                    })
                                }
                            </div>
                    )
            }
        </div>
    );
};

export default SwiperBlock;