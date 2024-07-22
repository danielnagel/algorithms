// sum.test.js
import { expect, test } from 'vitest'
import { BubbleSort } from '../../../lib/scritps/bubblesort'


test('return data', () => {
  const bubblesort = new BubbleSort([2, 5, 1, 3, 4]);
  expect(bubblesort.getData()).toStrictEqual([2, 5, 1, 3, 4]);
})