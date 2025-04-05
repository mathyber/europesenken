import html2canvas from "html2canvas";
import {APP_NAME} from "./constants/appSettings";

export function shuffleArray<T>(myArray: T[]): T[] {
    const shuffledArray = [...myArray];
    shuffledArray.sort(() => Math.random() - 0.5);
    return shuffledArray;
}

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

interface RGBColor {
    r: number;
    g: number;
    b: number;
}

export function getRandomContrastColor(): string {
    const minValue = 0;
    const maxValue = 255;
    const white = { r: 255, g: 255, b: 255 };
    let r, g, b;

    do {
        r = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
        g = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
        b = Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
    } while (getDistance(white, { r, g, b }) < 100);

    return `rgb(${r}, ${g}, ${b})`;
}

function getDistance(color1: RGBColor, color2: RGBColor): number {
    const rMean = (color1.r + color2.r) / 2;
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    return Math.sqrt(
        ((2 + rMean / 256) * rDiff * rDiff) +
        (4 * gDiff * gDiff) +
        ((2 + (255 - rMean) / 256) * bDiff * bDiff)
    ) || 0;
}

export const screenElement = (block: HTMLElement) => {
    setTimeout(() => {
        html2canvas(block, { scale: 2 }).then(canvas => {
            canvas.toBlob(blob => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = `${APP_NAME}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    URL.revokeObjectURL(url);
                }
                block.remove();
            }, 'image/png');
        }).catch(error => console.error(error));
    }, 100);
}