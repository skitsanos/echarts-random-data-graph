import { describe, expect, it } from 'bun:test';
import { createReadings, summarize } from './data';

describe('sensor data', () => {
  it('creates deterministic readings for a supplied seed', () => {
    const first = createReadings(12, 42);
    const second = createReadings(12, 42);

    expect(first).toEqual(second);
    expect(first).toHaveLength(12);
    expect(first.every(({ lower, value, upper }) => lower <= value && value <= upper)).toBe(true);
  });

  it('summarizes a reading window', () => {
    const readings = createReadings(20, 7);
    const summary = summarize(readings);

    expect(summary.latest).toEqual(readings.at(-1)!);
    expect(summary.minimum).toBeLessThanOrEqual(summary.average);
    expect(summary.average).toBeLessThanOrEqual(summary.maximum);
    expect(summary.volatility).toBeGreaterThan(0);
  });
});
