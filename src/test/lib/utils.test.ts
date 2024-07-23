import { describe, expect, test } from 'vitest'
import { generateRandomNumberArray } from '../../lib/utils'

describe('Utils', () => {
    test('test utility generateRandomNumberArray', () => {
        const dataCount = 1000;
        const maxNumberSize = 100;
        const randomNumberArray = generateRandomNumberArray(dataCount, maxNumberSize);
        expect(randomNumberArray).toHaveLength(dataCount);
        randomNumberArray.forEach(data => {
            expect(data).toBeGreaterThanOrEqual(0);
            expect(data).toBeLessThan(maxNumberSize);
        });
    })
})