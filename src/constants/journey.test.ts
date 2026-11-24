import { expect, it } from 'vitest';
import { getJourneyPose } from './journey';

it('keeps twelve distinct elements in three groups before turning the same elements into petals', () => {
  const grouped = Array.from({ length: 12 }, (_, index) =>
    getJourneyPose(index, 1, 120),
  );
  expect(new Set(grouped.map(({ x, y }) => `${x},${y}`)).size).toBe(12);
  expect(
    new Set(grouped.map(({ backgroundColor }) => backgroundColor)).size,
  ).toBe(3);
  const petals = Array.from({ length: 12 }, (_, index) =>
    getJourneyPose(index, 2, 120),
  );
  expect(new Set(petals.map(({ rotation }) => rotation)).size).toBe(12);
  expect(
    petals.every(
      ({ height, width, backgroundColor }) =>
        height > width && backgroundColor === '#f00000',
    ),
  ).toBe(true);
});

it('scales the complete flower to fit a compact mobile artwork area', () => {
  for (let index = 0; index < 12; index++) {
    const petal = getJourneyPose(index, 2, 65);
    expect(Math.hypot(petal.x, petal.y) + petal.height / 2).toBeLessThan(65);
  }
});
