import React, {FC, useEffect, useState} from 'react';
import './styles.scss';
import {ISongWithAddParams} from "../../types/types";
import {screenElement} from "../../utils";
import {Simulate} from "react-dom/test-utils";
import wheel = Simulate.wheel;
import {APP_NAME} from "../../constants/appSettings";

interface ResultProps {
    songs: ISongWithAddParams[],
    volume: number
}

const Result: FC<ResultProps> = ({songs, volume}) => {
    const [playId, setPlayId] = useState<number | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const onClick = () => {
        const el = (document.getElementById('result') as HTMLElement).cloneNode(true);
        const element = document.body.appendChild(el) as HTMLElement;
        if (element) {
            element.style.width = '1411px';
            while (element.getBoundingClientRect().height < (element.getBoundingClientRect().width / 2)) {
                element.style.width = `${element.getBoundingClientRect().width - 100}px`;
            }
            let gaElems: HTMLCollectionOf<Element> = element.getElementsByClassName('gradient-animation');
            gaElems[0]?.classList.remove('gradient-animation')
            gaElems = element.getElementsByClassName('res-btn');
            gaElems[0]?.remove();
            const el = element.getElementsByClassName('label-txt')[0];
            el.textContent = 'I liked these songs of Eurovision 2023:';
            let e = document.createElement('div');
            e.textContent = APP_NAME + ' by @mathyber';
            e.style.fontSize = '10px'
            e.style.color = 'gray'
            element.appendChild(e)
        }
        screenElement(element);
    }
    const play = (id: number, audioFile: any) => {
        setPlayId(id);
        if (id === playId) {
            audio?.pause();
            setPlayId(null);
        } else if (audioFile) {
            audio?.pause();
            let newAudio = document.createElement('audio');
            newAudio.src = audioFile.toString();
            newAudio.volume = volume;
            setAudio(newAudio);
            newAudio.play();
        }
    }

    return (
        <div className='result' id='result'>
            <div className='label-txt'>
                {!songs.length ? 'You didn\'t like any of the Eurovision 2023 songs :(' : 'You liked:'}
            </div>
            <div className='result__songs'>
                {
                     songs.map(song => {
                        return <div
                            onClick={() => play(song.id, song.audio)}
                            className={`result__song ${playId === song.id ? 'gradient-animation' : ''}`}
                            style={{
                                background: `linear-gradient(153deg, ${song.color1}, ${song.color2})`
                            }}
                            key={song.id}
                        >
                            <div className='song-name'>{song.artist} - <b>{song.name}</b></div>
                            <div className='country'>{song.country}</div>
                        </div>
                    })
                }
            </div>
            {songs.length ? <div className='res-btn'>
                Share the results with your friends!
                <div>
                    <button className='btn gradient' onClick={onClick}>
                        download image file
                    </button>
                </div>
            </div> : null}
        </div>
    );
};

export default Result;