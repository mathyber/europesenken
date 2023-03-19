import React, {FC} from 'react';
import { songsArray } from '../../constants/songs';
import SwiperBlock from '../SwiperBlock';
import './styles.scss';

const Content: FC = () => {
    return (
        <div className='content'>
            <SwiperBlock songs={songsArray}/>
        </div>
    );
};

export default Content;