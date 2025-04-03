import React, {FC} from 'react';
import './styles.scss';

interface FooterData {
    namePage: string
}
const Footer: FC<FooterData> = ({namePage}) => {
    return (
        <footer className='data-block footer'>
            <div>Created by <a target="_blank" href='https://youtube.com/@laritovski' >Laritovski</a></div>
        </footer>
    );
};

export default Footer;
