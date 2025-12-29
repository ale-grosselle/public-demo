// oxlint-disable no-console
import { spawn, exec, ChildProcess } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Performance testing script for ad system (Modern Node.js 18+ version)
 * Tests the same ad multiple times and monitors CPU/memory usage
 */

interface ProcessMemoryUsage {
  rss: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
}

interface SystemUsage {
  cpu: string;
  memory: string;
  processMemory: ProcessMemoryUsage;
}

interface MemoryDelta {
  rss: number;
  heapUsed: number;
}

interface TestResult {
  adId: number;
  runNumber: number;
  loadTime: number;
  contentSize?: number;
  beforeUsage: SystemUsage;
  afterUsage: SystemUsage;
  memoryDelta?: MemoryDelta;
  timestamp: string;
  error?: string;
}

interface TestSummary {
  totalAds: number;
  totalRuns: number;
  avgLoadTime: number;
  minLoadTime: number;
  maxLoadTime: number;
  avgContentSize: number;
  totalMemoryDelta: number;
  avgCpuUsage: number;
  globalMemoryUsage: {
    initialHeap: number;
    finalHeap: number;
    peakHeap: number;
    avgHeapPerAd: number;
  };
  testTimestamp: string;
}

interface PerformanceReport {
  summary: TestSummary;
  results: TestResult[];
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default class PerformanceMonitor {
  private results: TestResult[] = [];
  private serverProcess: ChildProcess | null = null;
  private readonly serverPort: number = 3001;
  private readonly serverUrl: string = `http://localhost:${this.serverPort}`;
  private initialMemory: ProcessMemoryUsage | null = null;

  // Get a random ad ID (1-100)
  getRandomAdId(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  async startServer(): Promise<void> {
      this.serverProcess = spawn(
          'npx',
          ['next', 'start', '--port', this.serverPort.toString()],
          {
              stdio: 'pipe',
          },
      );
  }

  // Stop the server
  stopServer(): void {
    if (this.serverProcess) {
      console.log('🛑 Stopping server...');
      this.serverProcess.kill('SIGTERM');

      // Force kill if needed
      setTimeout(() => {
        if (this.serverProcess && !this.serverProcess.killed) {
          this.serverProcess.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  // Get process-specific memory usage for the Node.js process
  private getProcessMemoryUsage(): ProcessMemoryUsage {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024), // Resident Set Size in MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // Heap used in MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // Total heap in MB
      external: Math.round(usage.external / 1024 / 1024), // External memory in MB
    };
  }

  // Get current system resource usage
  private async getSystemUsage(): Promise<SystemUsage> {
    return new Promise((resolve) => {
      // Get CPU usage using ps
      exec(`ps -o %cpu -p ${process.pid} | tail -1`, (error, stdout) => {
        let cpu = 'N/A';
        if (!error) {
          cpu = `${Number.parseFloat(stdout.trim()).toFixed(1)}%`;
        }

        // Get memory info using ps
        exec(`ps -o rss -p ${process.pid} | tail -1`, (memError, memStdout) => {
          let memory = 'N/A';
          if (!memError) {
            const rssKB = Number.parseInt(memStdout.trim());
            memory = `${Math.round(rssKB / 1024)}MB`;
          }

          const processMemory = this.getProcessMemoryUsage();

          resolve({
            cpu,
            memory,
            processMemory,
          });
        });
      });
    });
  }

  // Simulate loading an ad page (measure server-side rendering time)
  private async loadAd(adId: number, runNumber: number): Promise<TestResult> {
    const startTime = Date.now();
    const beforeUsage = await this.getSystemUsage();

    console.log(`📖 Loading ad ${adId} (Run #${runNumber})...`);

    try {
      // Use built-in fetch (Node 18+)
      const response = await fetch(`${this.serverUrl}/ad/${adId}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Performance-Test-Script/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const loadTime = Date.now() - startTime;

      // Wait a moment for system to process
      await new Promise((resolve) => setTimeout(resolve, 500));

      const afterUsage = await this.getSystemUsage();

      const result: TestResult = {
        adId,
        runNumber,
        loadTime,
        contentSize: html.length,
        beforeUsage,
        afterUsage,
        memoryDelta: {
          rss: afterUsage.processMemory.rss - beforeUsage.processMemory.rss,
          heapUsed:
            afterUsage.processMemory.heapUsed -
            beforeUsage.processMemory.heapUsed,
        },
        timestamp: new Date().toISOString(),
      };

      console.log(
        `   ✅ Loaded in ${loadTime}ms (${Math.round(html.length / 1024)}KB)`,
      );
      console.log(`   📊 CPU: ${beforeUsage.cpu} → ${afterUsage.cpu}`);
      console.log(
        `   💾 Memory: ${beforeUsage.memory} → ${afterUsage.memory} (RSS: ${beforeUsage.processMemory.rss}→${afterUsage.processMemory.rss}MB)`,
      );
      if (result.memoryDelta?.heapUsed) {
        console.log(
          `   🧠 Heap: ${beforeUsage.processMemory.heapUsed}MB → ${afterUsage.processMemory.heapUsed}MB (Δ${result.memoryDelta.heapUsed > 0 ? '+' : ''}${result.memoryDelta.heapUsed}MB)`,
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log(`   ❌ Failed to load ad: ${errorMessage}`);
      return {
        adId,
        runNumber,
        loadTime: -1,
        error: errorMessage,
        beforeUsage,
        afterUsage: beforeUsage,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Run the performance test
  async runTest(): Promise<void> {
    console.log('🔬 Starting Ad Performance Test\n');

    try {
      // Start the server
      await this.startServer();

      // Record initial memory usage
      this.initialMemory = this.getProcessMemoryUsage();
      console.log(`\n🚀 Starting test with initial heap: ${this.initialMemory.heapUsed}MB`);

      // Generate 10 unique ad IDs
      const adIds: number[] = [];
      while (adIds.length < 10) {
        const newId = this.getRandomAdId();
        if (!adIds.includes(newId)) {
          adIds.push(newId);
        }
      }

      console.log(`🎲 Testing ${adIds.length} different ad IDs: [${adIds.join(', ')}]`);
      console.log(`📊 Will test each ad once to measure global memory usage\n`);

      for (let i = 0; i < adIds.length; i++) {
        const adId = adIds[i];
        console.log(`--- Testing Ad ${adId} (${i + 1}/10) ---`);
        const result = await this.loadAd(adId, i + 1);
        this.results.push(result);

        // Wait between tests to allow memory stabilization
        if (i < adIds.length - 1) {
          console.log('⏸️  Waiting 2 seconds before next test...\n');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Generate report
      this.generateReport();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Test failed:', errorMessage);
    } finally {
      // Clean up
      this.stopServer();
    }
  }

  // Generate performance report
  private generateReport(): void {
    console.log('\n📋 GLOBAL PERFORMANCE REPORT');
    console.log('='.repeat(60));

    const validResults = this.results.filter((r) => r.loadTime > 0);

    if (validResults.length === 0) {
      console.log('❌ No valid results to analyze');
      return;
    }

    // Get final memory usage
    const finalMemory = this.getProcessMemoryUsage();
    const uniqueAdIds = [...new Set(validResults.map((r) => r.adId))];

    // Global memory analysis
    const allHeapUsages = validResults.map((r) => r.afterUsage.processMemory.heapUsed);
    const initialHeap = this.initialMemory?.heapUsed || 0;
    const finalHeap = finalMemory.heapUsed;
    const peakHeap = Math.max(...allHeapUsages);
    const avgHeapPerAd = allHeapUsages.reduce((a, b) => a + b, 0) / allHeapUsages.length;

    // Summary statistics
    const loadTimes = validResults.map((r) => r.loadTime);
    const contentSizes = validResults.map((r) => r.contentSize || 0);
    const memoryDeltas = validResults.map((r) => r.memoryDelta?.heapUsed || 0);

    // Extract CPU usage (remove % sign and convert to number)
    const cpuUsages = validResults.map((r) => {
      const afterCpu = r.afterUsage.cpu.replace('%', '');
      return afterCpu === 'N/A' ? 0 : Number.parseFloat(afterCpu);
    }).filter(cpu => cpu > 0); // Filter out invalid readings

    const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
    const minLoadTime = Math.min(...loadTimes);
    const maxLoadTime = Math.max(...loadTimes);
    const avgContentSize =
      contentSizes.reduce((a, b) => a + b, 0) / contentSizes.length;
    const totalMemoryDelta = memoryDeltas.reduce((a, b) => a + b, 0);
    const avgCpuUsage = cpuUsages.length > 0 ?
      cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length : 0;

    console.log(`📊 Global Test Results:`);
    console.log(`   Total unique ads tested: ${uniqueAdIds.length}`);
    console.log(`   Successful runs: ${validResults.length}/${this.results.length}`);
    console.log(`   Average load time: ${Math.round(avgLoadTime)}ms`);
    console.log(`   Min load time: ${minLoadTime}ms`);
    console.log(`   Max load time: ${maxLoadTime}ms`);
    console.log(`   Average CPU usage: ${avgCpuUsage.toFixed(1)}%`);
    console.log(
      `   Average content size: ${Math.round(avgContentSize / 1024)}KB`,
    );
    console.log(
      `   Total memory delta: ${totalMemoryDelta > 0 ? '+' : ''}${totalMemoryDelta}MB`,
    );
    console.log('\n🧠 GLOBAL MEMORY USAGE ANALYSIS:');
    console.log(`   Initial heap: ${initialHeap}MB`);
    console.log(`   Final heap: ${finalHeap}MB`);
    console.log(`   Peak heap: ${peakHeap}MB`);
    console.log(`   Average heap per ad: ${Math.round(avgHeapPerAd)}MB`);
    console.log(`   Total heap growth: ${finalHeap - initialHeap > 0 ? '+' : ''}${finalHeap - initialHeap}MB`);
    console.log(`   Peak heap increase: ${peakHeap - initialHeap > 0 ? '+' : ''}${peakHeap - initialHeap}MB from baseline`);


    if (peakHeap - initialHeap > 50) {
      console.log(
        `   ⚠️  High peak memory usage (${peakHeap - initialHeap}MB above baseline)`,
      );
    } else {
      console.log(
        `   ✅ Reasonable peak memory usage (${peakHeap - initialHeap}MB above baseline)`,
      );
    }

    // Save results to file
    const reportFile = `performance-report-${Date.now()}.json`;
    const report: PerformanceReport = {
      summary: {
        totalAds: uniqueAdIds.length,
        totalRuns: validResults.length,
        avgLoadTime: Math.round(avgLoadTime),
        minLoadTime,
        maxLoadTime,
        avgContentSize: Math.round(avgContentSize),
        totalMemoryDelta,
        avgCpuUsage: Number.parseFloat(avgCpuUsage.toFixed(1)),
        globalMemoryUsage: {
          initialHeap,
          finalHeap,
          peakHeap,
          avgHeapPerAd,
        },
        testTimestamp: new Date().toISOString(),
      },
      results: this.results,
    };

    writeFileSync(reportFile, JSON.stringify(report, null, 2));

    console.log(`\n💾 Results saved to: ${reportFile}`);
    console.log('\n✅ Performance test completed!');
  }
}

(async () => {
  const monitor = new PerformanceMonitor();
  await monitor.runTest();
})();
