
import axios from 'axios';
import { performance } from 'perf_hooks';

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const ITERATIONS = 10;

const ENDPOINTS = [
    { name: 'Get Songs', method: 'GET', url: '/songs' },
    { name: 'Get Users', method: 'GET', url: '/users' },
    { name: 'Get Stats', method: 'GET', url: '/stats' },
    { name: 'Get Random Songs', method: 'GET', url: '/songs/random' }
];

interface BenchmarkResult {
    name: string;
    avg: number;
    min: number;
    max: number;
    p95: number;
    success: number;
    failed: number;
}

async function runBenchmark() {
    console.log(`🚀 Starting API Benchmark on ${BASE_URL}`);
    console.log(`iterations: ${ITERATIONS}\n`);

    const results: BenchmarkResult[] = [];

    for (const endpoint of ENDPOINTS) {
        console.log(`Testing ${endpoint.name}...`);
        const durations: number[] = [];
        let success = 0;
        let failed = 0;

        for (let i = 0; i < ITERATIONS; i++) {
            const start = performance.now();
            try {
                await axios({
                    method: endpoint.method,
                    url: `${BASE_URL}${endpoint.url}`,
                    validateStatus: () => true, // Don't throw on error status
                    headers: {
                        'x-test-mode': 'true',
                        'x-test-user-id': 'benchmark-user',
                        'x-test-role': 'admin'
                    }
                });
                const duration = performance.now() - start;
                durations.push(duration);
                success++;
            } catch (error) {
                failed++;
                console.error(`Error requesting ${endpoint.url}:`, error.message);
            }
        }

        if (durations.length > 0) {
            durations.sort((a, b) => a - b);
            const sum = durations.reduce((a, b) => a + b, 0);
            const avg = sum / durations.length;
            const min = durations[0];
            const max = durations[durations.length - 1];
            const p95Index = Math.floor(durations.length * 0.95);
            const p95 = durations[p95Index];

            results.push({ name: endpoint.name, avg, min, max, p95, success, failed });
        }
    }

    console.log('\n📊 Benchmark Results:\n');
    console.table(results.map(r => ({
        Endpoint: r.name,
        'Avg (ms)': r.avg.toFixed(2),
        'P95 (ms)': r.p95.toFixed(2),
        'Min (ms)': r.min.toFixed(2),
        'Max (ms)': r.max.toFixed(2),
        'Success': `${r.success}/${ITERATIONS}`
    })));
}

runBenchmark();
