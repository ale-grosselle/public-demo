// oxlint-disable no-console
import { performance } from 'node:perf_hooks';
import { cpus } from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// Configuration
const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const TOTAL_REQUESTS = 10000;
const PARALLEL_REQUESTS = 100;
const BATCHES = TOTAL_REQUESTS / PARALLEL_REQUESTS;

// Store request URLs for second run
let requestUrls: string[] = [];

// Utility function for delays with async/await
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Type definitions
interface MemoryUsage {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
}

interface RequestResult {
  url: string;
  statusCode: number;
  responseTime: number;
  dataLength: number;
}

interface TestResults {
  results: PromiseSettledResult<RequestResult>[];
  memory: {
    initial: MemoryUsage;
    final: MemoryUsage;
  };
  cpu: {
    initial: number[];
    final: number[];
  };
  timing: {
    total: number;
    average: number;
  };
}

// Find Next.js server process
async function findNextServerProcess(): Promise<string> {
  const { stdout } = await execAsync(`lsof -t -iTCP:${PORT} -sTCP:LISTEN`);
  console.log(`stdout: ${stdout}`);
  const splitAndTrimmed = stdout.trim().split('\n');
  return splitAndTrimmed.at(-1) ?? '';
}

// Memory and CPU monitoring for Next.js server process
async function getMemoryUsage(): Promise<MemoryUsage> {
  const nextPid = await findNextServerProcess();

  // Get memory usage for the Next.js process
  const { stdout } = await execAsync(`ps -p ${nextPid} -o rss,vsz`);
  const lines = stdout.trim().split('\n');
  const [rss, vsz] = lines[1].trim().split(/\s+/).map(Number);
  return {
    rss: Math.round((rss / 1024) * 100) / 100, // MB (RSS is in KB)
    heapUsed: 0, // Not available from ps
    heapTotal: Math.round((vsz / 1024) * 100) / 100, // MB (VSZ is in KB)
    external: 0, // Not available from ps
  };
}

async function getCPUUsage(): Promise<number[]> {
  const nextPid = await findNextServerProcess();

  // Get CPU usage for the Next.js process
  const { stdout } = await execAsync(`ps -p ${nextPid} -o %cpu`);
  const lines = stdout.trim().split('\n');
  if (lines.length > 1) {
    const cpuPercent = Number.parseFloat(lines[1].trim());
    return [cpuPercent]; // Return as array for consistency
  }

  // Fallback to system-wide CPU info
  const cpuData = cpus();
  return cpuData.map((cpu) => {
    const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
    const idle = cpu.times.idle;
    return Math.round((1 - idle / total) * 100 * 100) / 100; // Percentage
  });
}

// HTTP request function using native fetch API
async function makeRequest(url: string): Promise<RequestResult> {
  const startTime = performance.now();

  const response = await fetch(url, {
    signal: AbortSignal.timeout(30000), // 30 second timeout
  });

  const data = await response.text();
  const endTime = performance.now();

  return {
    url,
    statusCode: response.status,
    responseTime: Math.round((endTime - startTime) * 100) / 100,
    dataLength: data.length,
  };
}

// Generate random URLs
function generateRandomUrls(count: number): string[] {
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomId = Math.floor(Math.random() * 10000) + 1;
    urls.push(`${BASE_URL}/ad-use-cache/${randomId}`);
  }
  return urls;
}

// Run batch of parallel requests
async function runBatch(
  urls: string[],
  batchNumber: number,
): Promise<PromiseSettledResult<RequestResult>[]> {
  console.log(`\nBatch ${batchNumber + 1}/${BATCHES}:`);
  const startTime = performance.now();

  try {
    // Execute all requests in parallel - Promise.allSettled handles all errors
    const requestPromises: Promise<RequestResult>[] = urls.map(makeRequest);
    const results = await Promise.allSettled(requestPromises);
    const endTime = performance.now();

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`  ✓ Completed: ${successful} successful, ${failed} failed`);
    console.log(
      `  ⏱️  Batch time: ${Math.round((endTime - startTime) * 100) / 100}ms`,
    );

    return results;
  } catch (error) {
    console.error(
      `  ❌ Batch ${batchNumber + 1} failed:`,
      (error as Error).message,
    );
    return [];
  }
}

