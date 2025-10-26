// Performance Optimization Utilities

const PerformanceOptimizer = {
    // Debounce function - prevents excessive function calls
    debounce(func, delay = 300) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    // Throttle function - limits function calls to once per interval
    throttle(func, limit = 1000) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },

    // Cache API responses
    cache: new Map(),
    
    async cachedFetch(url, cacheTime = 300000) { // 5 minutes default
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            if (Date.now() - cached.timestamp < cacheTime) {
                console.log('Using cached data for:', url);
                return cached.data;
            }
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            this.cache.set(url, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    },

    // Lazy load images
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        }
    },

    // Batch DOM updates
    batchDOMUpdates(updates) {
        requestAnimationFrame(() => {
            updates.forEach(update => update());
        });
    },

    // Optimize animation performance
    enableGPUAcceleration(element) {
        element.style.transform = 'translateZ(0)';
        element.style.willChange = 'transform';
    },

    // Monitor performance
    logPerformance() {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);

            // Log Core Web Vitals
            if (window.web_vitals) {
                console.log('Core Web Vitals:', window.web_vitals);
            }
        });
    },

    // Debounced resize handler
    onWindowResize(callback, delay = 300) {
        let timeoutId;
        window.addEventListener('resize', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, delay);
        });
    },

    // Memory optimization - clear unused data
    clearCache() {
        this.cache.clear();
        console.log('Cache cleared');
    },

    // Compress data for transfer
    compressRoute(route, tolerance = 0.00001) {
        // Simplify route coordinates to reduce payload
        if (!route || !route.coordinates || route.coordinates.length < 3) {
            return route;
        }

        const simplified = [route.coordinates[0]];
        
        for (let i = 1; i < route.coordinates.length - 1; i++) {
            const curr = route.coordinates[i];
            const prev = simplified[simplified.length - 1];
            const next = route.coordinates[i + 1];

            // Calculate perpendicular distance
            const dist = Math.abs(
                (next.lat - prev.lat) * curr.lng -
                (next.lng - prev.lng) * curr.lat +
                next.lng * prev.lat -
                next.lat * prev.lng
            ) / Math.hypot(next.lat - prev.lat, next.lng - prev.lng);

            if (dist > tolerance) {
                simplified.push(curr);
            }
        }

        simplified.push(route.coordinates[route.coordinates.length - 1]);
        return { ...route, coordinates: simplified };
    }
};