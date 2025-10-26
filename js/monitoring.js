// Performance Monitoring

const PerformanceMonitor = {
    metrics: {},

    // Start measuring
    startMeasure(name) {
        this.metrics[name] = {
            start: performance.now(),
            marks: []
        };
        console.log(`[PERF] Starting: ${name}`);
    },

    // End measuring
    endMeasure(name) {
        if (!this.metrics[name]) {
            console.warn(`[PERF] Measure ${name} not started`);
            return;
        }

        const duration = performance.now() - this.metrics[name].start;
        console.log(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
        
        return duration;
    },

    // Track function execution
    async trackAsync(name, asyncFn) {
        this.startMeasure(name);
        try {
            const result = await asyncFn();
            this.endMeasure(name);
            return result;
        } catch (error) {
            console.error(`[PERF] Error in ${name}:`, error);
            throw error;
        }
    },

    // Get metrics summary
    getSummary() {
        console.log('=== Performance Summary ===');
        Object.entries(this.metrics).forEach(([name, data]) => {
            console.log(`${name}: ${data.start}ms`);
        });
    },

    // Monitor memory usage
    logMemory() {
        if (performance.memory) {
            console.log(`Memory: ${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
        }
    }
};