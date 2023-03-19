import React, {FC} from 'react';

interface FooterData {
    namePage: string
}
const Footer: FC<FooterData> = ({namePage}) => {
    return (
        <div>
            {namePage}
        </div>
    );
};

export default Footer;