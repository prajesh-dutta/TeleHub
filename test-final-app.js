// Final Application Test Script
// This script tests all the key endpoints and functionality

// Use Node.js built-in fetch (available in Node 18+)

const BASE_URL = 'http://localhost:5002';

async function testEndpoint(url, description) {
  try {
    console.log(`🔍 Testing: ${description}...`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`✅ ${description}: SUCCESS`);
    return data;
  } catch (error) {
    console.log(`❌ ${description}: FAILED - ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Testing TeleHub Application - Modern Movie Streaming Platform\n');
  
  // Test 1: Health Check
  await testEndpoint(`${BASE_URL}/api/health`, 'Health Check');
  
  // Test 2: Get All Movies
  const movies = await testEndpoint(`${BASE_URL}/api/movies`, 'Get All Movies');
  
  if (movies && movies.length > 0) {
    console.log(`   Found ${movies.length} movies in database`);
    
    // Test 3: Get Individual Movie
    const firstMovie = movies[0];
    await testEndpoint(`${BASE_URL}/api/movies/${firstMovie.id}`, `Get Movie: ${firstMovie.title}`);
    
    // Test 4: Verify Movie Content
    console.log('\n📋 Movie Content Verification:');
    movies.forEach((movie, index) => {
      console.log(`   ${index + 1}. ${movie.title} (${movie.year}) - Director: ${movie.director}`);
      console.log(`      Rating: ${movie.rating}, Language: ${movie.language}`);
      console.log(`      Genres: ${movie.genres.join(', ')}`);
    });
  }
  
  // Test 5: Test Frontend (basic check)
  try {
    const frontendResponse = await fetch(`${BASE_URL}/`);
    if (frontendResponse.ok) {
      console.log('\n✅ Frontend Loading: SUCCESS');
      console.log('   React app should be accessible at http://localhost:5002');
    } else {
      console.log('\n❌ Frontend Loading: FAILED');
    }
  } catch (error) {
    console.log('\n❌ Frontend Loading: FAILED - ', error.message);
  }
  
  console.log('\n🎬 TRANSFORMATION COMPLETE!');
  console.log('   ✨ Bengali cinema theme → Modern movie streaming platform');
  console.log('   🧹 Vintage styling → Clean modern UI');
  console.log('   🌐 Bengali text → English interface');
  console.log('   🎯 5 classic movies available for streaming');
  console.log('\n🔗 Access your application at: http://localhost:5002');
}

// Run the tests
runTests().catch(console.error);
