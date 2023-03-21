import React, {FC} from 'react';
import './styles.scss';

interface StartProps {
    play: () => void
}

const Start: FC<StartProps> = ({play}) => {
    return (
        <div className='start'>
            <div>
                Hello! Are you ready to rate the songs of Eurovision 2023?
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