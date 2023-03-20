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
                Now we will play snippets of all 37 contest songs.
                Swipe right if you liked the song and left if you didn't. Press Play!
            </div>
            <div
                className='btn_play'
                onClick={(e) => {
                    e.preventDefault()
                    play()
                }}>
                <span className="material-symbols-outlined">play_arrow</span>
            </div>
        </div>
    );
};

export default Start;