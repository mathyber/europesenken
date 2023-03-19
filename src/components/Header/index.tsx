import React, {FC} from 'react';

interface HeaderData {
    namePage: string
}
const Header: FC<HeaderData> = ({namePage}) => {
    return (
        <div>
            {namePage}
        </div>
    );
};

export default Header;