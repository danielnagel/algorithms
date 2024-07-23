/**
 * Generates an array of random numbers.
 * 
 * @param count of random numbers.
 * @param maxNumberSize size of random numbers in the array, from 0 to maxNumberSize -1.
 * @returns an array of random numbers.
 */
export const generateRandomNumberArray = (count: number, maxNumberSize: number): number[] => {
    const randomNumbers: number[] = [];
    for (let i = 0; i < count; i++) {
        const randomNumber = Math.floor(Math.random() * maxNumberSize);
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
};