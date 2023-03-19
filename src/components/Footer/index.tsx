import React, {FC} from 'react';
import './styles.scss';

interface FooterData {
    namePage: string
}
const Footer: FC<FooterData> = ({namePage}) => {
    return (
        <footer className='data-block'>
            {namePage} / @mathyber
        </footer>
    );
};

export default Footer;