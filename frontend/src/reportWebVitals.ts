import { Metric } from 'web-vitals';

type MetricType = Metric;

const reportWebVitals = async (onPerfEntry?: (metric: MetricType) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function' && process.env.NODE_ENV === 'production') {
    try {
      const webVitals = await import('web-vitals');
      
      // Wrap each call in a try-catch to prevent single metric failure from blocking others
      const metrics = [
        { fn: webVitals.onCLS, name: 'CLS' },
        { fn: webVitals.onFID, name: 'FID' },
        { fn: webVitals.onFCP, name: 'FCP' },
        { fn: webVitals.onLCP, name: 'LCP' },
        { fn: webVitals.onTTFB, name: 'TTFB' }
      ];

      metrics.forEach(({ fn, name }) => {
        try {
          fn(onPerfEntry);
        } catch (error) {
          console.warn(`Failed to load ${name} metric:`, error);
        }
      });
    } catch (error) {
      console.warn('Failed to load web-vitals:', error);
    }
  }
};

export default reportWebVitals;
