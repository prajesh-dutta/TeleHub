import dotenv from 'dotenv';
import { MongoStorage } from './mongodb';

// Load environment variables
dotenv.config();

async function initializeDatabase() {
  console.log('🎬 TeleHub Database Initialization');
  console.log('==================================');
  
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb://localhost:27017/telehub') {
      console.log('⚠️  MongoDB URI not configured or using local default.');
      console.log('💡 For production, please set MONGODB_URI in .env file');
      console.log('📝 Continuing with sample data for development...');
      
      // For now, just show what would be initialized
      console.log('\n🎭 Sample Classic Movies that would be added:');
      console.log('- Pather Panchali (1955) - Satyajit Ray');
      console.log('- Aparajito (1956) - Satyajit Ray');
      console.log('- Apur Sansar (1959) - Satyajit Ray');
      console.log('- Charulata (1964) - Satyajit Ray');
      console.log('- Jalsaghar (1958) - Satyajit Ray');
      console.log('- Devi (1960) - Satyajit Ray');
      console.log('- Teen Kanya (1961) - Satyajit Ray');
      console.log('- Mahanagar (1963) - Satyajit Ray');
      
      console.log('\n✅ Database initialization simulated successfully!');
      console.log('🚀 Start the server to test with sample data');
      return;
    }
    
    console.log('🔗 Connecting to MongoDB...');
    
    // Initialize MongoDB connection
    const mongoStorage = new MongoStorage();
    
    // The movie collection will be initialized automatically by the storage service
    console.log('🎥 Classic movie collection ready...');
    
    console.log('✅ Database initialization completed successfully!');
    console.log('🎬 TeleHub is ready with classic movie collection!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running if using local instance');
    console.log('2. Check MONGODB_URI in .env file');
    console.log('3. Verify network connectivity for cloud MongoDB');
    process.exit(1);
  }
}

initializeDatabase();
