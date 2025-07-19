# TeleHub Deployment Guide

This guide covers different deployment options for the TeleHub media processing platform.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- 20GB+ storage for media processing

### 1. Clone and Setup
```bash
git clone https://github.com/prajesh-dutta/TeleHub.git
cd TeleHub
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your settings:
```env
# Required for Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Required for Google Cloud Storage
GCP_PROJECT_ID=your-project-id
GCP_STORAGE_BUCKET=your-bucket-name
GCP_CREDENTIALS='{"type":"service_account",...}'

# Generated secrets
JWT_SECRET=$(openssl rand -hex 32)
SESSION_SECRET=$(openssl rand -hex 32)
```

### 3. Start Services
```bash
# Start all services
npm run docker:up

# Check logs
npm run docker:logs

# Access the application
open http://localhost:5000
```

### 4. Optional Management UIs
- Redis Commander: http://localhost:8081
- Mongo Express: http://localhost:8082 (admin/telehub123)

## 🏗️ Manual Development Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- FFmpeg (for video processing)

### 1. Install System Dependencies

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install mongodb redis-server ffmpeg imagemagick
```

#### macOS
```bash
brew install mongodb/brew/mongodb-community redis ffmpeg imagemagick
```

### 2. Start Services
```bash
# Start MongoDB
sudo systemctl start mongod
# OR: brew services start mongodb/brew/mongodb-community

# Start Redis
sudo systemctl start redis
# OR: brew services start redis
```

### 3. Install and Run
```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run init-db
npm run dev
```

## ☁️ Cloud Deployment (Google Cloud Platform)

### 1. Prepare GCP Environment
```bash
# Create project
gcloud projects create telehub-production

# Enable APIs
gcloud services enable storage-api.googleapis.com
gcloud services enable run.googleapis.com

# Create storage bucket
gsutil mb gs://telehub-movies-production
```

### 2. Deploy to Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/telehub-production/telehub
gcloud run deploy telehub \
  --image gcr.io/telehub-production/telehub \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10
```

### 3. Setup External Services
- **MongoDB Atlas**: For managed database
- **Redis Cloud**: For managed caching
- **Cloud Storage**: For media hosting

## 🔧 Configuration Guide

### Google Cloud Storage Setup
1. Create service account with Storage Admin role
2. Download JSON key file
3. Set environment variables:
```env
GCP_PROJECT_ID=your-project-id
GCP_STORAGE_BUCKET=your-bucket-name
GCP_CREDENTIALS='{"type":"service_account",...}'
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### Performance Optimization
```env
# Redis optimization
REDIS_MAXMEMORY=512mb
REDIS_POLICY=allkeys-lru

# Media processing
FFMPEG_THREADS=4
SHARP_CACHE=true
SHARP_CONCURRENCY=2
```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Check API health
curl http://localhost:5000/api/health

# Check cache status
curl http://localhost:5000/api/cache/test

# Check performance stats
curl http://localhost:5000/api/performance/stats
```

### Log Monitoring
```bash
# Docker logs
docker-compose logs -f telehub

# Application logs
tail -f logs/app.log

# Performance logs
tail -f logs/performance.log
```

### Cache Management
```bash
# Clear specific cache
curl -X POST http://localhost:5000/api/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"pattern":"movies:*"}'

# Clear all cache
curl -X POST http://localhost:5000/api/cache/clear
```

## 🚨 Troubleshooting

### Common Issues

#### 1. FFmpeg Not Found
```bash
# Install FFmpeg
sudo apt install ffmpeg
# OR: brew install ffmpeg
```

#### 2. MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod
# OR: brew services list | grep mongo

# Restart MongoDB
sudo systemctl restart mongod
```

#### 3. Redis Connection Failed
```bash
# Check Redis status
sudo systemctl status redis
# OR: brew services list | grep redis

# Test Redis connection
redis-cli ping
```

#### 4. Google Cloud Storage Errors
- Verify service account permissions
- Check bucket exists and is accessible
- Validate JSON credentials format

#### 5. Video Processing Fails
- Ensure FFmpeg is installed and in PATH
- Check available disk space in /tmp
- Verify input video format is supported

### Performance Issues

#### Slow Response Times
1. Check Redis cache hit rate
2. Monitor database query performance
3. Verify sufficient memory allocation
4. Check network latency to GCS

#### High Memory Usage
1. Adjust Redis memory limits
2. Optimize image processing concurrency
3. Clean up temporary files regularly

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple instances
- Implement session affinity if needed
- Scale Redis cluster for high availability

### Vertical Scaling
- Increase memory for media processing
- Add CPU cores for FFmpeg encoding
- Use SSD storage for temporary processing

### Media Optimization
- Implement CDN for static assets
- Use adaptive bitrate streaming
- Enable progressive download

## 🔒 Security Best Practices

### Environment Security
- Never commit .env files
- Use secrets management in production
- Rotate JWT secrets regularly

### API Security
- Implement rate limiting
- Use HTTPS in production
- Validate all file uploads

### Storage Security
- Use signed URLs for sensitive content
- Implement proper CORS policies
- Regular security audits

---

For more details, see the main [README.md](README.md) or create an issue in the repository.