import { describe, it, expect, vi } from 'vitest';
import { processWithPool } from '../../../lib/-private/process-with-pool.js';

describe('processWithPool', () => {
  it('processes all items', async () => {
    const items = [1, 2, 3, 4, 5];
    const processor = vi.fn(async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Simulate async work
      return item * 2;
    });

    const results = await processWithPool(items, 2, processor);

    expect(processor).toHaveBeenCalledTimes(5);
    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  it('respects concurrency limit', async () => {
    const items = [1, 2, 3, 4, 5];
    let running = 0;
    let maxRunning = 0;

    async function processor(item) {
      running++;
      maxRunning = Math.max(maxRunning, running);

      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, 10));

      running--;
      return item;
    }

    await processWithPool(items, 3, processor);

    expect(maxRunning).toBeLessThanOrEqual(3);
  });

  it('handles empty array', async () => {
    const processor = vi.fn(async (item) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return item;
    });

    const results = await processWithPool([], 5, processor);

    expect(processor).not.toHaveBeenCalled();
    expect(results).toEqual([]);
  });

  it('handles errors properly', async () => {
    const items = [1, 2, 3, 4, 5];

    async function processor(item) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (item === 3) {
        throw new Error('Test error');
      }
      return item;
    }

    await expect(processWithPool(items, 2, processor)).rejects.toThrow('Test error');
  });

  it('handles large number of items efficiently', async () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    async function processor(item) {
      await new Promise((resolve) => setTimeout(resolve, 1)); // Simulate async work
      return item;
    }

    const results = await processWithPool(items, 10, processor);

    expect(results.length).toBe(100);
    expect(results.sort((a, b) => a - b)).toEqual(items);
  });
});
