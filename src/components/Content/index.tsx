import React, {FC, useState} from 'react';
import { songsArray } from '../../constants/songs';
import SwiperBlock from '../SwiperBlock';
import './styles.scss';
import {INIT_VOLUME} from "../../constants/appSettings";

const Content: FC = () => {
    const [volume, setVolume] = useState<number>(INIT_VOLUME);

    return (
        <div className='content'>
            <SwiperBlock songs={songsArray} volume={volume}/>
        </div>
    );
};

export default Content;