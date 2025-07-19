import Redis from 'ioredis';

// Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: 0,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true
});

redis.on('error', (error: any) => {
  console.error('Redis connection error:', error);
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

export class CacheService {
  // Cache movie metadata for fast retrieval
  static async cacheMovie(movieId: string, movieData: any, ttl: number = 3600) {
    try {
      const key = `movie:${movieId}`;
      await redis.setex(key, ttl, JSON.stringify(movieData));
      return true;
    } catch (error) {
      console.error('Error caching movie:', error);
      return false;
    }
  }

  // Get cached movie
  static async getCachedMovie(movieId: string) {
    try {
      const key = `movie:${movieId}`;
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached movie:', error);
      return null;
    }
  }

  // Cache movie list with pagination
  static async cacheMovieList(listType: string, page: number, data: any, ttl: number = 600) {
    try {
      const key = `movies:${listType}:page:${page}`;
      await redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error caching movie list:', error);
      return false;
    }
  }

  // Get cached movie list
  static async getCachedMovieList(listType: string, page: number) {
    try {
      const key = `movies:${listType}:page:${page}`;
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached movie list:', error);
      return null;
    }
  }

  // Cache streaming URLs with short TTL for security
  static async cacheStreamingUrl(movieId: string, quality: string, url: string, ttl: number = 300) {
    try {
      const key = `stream:${movieId}:${quality}`;
      await redis.setex(key, ttl, url);
      return true;
    } catch (error) {
      console.error('Error caching streaming URL:', error);
      return false;
    }
  }

  // Get cached streaming URL
  static async getCachedStreamingUrl(movieId: string, quality: string) {
    try {
      const key = `stream:${movieId}:${quality}`;
      return await redis.get(key);
    } catch (error) {
      console.error('Error getting cached streaming URL:', error);
      return null;
    }
  }

  // Cache user data
  static async cacheUser(userId: string, userData: any, ttl: number = 1800) {
    try {
      const key = `user:${userId}`;
      await redis.setex(key, ttl, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error caching user:', error);
      return false;
    }
  }

  // Get cached user
  static async getCachedUser(userId: string) {
    try {
      const key = `user:${userId}`;
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached user:', error);
      return null;
    }
  }

  // Cache search results
  static async cacheSearchResults(query: string, results: any, ttl: number = 900) {
    try {
      const key = `search:${query.toLowerCase()}`;
      await redis.setex(key, ttl, JSON.stringify(results));
      return true;
    } catch (error) {
      console.error('Error caching search results:', error);
      return false;
    }
  }

  // Get cached search results
  static async getCachedSearchResults(query: string) {
    try {
      const key = `search:${query.toLowerCase()}`;
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached search results:', error);
      return null;
    }
  }

  // Invalidate cache patterns
  static async invalidatePattern(pattern: string) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Error invalidating cache pattern:', error);
      return false;
    }
  }

  // Clear specific cache
  static async clearCache(key: string) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // Get cache statistics
  static async getCacheStats() {
    try {
      const info = await redis.info('memory');
      const dbSize = await redis.dbsize();
      
      return {
        memoryUsage: info.split('\n').find(line => line.startsWith('used_memory_human:'))?.split(':')[1]?.trim(),
        totalKeys: dbSize,
        connected: redis.status === 'ready'
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { connected: false };
    }
  }

  // Test Redis connection
  static async testConnection() {
    try {
      await redis.ping();
      return { success: true, message: 'Redis connection successful' };
    } catch (error) {
      console.error('Redis connection test failed:', error);
      return { success: false, message: 'Redis connection failed', error };
    }
  }
}

export { redis };