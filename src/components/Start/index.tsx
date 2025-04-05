import React, {FC} from 'react';
import './styles.scss';
import {useTelegram} from "../../TelegramContext";

interface StartProps {
    play: () => void
}

const Start: FC<StartProps> = ({play}) => {
    const {telegram, user, isTelegram} = useTelegram();

    const handleSendData = () => {
        const data = {
            message: `Привет от ${user?.first_name}!`,
            userId: user?.id || 'unknown',
        };
        telegram.sendData(JSON.stringify(data));
    };

    return (
        <div className='start'>
            {isTelegram && <button onClick={handleSendData}>TEST TG</button>}
            <div>
                Hello! Are you ready to rate the songs of Eurovision 2025?
                Now you will hear excerpts of all 37 contest
                songs in a random order. Swipe right if you
                like the song and left if you don't. Press Play to start!
            </div>
            <div>
                <button
                    className='btn_play'
                    onClick={(e) => {
                        e.preventDefault()
                        play()
                    }}>
                    <span className="material-symbols-outlined">play_arrow</span>
                </button>
            </div>

        </div>
    );
};

export default Start;