import { MongoStorage } from './mongodb.js';

const mongoStorage = new MongoStorage();

export const bengaliMoviesData = [
  {
    _id: 'pather-panchali-1955',
    title: 'পথের পাঁচালী',
    englishTitle: 'Pather Panchali',
    director: 'সত্যজিৎ রায়',
    englishDirector: 'Satyajit Ray',
    year: 1955,
    duration: 125,
    genre: ['Drama', 'Family'],
    rating: 8.4,
    description: 'সত্যজিৎ রায়ের অমর ত্রিলজির প্রথম চলচ্চিত্র। অপুর শৈশবকাল নিয়ে নির্মিত এই মাস্টারপিস।',
    englishDescription: 'The first film in Satyajit Ray\'s immortal Apu Trilogy, depicting the childhood of Apu.',
    
    // Google Cloud Storage URLs
    videoUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/pather-panchali-1955-720p.mp4`,
    thumbnailUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/thumbnails/pather-panchali-poster.jpg`,
    posterUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/posters/pather-panchali-poster-hd.jpg`,
    
    subtitles: [
      {
        language: 'bn',
        label: 'বাংলা',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/pather-panchali-bn.vtt`
      },
      {
        language: 'en',
        label: 'English',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/pather-panchali-en.vtt`
      }
    ],
    
    cast: ['কানু বন্দ্যোপাধ্যায়', 'কারুণা বন্দ্যোপাধ্যায়', 'সুবীর বন্দ্যোপাধ্যায়', 'উমা দাশগুপ্ত'],
    awards: ['Cannes Film Festival - Best Human Document (1956)', 'National Film Award'],
    language: 'Bengali',
    country: 'India',
    production: 'Government of West Bengal',
    
    // Streaming quality options
    qualities: {
      '360p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/pather-panchali-1955-360p.mp4`,
      '480p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/pather-panchali-1955-480p.mp4`,
      '720p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/pather-panchali-1955-720p.mp4`,
      '1080p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/pather-panchali-1955-1080p.mp4`
    },
    
    featured: true,
    views: 45320,
    likes: 3421,
    tags: ['Satyajit Ray', 'Apu Trilogy', 'Classic', 'Golden Era', 'Village Life'],
    releaseDate: '1955-08-26',
    copyrightStatus: 'Public Domain',
    uploadedAt: new Date('2024-01-15'),
    lastUpdated: new Date('2024-01-20')
  },
  
  {
    _id: 'aparajito-1956',
    title: 'অপরাজিত',
    englishTitle: 'Aparajito',
    director: 'সত্যজিৎ রায়',
    englishDirector: 'Satyajit Ray',
    year: 1956,
    duration: 113,
    genre: ['Drama', 'Family'],
    rating: 8.3,
    description: 'অপু ত্রিলজির দ্বিতীয় চলচ্চিত্র। অপুর কৈশোর ও যুবক জীবনের গল্প।',
    englishDescription: 'The second film in the Apu Trilogy, following Apu\'s adolescence and early adulthood.',
    
    videoUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/aparajito-1956-720p.mp4`,
    thumbnailUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/thumbnails/aparajito-poster.jpg`,
    posterUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/posters/aparajito-poster-hd.jpg`,
    
    subtitles: [
      {
        language: 'bn',
        label: 'বাংলা',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/aparajito-bn.vtt`
      },
      {
        language: 'en',
        label: 'English',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/aparajito-en.vtt`
      }
    ],
    
    cast: ['পিনাকী সেনগুপ্ত', 'কারুণা বন্দ্যোপাধ্যায়', 'স্মরণ ঘোষাল', 'কামাল গাঙ্গুলী'],
    awards: ['Golden Lion - Venice Film Festival (1957)', 'Critics Award - Venice'],
    language: 'Bengali',
    country: 'India',
    production: 'Epic Films',
    
    qualities: {
      '360p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/aparajito-1956-360p.mp4`,
      '480p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/aparajito-1956-480p.mp4`,
      '720p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/aparajito-1956-720p.mp4`,
      '1080p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/aparajito-1956-1080p.mp4`
    },
    
    featured: true,
    views: 38210,
    likes: 2987,
    tags: ['Satyajit Ray', 'Apu Trilogy', 'Coming of Age', 'Golden Era', 'Education'],
    releaseDate: '1956-10-01',
    copyrightStatus: 'Public Domain',
    uploadedAt: new Date('2024-01-16'),
    lastUpdated: new Date('2024-01-21')
  },
  
  {
    _id: 'charulata-1964',
    title: 'চারুলতা',
    englishTitle: 'Charulata',
    director: 'সত্যজিৎ রায়',
    englishDirector: 'Satyajit Ray',
    year: 1964,
    duration: 117,
    genre: ['Drama', 'Romance'],
    rating: 8.5,
    description: 'রবীন্দ্রনাথের "নষ্টনীড়" অবলম্বনে নির্মিত সত্যজিৎ রায়ের অন্যতম শ্রেষ্ঠ কীর্তি।',
    englishDescription: 'Based on Rabindranath Tagore\'s "Nastanirh", considered one of Ray\'s finest works.',
    
    videoUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/charulata-1964-720p.mp4`,
    thumbnailUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/thumbnails/charulata-poster.jpg`,
    posterUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/posters/charulata-poster-hd.jpg`,
    
    subtitles: [
      {
        language: 'bn',
        label: 'বাংলা',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/charulata-bn.vtt`
      },
      {
        language: 'en',
        label: 'English',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/charulata-en.vtt`
      }
    ],
    
    cast: ['মাধবী মুখোপাধ্যায়', 'সৌমিত্র চট্টোপাধ্যায়', 'শাওন কুমার', 'শ্যামল ঘোষাল'],
    awards: ['Silver Bear - Berlin Film Festival (1965)', 'National Film Award - Best Feature Film'],
    language: 'Bengali',
    country: 'India',
    production: 'R.D. Bansal Productions',
    
    qualities: {
      '360p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/charulata-1964-360p.mp4`,
      '480p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/charulata-1964-480p.mp4`,
      '720p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/charulata-1964-720p.mp4`,
      '1080p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/charulata-1964-1080p.mp4`
    },
    
    featured: true,
    views: 52180,
    likes: 4156,
    tags: ['Satyajit Ray', 'Rabindranath Tagore', 'Romance', 'Golden Era', '19th Century Bengal'],
    releaseDate: '1964-04-17',
    copyrightStatus: 'Public Domain',
    uploadedAt: new Date('2024-01-17'),
    lastUpdated: new Date('2024-01-22')
  },
  
  {
    _id: 'jalsaghar-1958',
    title: 'জলসাঘর',
    englishTitle: 'Jalsaghar (The Music Room)',
    director: 'সত্যজিৎ রায়',
    englishDirector: 'Satyajit Ray',
    year: 1958,
    duration: 95,
    genre: ['Drama', 'Music'],
    rating: 8.1,
    description: 'একজন পতনশীল জমিদারের জীবনের শেষ অধ্যায়ের মর্মস্পর্শী চিত্রায়ণ।',
    englishDescription: 'A poignant portrayal of the final chapter in the life of a decadent zamindar.',
    
    videoUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/jalsaghar-1958-720p.mp4`,
    thumbnailUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/thumbnails/jalsaghar-poster.jpg`,
    posterUrl: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/posters/jalsaghar-poster-hd.jpg`,
    
    subtitles: [
      {
        language: 'bn',
        label: 'বাংলা',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/jalsaghar-bn.vtt`
      },
      {
        language: 'en',
        label: 'English',
        url: `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/subtitles/jalsaghar-en.vtt`
      }
    ],
    
    cast: ['ছবি বিশ্বাস', 'গঙ্গাপদ বসু', 'কালী সরকার', 'তুলসী লাহিড়ী'],
    awards: ['FIPRESCI Prize - Cannes Film Festival (1958)', 'National Film Award'],
    language: 'Bengali',
    country: 'India',
    production: 'Satyajit Ray Productions',
    
    qualities: {
      '360p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/jalsaghar-1958-360p.mp4`,
      '480p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/jalsaghar-1958-480p.mp4`,
      '720p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/jalsaghar-1958-720p.mp4`,
      '1080p': `https://storage.googleapis.com/${process.env.GCP_STORAGE_BUCKET || 'telehub-movies'}/movies/jalsaghar-1958-1080p.mp4`
    },
    
    featured: false,
    views: 29540,
    likes: 2234,
    tags: ['Satyajit Ray', 'Classical Music', 'Feudalism', 'Golden Era', 'Zamindar'],
    releaseDate: '1958-10-03',
    copyrightStatus: 'Public Domain',
    uploadedAt: new Date('2024-01-18'),
    lastUpdated: new Date('2024-01-23')
  }
];

export async function initializeBengaliMovies() {
  try {
    console.log('🎬 Initializing Bengali movie collection with Google Cloud Storage URLs...');

    for (const movieData of bengaliMoviesData) {
      await mongoStorage.createMovie(movieData);
      console.log(`✅ Added movie: ${movieData.title} (${movieData.englishTitle})`);
    }

    console.log('🎭 Bengali movie collection initialized successfully!');
    return { success: true, moviesAdded: bengaliMoviesData.length };
  } catch (error) {
    console.error('❌ Error initializing Bengali movies:', error);
    throw error;
  }
}
