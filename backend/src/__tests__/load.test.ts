/**
 * Load Testing Script
 * Simulate 1000+ concurrent users for performance testing
 */

import { performance } from 'perf_hooks';

interface LoadTestConfig {
    baseUrl: string;
    totalRequests: number;
    concurrentUsers: number;
    endpoints: string[];
}

interface LoadTestResults {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    duration: number;
}

async function makeRequest(url: string): Promise<{ success: boolean; time: number }> {
    const start = performance.now();

    try {
        const response = await fetch(url);
        const time = performance.now() - start;

        return {
            success: response.ok,
            time,
        };
    } catch (error) {
        return {
            success: false,
            time: performance.now() - start,
        };
    }
}

async function loadTest(config: LoadTestConfig): Promise<LoadTestResults> {
    const { baseUrl, totalRequests, concurrentUsers, endpoints } = config;

    console.log(`\n🚀 Starting load test...`);
    console.log(`   Total requests: ${totalRequests}`);
    console.log(`   Concurrent users: ${concurrentUsers}`);
    console.log(`   Endpoints: ${endpoints.length}\n`);

    const results: { success: boolean; time: number }[] = [];
    const startTime = performance.now();

    // Create batches of concurrent requests
    const requestsPerBatch = concurrentUsers;
    const numBatches = Math.ceil(totalRequests / requestsPerBatch);

    for (let batch = 0; batch < numBatches; batch++) {
        const batchPromises: Promise<{ success: boolean; time: number }>[] = [];

        // Create concurrent requests
        for (let i = 0; i < requestsPerBatch && batch * requestsPerBatch + i < totalRequests; i++) {
            const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
            const url = `${baseUrl}${endpoint}`;
            batchPromises.push(makeRequest(url));
        }

        // Wait for batch to complete
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Progress indicator
        const progress = Math.round(((batch + 1) / numBatches) * 100);
        process.stdout.write(`\r   Progress: ${progress}% (${results.length}/${totalRequests} requests)`);
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // Convert to seconds

    // Calculate statistics
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = results.length - successfulRequests;
    const responseTimes = results.map(r => r.time);

    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const minResponseTime = Math.min(...responseTimes);
    const maxResponseTime = Math.max(...responseTimes);
    const requestsPerSecond = results.length / duration;

    console.log(`\n\n✅ Load test complete!\n`);

    return {
        totalRequests: results.length,
        successfulRequests,
        failedRequests,
        averageResponseTime,
        minResponseTime,
        maxResponseTime,
        requestsPerSecond,
        duration,
    };
}

function printResults(results: LoadTestResults): void {
    console.log(`📊 Results:`);
    console.log(`   Total requests:      ${results.totalRequests}`);
    console.log(`   Successful:          ${results.successfulRequests} (${Math.round((results.successfulRequests / results.totalRequests) * 100)}%)`);
    console.log(`   Failed:              ${results.failedRequests}`);
    console.log(`   Duration:            ${results.duration.toFixed(2)}s`);
    console.log(`   Requests/second:     ${results.requestsPerSecond.toFixed(2)}`);
    console.log(`\n⏱️  Response Times:`);
    console.log(`   Average:             ${results.averageResponseTime.toFixed(2)}ms`);
    console.log(`   Min:                 ${results.minResponseTime.toFixed(2)}ms`);
    console.log(`   Max:                 ${results.maxResponseTime.toFixed(2)}ms`);

    // Performance assessment
    console.log(`\n🎯 Performance Assessment:`);
    if (results.averageResponseTime < 100) {
        console.log(`   ✅ Excellent! Average response < 100ms`);
    } else if (results.averageResponseTime < 500) {
        console.log(`   ✅ Good! Average response < 500ms`);
    } else {
        console.log(`   ⚠️  Needs optimization. Average response > 500ms`);
    }

    if (results.successfulRequests / results.totalRequests > 0.99) {
        console.log(`   ✅ Excellent reliability (>99% success rate)`);
    } else if (results.successfulRequests / results.totalRequests > 0.95) {
        console.log(`   ✅ Good reliability (>95% success rate)`);
    } else {
        console.log(`   ⚠️  Poor reliability (<95% success rate)`);
    }
}

// Run load test
const config: LoadTestConfig = {
    baseUrl: 'http://localhost:5001/api',
    totalRequests: 1000,
    concurrentUsers: 50,
    endpoints: [
        '/songs/featured',
        '/songs/trending',
        '/songs/new-releases',
        '/health',
    ],
};

loadTest(config).then(printResults).catch(console.error);

export { loadTest, LoadTestConfig, LoadTestResults };
