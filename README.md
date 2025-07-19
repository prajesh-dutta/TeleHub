# TeleHub - Cloud-Native Media Processing Platform

A high-throughput React frontend and Node.js (TypeScript) backend for streaming classic cinema, featuring advanced media processing pipelines and sub-500ms delivery optimization.

## 🚀 Features

### Core Architecture
- **React Frontend**: Modern TypeScript-based UI with responsive design
- **Node.js Backend**: High-performance Express server with TypeScript
- **Google Cloud Storage**: Reliable media hosting and distribution
- **MongoDB**: Document database for metadata and user data

### Security & Authentication
- **OAuth2 with Google**: Secure social authentication
- **JWT-based RBAC**: Role-based access control with tokenized sessions
- **Session Management**: Secure user session handling

### Media Processing Pipeline
- **FFmpeg Video Compression**: Multi-quality video processing (360p, 480p, 720p, 1080p)
- **Sharp Image Optimization**: Responsive image processing with multiple formats (WebP, AVIF, JPEG)
- **Redis Caching**: Sub-500ms media delivery optimization
- **Progressive Streaming**: Optimized video delivery with range requests

### Performance Optimization
- **Redis Cache Layer**: Intelligent caching for sub-500ms response times
- **Performance Monitoring**: Real-time tracking of response times and cache hit rates
- **Rate Limiting**: API protection with configurable limits
- **Compression**: Brotli/Gzip compression for optimal bandwidth usage

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Radix UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis with IORedis
- **Media Processing**: FFmpeg, Sharp
- **Cloud Storage**: Google Cloud Storage
- **Authentication**: Passport.js, JWT, OAuth2
- **Build Tools**: Vite, ESBuild
- **Deployment**: Docker-ready, Cloud-native design

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- Redis
- FFmpeg (for video processing)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/prajesh-dutta/TeleHub.git
   cd TeleHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB and Redis
   # Then initialize the database
   npm run init-db
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```

6. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Configuration

### Google Cloud Storage Setup
1. Create a GCP project and enable Cloud Storage API
2. Create a service account and download the key file
3. Set environment variables:
   ```env
   GCP_PROJECT_ID=your-project-id
   GCP_STORAGE_BUCKET=your-bucket-name
   GCP_KEY_FILE=path/to/service-account-key.json
   ```

### Google OAuth Setup
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs
4. Set environment variables:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### Redis Configuration
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password  # Optional
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login with JWT
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Movies
- `GET /api/movies` - Get movies with caching
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/featured` - Get featured movies
- `GET /api/movies/search/:query` - Search movies
- `GET /api/movies/:id/stream` - Get streaming URL

### Media Processing
- `POST /api/admin/movies/upload` - Upload and process video
- `POST /api/admin/movies/:id/poster` - Upload and optimize poster
- `GET /api/streaming/stream/:movieId/:quality` - Stream video
- `GET /api/streaming/secure-url/:movieId/:quality` - Get secure streaming URL

### Performance & Monitoring
- `GET /api/performance/stats` - Get performance metrics
- `GET /api/cache/test` - Test Redis connection
- `POST /api/cache/clear` - Clear cache (admin)

## 🔄 Media Processing Workflow

### Video Processing Pipeline
1. **Upload**: Original video file upload via multipart form
2. **Validation**: File format and size validation
3. **Compression**: FFmpeg processing to multiple qualities:
   - 360p (640x360, 800k bitrate)
   - 480p (854x480, 1200k bitrate) 
   - 720p (1280x720, 2500k bitrate)
   - 1080p (1920x1080, 5000k bitrate)
4. **Upload to GCS**: Compressed videos uploaded to Google Cloud Storage
5. **Database Update**: Movie metadata updated with video URLs
6. **Cache Invalidation**: Related cache entries cleared

### Image Processing Pipeline
1. **Upload**: Original image upload
2. **Validation**: Format and size validation
3. **Optimization**: Sharp processing with multiple variants:
   - Multiple sizes (320px, 640px, 1280px, 1920px)
   - Multiple formats (WebP, AVIF, JPEG, PNG)
   - Quality optimization and compression
4. **Upload to GCS**: Optimized images uploaded to cloud storage
5. **Database Update**: Image URLs saved to database

## ⚡ Performance Targets

- **Media Delivery**: < 500ms response time
- **Cache Hit Rate**: > 80%
- **Average API Response**: < 200ms
- **Video Streaming**: Progressive loading with range requests
- **Image Loading**: Responsive images with modern formats

## 🧪 Testing

```bash
# Type checking
npm run check

# Build test
npm run build

# Performance test
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/movies
```

## 📊 Monitoring

### Performance Metrics
- Response time tracking
- Cache hit/miss ratios
- API request rates
- Media delivery performance
- Error rates and patterns

### Cache Statistics
- Memory usage
- Key count
- Hit/miss ratios
- Expiration patterns

## 🚢 Deployment

### Docker Deployment
```dockerfile
# Dockerfile included for containerized deployment
docker build -t telehub .
docker run -p 5000:5000 telehub
```

### Cloud Deployment
- Designed for Google Cloud Platform
- Kubernetes-ready configuration
- Horizontal scaling support
- Load balancer compatible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Repository](https://github.com/prajesh-dutta/TeleHub)
- [Issues](https://github.com/prajesh-dutta/TeleHub/issues)
- [Discussions](https://github.com/prajesh-dutta/TeleHub/discussions)

---

**TeleHub** - Bringing classic cinema to the cloud with cutting-edge performance optimization.