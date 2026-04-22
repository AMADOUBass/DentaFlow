/**
 * Utility to measure and log execution time of server actions.
 */
export async function withPerformanceLog<T>(
  name: string,
  action: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await action()
    const end = performance.now()
    const duration = (end - start).toFixed(2)
    
    // Log in console (and could be sent to a DB/Analytics)
    console.log(`[PERF] ${name} executed in ${duration}ms`)
    
    // If it's too slow (> 1s), add a warning
    if (parseFloat(duration) > 1000) {
      console.warn(`[PERF ALERT] ${name} is slow: ${duration}ms`)
    }
    
    return result
  } catch (error) {
    const end = performance.now()
    console.error(`[PERF ERROR] ${name} failed after ${(end - start).toFixed(2)}ms`)
    throw error
  }
}
