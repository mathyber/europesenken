import React, {FC} from 'react';
import './styles.scss';

interface FooterData {
    namePage: string
}
const Footer: FC<FooterData> = ({namePage}) => {
    return (
        <footer className='data-block footer'>
            <div>Created by <a href='https://github.com/mathyber'>@mathyber</a></div>
            <a href='https://github.com/mathyber/pesenken'>Project on GitHub</a>
        </footer>
    );
};

export default Footer;