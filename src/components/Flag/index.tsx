import React, {FC} from 'react';

interface FlagProps {
    emoji: string;
    size?: number;
}

function toTwemojiUrl(emoji: string): string {
    const codePoints = [...emoji]
        .map(c => c.codePointAt(0)!.toString(16))
        .join('-');
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoints}.svg`;
}

const Flag: FC<FlagProps> = ({emoji, size = 14}) => (
    <img
        src={toTwemojiUrl(emoji)}
        alt={emoji}
        width={size}
        height={size}
        style={{display: 'inline-block', verticalAlign: 'middle'}}
    />
);

export default Flag;
