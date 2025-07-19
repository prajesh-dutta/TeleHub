import { Request, Response, NextFunction } from 'express';
import { CacheService } from './redis';

export interface PerformanceMetrics {
  totalRequests: number;
  averageResponseTime: number;
  slowRequests: number;
  cacheHitRate: number;
  mediaDeliveryTime: number;
}

class PerformanceMonitor {
  private static metrics: PerformanceMetrics = {
    totalRequests: 0,
    averageResponseTime: 0,
    slowRequests: 0,
    cacheHitRate: 0,
    mediaDeliveryTime: 0
  };

  private static responseTimes: number[] = [];
  private static cacheHits = 0;
  private static cacheRequests = 0;

  // Middleware to track performance
  static trackPerformance() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // Track cache status
      let isCacheHit = false;
      const originalJson = res.json;
      
      res.json = function(obj: any) {
        const responseTime = Date.now() - startTime;
        
        // Update metrics
        PerformanceMonitor.updateMetrics(responseTime, isCacheHit);
        
        // Add performance headers
        res.set({
          'X-Response-Time': `${responseTime}ms`,
          'X-Cache-Status': isCacheHit ? 'HIT' : 'MISS',
          'X-Server-Performance': responseTime < 500 ? 'OPTIMAL' : 'SLOW'
        });

        return originalJson.call(this, obj);
      };

      next();
    };
  }

  // Middleware for caching headers
  static setCacheHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      const path = req.path;
      
      if (path.includes('/api/movies/') && !path.includes('/stream')) {
        // Cache movie data for 10 minutes
        res.set({
          'Cache-Control': 'public, max-age=600',
          'ETag': `"${Date.now()}"`,
          'Vary': 'Accept-Encoding'
        });
      } else if (path.includes('/stream')) {
        // Cache streaming URLs for 5 minutes
        res.set({
          'Cache-Control': 'private, max-age=300',
          'X-Content-Type-Options': 'nosniff'
        });
      } else if (path.includes('/api/search')) {
        // Cache search results for 15 minutes
        res.set({
          'Cache-Control': 'public, max-age=900',
          'Vary': 'Accept-Encoding'
        });
      }
      
      next();
    };
  }

  // Update performance metrics
  private static updateMetrics(responseTime: number, cacheHit: boolean) {
    this.metrics.totalRequests++;
    this.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times for memory efficiency
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    
    // Count slow requests (>500ms)
    if (responseTime > 500) {
      this.metrics.slowRequests++;
    }
    
    // Update cache metrics
    this.cacheRequests++;
    if (cacheHit) {
      this.cacheHits++;
    }
    this.metrics.cacheHitRate = (this.cacheHits / this.cacheRequests) * 100;
    
    // Media delivery time (approximation for media requests)
    if (responseTime < 500) {
      this.metrics.mediaDeliveryTime = responseTime;
    }
  }

  // Get current metrics
  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Reset metrics
  static resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      cacheHitRate: 0,
      mediaDeliveryTime: 0
    };
    this.responseTimes = [];
    this.cacheHits = 0;
    this.cacheRequests = 0;
  }

  // Check if performance targets are met
  static checkPerformanceTargets(): { 
    mediaDelivery: boolean; 
    cacheEfficiency: boolean; 
    responseTime: boolean;
    report: string;
  } {
    const mediaTarget = this.metrics.mediaDeliveryTime < 500;
    const cacheTarget = this.metrics.cacheHitRate > 80;
    const responseTarget = this.metrics.averageResponseTime < 200;
    
    const report = `
Performance Report:
- Media Delivery: ${this.metrics.mediaDeliveryTime}ms (Target: <500ms) ${mediaTarget ? '✅' : '❌'}
- Cache Hit Rate: ${this.metrics.cacheHitRate.toFixed(1)}% (Target: >80%) ${cacheTarget ? '✅' : '❌'}
- Avg Response Time: ${this.metrics.averageResponseTime.toFixed(1)}ms (Target: <200ms) ${responseTarget ? '✅' : '❌'}
- Total Requests: ${this.metrics.totalRequests}
- Slow Requests: ${this.metrics.slowRequests}
    `.trim();

    return {
      mediaDelivery: mediaTarget,
      cacheEfficiency: cacheTarget,
      responseTime: responseTarget,
      report
    };
  }
}

// Preload optimization middleware
export function preloadOptimization() {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    
    // Add preload hints for critical resources
    if (path === '/' || path.includes('/movie/')) {
      res.set({
        'Link': [
          '</api/movies/featured>; rel=preload; as=fetch',
          '</assets/styles.css>; rel=preload; as=style',
          '</assets/app.js>; rel=preload; as=script'
        ].join(', ')
      });
    }
    
    next();
  };
}

// Compression middleware setup
export function setupCompression() {
  return (req: Request, res: Response, next: NextFunction) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    if (acceptEncoding.includes('br')) {
      res.set('Content-Encoding', 'br');
    } else if (acceptEncoding.includes('gzip')) {
      res.set('Content-Encoding', 'gzip');
    }
    
    next();
  };
}

// Rate limiting for API endpoints
export function createRateLimit(windowMs: number = 15 * 60 * 1000, max: number = 100) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requests.has(clientId)) {
      requests.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const clientData = requests.get(clientId)!;
    
    if (now > clientData.resetTime) {
      // Reset window
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
      return next();
    }
    
    if (clientData.count >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': (max - clientData.count).toString(),
      'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
    });
    
    next();
  };
}

export default PerformanceMonitor;