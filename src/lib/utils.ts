/**
 * Generates an array of random numbers.
 * 
 * @param count of random numbers.
 * @param maxNumberSize size of random numbers in the array, from 1 to maxNumberSize -1.
 * @returns an array of random numbers.
 */
export const generateRandomNumberArray = (count: number, maxNumberSize: number): number[] => {
	const randomNumbers: number[] = [];
	for (let i = 0; i < count; i++) {
		const randomNumber = Math.floor(Math.random() * maxNumberSize);
		randomNumbers.push(!randomNumber ? 1 : randomNumber);
	}
	return randomNumbers;
};

/**
 * Generates a range from start to stop, with a default step size of 1.
 * 
 * @param start beginning of the range
 * @param stop end of the range
 * @param step size, default is 1
 * @returns an array containing all numbers in the range, including start and stop.
 */
export const range = (start: number, stop: number, step = 1) =>
	Array.from(
	  {
			length: Math.ceil((stop + 1 - start) / step) 
		},
	  (_, i) => start + i * step,
	);

/**
 * Checks if an array is sorted.
 * 
 * @param arr number array to be checked
 * @returns true when sorted, false otherwise.
 */
export const isSorted = (arr: number[]) => arr.every((v, i, a) => !i || a[i-1] <= v);