export async function processWithPool(items, concurrency, processor) {
  const results = [];
  const running = new Set();
  let firstError = null;

  async function runTask(item) {
    const promise = processor(item);
    running.add(promise);

    try {
      const result = await promise;
      results.push(result);
      return result;
    } catch (error) {
      // Store the first error to reject with later
      if (!firstError) {
        firstError = error;
      }
      // Re-throw to ensure promise is rejected
      throw error;
    } finally {
      running.delete(promise);
    }
  }

  async function spawnTasks() {
    for (const item of items) {
      // Don't start new tasks if an error has occurred
      if (firstError) {
        break;
      }

      if (running.size >= concurrency) {
        try {
          // Wait for at least one task to complete before spawning more
          await Promise.race(running);
        } catch {
          // Error caught here, but handled in runTask
          // Just continue to process remaining tasks
        }
      }

      // Don't await here, just spawn the task
      runTask(item).catch(() => {
        // Errors are already handled in runTask
        // This catch is just to prevent "unhandled rejection" warnings
      });
    }

    try {
      // Wait for all remaining tasks to complete
      if (running.size > 0) {
        await Promise.all(running);
      }
    } catch {
      // Error caught here, but firstError is already stored in runTask
    }
  }

  await spawnTasks();

  // If an error occurred, reject with it
  if (firstError) {
    throw firstError;
  }

  return results;
}
