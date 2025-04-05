import React, {FC, useState} from 'react';
import './styles.scss';
import {ISongWithAddParams} from "../../types/types";
import {screenElement} from "../../utils";
import {APP_NAME} from "../../constants/appSettings";
import {useTelegram} from "../../TelegramContext";

interface ResultProps {
    songs: ISongWithAddParams[],
    volume: number
}

const Result: FC<ResultProps> = ({songs, volume}) => {
    const [playId, setPlayId] = useState<number | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const createImg = () => {
        const resultEl = document.getElementById('result');
        const el = (resultEl as HTMLElement).cloneNode(true);
        const element = document.body.appendChild(document.createElement('div')) as HTMLElement;
        element.appendChild(el);
        element?.classList.add('style-export')

        if (element) {
            element.style.width = '5644px';
            if (element.getBoundingClientRect().height < element.getBoundingClientRect().width) {
                if (songs.length < 5) element.style.height = `${1300 + (100 * songs.length)}px`;

                while ((element.getBoundingClientRect().height + 150) < element.getBoundingClientRect().width) {
                    element.style.width = `${element.getBoundingClientRect().width - 1}px`
                }
                if (songs.length > 7) while ((element.getBoundingClientRect().height + 550) > element.getBoundingClientRect().width) {
                    element.style.width = `${element.getBoundingClientRect().width + 1}px`
                }
            }

            let gaElems: HTMLCollectionOf<Element> = element.getElementsByClassName('gradient-animation');
            gaElems[0]?.classList.remove('gradient-animation')
            gaElems = element.getElementsByClassName('res-btn');
            gaElems[0]?.remove();
            const el = element.getElementsByClassName('label-txt')[0];
            el.textContent = 'I liked these songs of Eurovision 2025:';
            let e = document.createElement('div');
            e.textContent = APP_NAME + ' by Laritovski';
            e.style.fontSize = '40px'
            e.style.color = 'gray'
            let l = document.createElement('div');
            l.textContent = 'laritovski.ru/europesenken';
            e.appendChild(l)

            element.children[0].appendChild(e)

            element.style.display = 'flex'
            element.style.flexDirection = 'column'
            element.style.justifyContent = 'center'

            //To hide the element from the screen
            element.style.left = '-5555px'
            element.style.position = 'absolute'
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

    const {telegram, user, isTelegram} = useTelegram();

    const handleSendData = () => {
        const data = {
            songs,
            userId: user?.id || 'unknown',
        };
        telegram.sendData(JSON.stringify(data));
    };

    return (
        <div className='result' id='result'>
            <div className='label-txt'>
                {!songs.length ? 'You didn\'t like any of the Eurovision 2025 songs :(' : 'You liked:'}
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
                    {
                        !isTelegram
                            ? <button className='btn gradient' onClick={createImg}>
                                download image file
                            </button>
                            : <button className='btn gradient' onClick={handleSendData}>
                                Telegram
                            </button>
                    }
                </div>
            </div> : null}
        </div>
    );
};

export default Result;