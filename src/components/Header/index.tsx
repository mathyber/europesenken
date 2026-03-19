import React, {FC} from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

interface HeaderData {
    namePage: string
}

const Header: FC<HeaderData> = ({namePage}) => {
    return (
        <header className='data-block header gradient'>
            <Link to="/" className="header__link header__link_home">{namePage}</Link>
            <Link to="/scoreboard" className="header__link">
                <span className="material-symbols-outlined">leaderboard</span>
                <span className="header__link-text">Scoreboard</span>
            </Link>
        </header>
    );
};

export default Header;