// Main test function
async function runLoadTest(
  testName: string,
  urls: string[],
): Promise<TestResults> {
  console.log(`\n🚀 Starting ${testName}...`);
  console.log(
    `📊 Configuration: ${TOTAL_REQUESTS} total requests, ${PARALLEL_REQUESTS} parallel`,
  );

  // Initial memory/CPU measurements
  const initialMemory = await getMemoryUsage();
  const initialCPU = await getCPUUsage();

  console.log(`\n📈 Initial Memory Usage:`);
  console.log(`  RSS: ${initialMemory.rss} MB`);
  console.log(`  Heap Used: ${initialMemory.heapUsed} MB`);
  console.log(`  Heap Total: ${initialMemory.heapTotal} MB`);
  console.log(`  External: ${initialMemory.external} MB`);

  const overallStart = performance.now();
  let allResults: PromiseSettledResult<RequestResult>[] = [];

  // Run requests in batches
  for (let i = 0; i < BATCHES; i++) {
    const batchUrls = urls.slice(
      i * PARALLEL_REQUESTS,
      (i + 1) * PARALLEL_REQUESTS,
    );
    const batchResults = await runBatch(batchUrls, i);
    allResults.push(...batchResults);

    // Small delay between batches to see memory changes
    await delay(100);
  }

  const overallEnd = performance.now();

  // Final memory/CPU measurements
  const finalMemory = await getMemoryUsage();
  const finalCPU = await getCPUUsage();

  // Results summary
  const successful = allResults.filter((r) => r.status === 'fulfilled').length;
  const failed = allResults.filter((r) => r.status === 'rejected').length;

  console.log(`\n📊 ${testName} Results:`);
  console.log(`  ✅ Successful requests: ${successful}`);
  console.log(`  ❌ Failed requests: ${failed}`);
  console.log(
    `  ⏱️  Total time: ${Math.round((overallEnd - overallStart) * 100) / 100}ms`,
  );
  console.log(
    `  📈 Average time per request: ${Math.round(((overallEnd - overallStart) / TOTAL_REQUESTS) * 100) / 100}ms`,
  );

  console.log(`\n🧠 Memory Usage Comparison:`);
  console.log(
    `  RSS: ${initialMemory.rss} MB → ${finalMemory.rss} MB (${finalMemory.rss > initialMemory.rss ? '+' : ''}${Math.round((finalMemory.rss - initialMemory.rss) * 100) / 100} MB)`,
  );
  console.log(
    `  Heap Used: ${initialMemory.heapUsed} MB → ${finalMemory.heapUsed} MB (${finalMemory.heapUsed > initialMemory.heapUsed ? '+' : ''}${Math.round((finalMemory.heapUsed - initialMemory.heapUsed) * 100) / 100} MB)`,
  );
  console.log(
    `  Heap Total: ${initialMemory.heapTotal} MB → ${finalMemory.heapTotal} MB (${finalMemory.heapTotal > initialMemory.heapTotal ? '+' : ''}${Math.round((finalMemory.heapTotal - initialMemory.heapTotal) * 100) / 100} MB)`,
  );
  console.log(
    `  External: ${initialMemory.external} MB → ${finalMemory.external} MB (${finalMemory.external > initialMemory.external ? '+' : ''}${Math.round((finalMemory.external - initialMemory.external) * 100) / 100} MB)`,
  );

  return {
    results: allResults,
    memory: { initial: initialMemory, final: finalMemory },
    cpu: { initial: initialCPU, final: finalCPU },
    timing: {
      total: overallEnd - overallStart,
      average: (overallEnd - overallStart) / TOTAL_REQUESTS,
    },
  };
}

// Force garbage collection between runs (if --expose-gc flag is used)
function forceGarbageCollection(): void {
  if (globalThis.gc) {
    console.log('\n🧹 Running garbage collection...');
    globalThis.gc();
  } else {
    console.log(
      '\n💡 Tip: Run with --expose-gc flag to force garbage collection between tests',
    );
  }
}

// Main execution
async function main(): Promise<void> {
  console.log('🔧 Load Testing Tool for ad-use-cache endpoint');
  console.log('='.repeat(50));

  try {
    // Generate random URLs for first run
    requestUrls = generateRandomUrls(TOTAL_REQUESTS);
    console.log(
      `\n📝 Generated ${TOTAL_REQUESTS} random URLs (sample: $ {requestUrls[0]})`,
    );

    // First run
    const firstRun = await runLoadTest('First Run (Fresh URLs)', requestUrls);

    // Wait and force GC between runs
    console.log('\n⏳ Waiting 5 seconds before second run...');
    await delay(5000);
    forceGarbageCollection();

    // Second run with same URLs to test caching
    const secondRun = await runLoadTest(
      'Second Run (Same URLs - Testing Cache)',
      requestUrls,
    );

    console.log('\n🔍 Memory Analysis:');
    const memoryDiff1 =
      firstRun.memory.final.heapTotal - firstRun.memory.initial.heapTotal;
    const memoryDiff2 =
      secondRun.memory.final.heapTotal - secondRun.memory.initial.heapTotal;

    console.log(
      `  First run memory change: ${memoryDiff1 > 0 ? '+' : ''}${Math.round(memoryDiff1 * 100) / 100} MB`,
    );
    console.log(
      `  Second run memory change: ${memoryDiff2 > 0 ? '+' : ''}${Math.round(memoryDiff2 * 100) / 100} MB`,
    );

    if (memoryDiff2 > memoryDiff1 * 1.5) {
      console.log(
        '  ⚠️  Potential memory leak detected - second run used significantly more memory',
      );
    } else if (memoryDiff2 < memoryDiff1 * 0.5) {
      console.log('  ✅ Good caching behavior - second run used less memory');
    } else {
      console.log('  ℹ️  Memory usage appears consistent between runs');
    }

    // Performance comparison
    console.log('\n⚡ Performance Comparison:');
    console.log(
      `  First run average: ${Math.round(firstRun.timing.average * 100) / 100}ms per request`,
    );
    console.log(
      `  Second run average: ${Math.round(secondRun.timing.average * 100) / 100}ms per request`,
    );

    const speedImprovement =
      ((firstRun.timing.average - secondRun.timing.average) /
        firstRun.timing.average) *
      100;
    if (speedImprovement > 10) {
      console.log(
        `  ✅ Cache effectiveness: ${Math.round(speedImprovement * 100) / 100}% faster on second run`,
      );
    } else if (speedImprovement < -10) {
      console.log(
        `  ⚠️  Performance degradation: ${Math.round(Math.abs(speedImprovement) * 100) / 100}% slower on second run`,
      );
    } else {
      console.log(
        `  ℹ️  Similar performance: ${Math.round(speedImprovement * 100) / 100}% difference`,
      );
    }
  } catch (error) {
    console.error('❌ Test failed:', (error as Error).message);
    process.exit(1);
  }

  console.log('\n✅ Load test completed!');
}

// Handle process termination with improved async patterns
process.on('SIGINT', async () => {
  console.log('\n👋 Test interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('❌ Unhandled rejection:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

// Improved error handling for uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught exception:', error);
  process.exit(1);
});

// Run the test with top-level await
main();
