export interface Reading {
  date: Date;
  value: number;
  lower: number;
  upper: number;
}

export interface Summary {
  latest: Reading;
  average: number;
  minimum: number;
  maximum: number;
  volatility: number;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function createReadings(days: number, seed = Date.now()): Reading[] {
  const random = createRandom(seed);
  const start = startOfDay(new Date(Date.now() - (days - 1) * DAY_IN_MS));
  let trend = 54;

  return Array.from({ length: days }, (_, index) => {
    const wave = Math.sin(index / 9) * 11 + Math.sin(index / 23) * 6;
    trend += (random() - 0.52) * 8;
    trend = trend * 0.88 + 54 * 0.12;
    const value = clamp(trend + wave + (random() - 0.5) * 15, 8, 96);
    const spread = 8 + random() * 8;

    return {
      date: new Date(start.getTime() + index * DAY_IN_MS),
      value: round(value),
      lower: round(Math.max(0, value - spread * (0.85 + random() * 0.35))),
      upper: round(Math.min(100, value + spread * (0.7 + random() * 0.45))),
    };
  });
}

export function summarize(readings: Reading[]): Summary {
  if (readings.length === 0) throw new Error('Cannot summarize an empty reading set');

  const values = readings.map(({ value }) => value);
  const average = values.reduce((total, value) => total + value, 0) / values.length;
  const variance = values.reduce((total, value) => total + (value - average) ** 2, 0) / values.length;

  return {
    latest: readings.at(-1)!,
    average: round(average),
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    volatility: round(Math.sqrt(variance)),
  };
}

function createRandom(seed: number): () => number {
  let state = Math.abs(Math.trunc(seed)) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
