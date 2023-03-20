import React, {FC} from 'react';
import './styles.scss';

interface HeaderData {
    namePage: string
}
const Header: FC<HeaderData> = ({namePage}) => {
    return (
        <header className='data-block header gradient'>
            <div>{namePage}</div>
        </header>
    );
};

export default Header;