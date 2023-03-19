export function shuffleArray<T>(myArray: T[]): T[] {
    const shuffledArray = [...myArray];
    shuffledArray.sort(() => Math.random() - 0.5);
    return shuffledArray;
}