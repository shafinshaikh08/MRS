const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const movieRoutes = require("./routes/recommendationRoutes"); // Import the recommendation routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB ✅');
    db = client.db('movies');
    
    // Test the connection
    const count = await db.collection('tmdb1million').countDocuments({});
    console.log(`Found ${count} movies in the database`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongo();

// Enhanced adult content filter that excludes "Unknown Genre" and Japanese content
const adultContentFilter = {
    $and: [
        // Explicit adult flag if present
        { $or: [
            { adult: { $ne: true } },
            { adult: { $exists: false } }
        ]},
        // Filter out adult genres and "Unknown Genre"
        { genres: { 
            $not: { $regex: 'porn|adult|xxx|erotic|Unknown Genre', $options: 'i' } 
        }},
        // Filter out adult keywords in title
        { title: { 
            $not: { $regex: 'porn|xxx|adult|erotic|sex', $options: 'i' } 
        }},
        // Filter out Japanese language content that might contain adult content
        { $or: [
            { original_language: { $ne: 'ja' } },
            // Allow Japanese anime with high ratings and popular content 
            { $and: [
                { original_language: 'ja' },
                { vote_average: { $gte: 7.0 } },
                { vote_count: { $gte: 100 } }
            ]}
        ]}
    ]
};

// Routes
app.get('/api/movies', async (req, res) => {
  try {
    const { genre } = req.query;
    let filter = { ...adultContentFilter };
    
    if (genre) {
      // Skip "Unknown Genre" completely
      if (genre.toLowerCase() === 'unknown genre') {
        return res.json({ movies: [] });
      }
      
      // Using regex to find the genre anywhere in the genres string
      filter.$and.push({ genres: { $regex: genre, $options: 'i' } });
      console.log('Using genre filter:', filter);
      
      // For genres, get all matching movies (no limit)
      const movies = await db.collection('tmdb1million').find(filter).toArray();
      console.log(`Found ${movies.length} movies for genre: ${genre}`);
      
      res.json({ movies });
    } else {
      // For home page, still limit to a reasonable number
      const movies = await db.collection('tmdb1million').find(filter).limit(20).toArray();
      console.log(`Found ${movies.length} movies for home page`);
      
      res.json({ movies });
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search endpoint
app.get('/api/movies/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    console.log('Searching for movies with query:', query);
    
    // Create search filter with title search and adult content filtering
    const filter = {
      ...adultContentFilter,
      $and: [
        ...adultContentFilter.$and,
        { title: { $regex: query, $options: 'i' } }
      ]
    };
    
    console.log('Using search filter:', filter);
    const movies = await db.collection('tmdb1million').find(filter).limit(100).toArray();
    console.log(`Found ${movies.length} movies matching query: ${query}`);
    
    res.json({ movies });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: error.message });
  }
});

// Updated endpoint for random movie with enhanced adult content filtering
app.get('/api/movies/random', async (req, res) => {
  try {
    console.log('Fetching a random movie');
    
    // Enhanced filter to exclude adult content and ensure quality
    const filter = { 
      poster_path: { $ne: null },
      vote_average: { $gte: 6.0 },
      ...adultContentFilter
    };
    
    console.log('Using filter to exclude adult content:', filter);
    
    // Count matching documents to get a random index
    const count = await db.collection('tmdb1million').countDocuments(filter);
    
    if (count === 0) {
      console.log('No movies found matching criteria');
      return res.status(404).json({ error: 'No movies found' });
    }
    
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);
    
    // Skip to the random movie
    const randomMovie = await db.collection('tmdb1million')
      .find(filter)
      .skip(randomIndex)
      .limit(1)
      .toArray();
    
    if (randomMovie && randomMovie.length > 0) {
      console.log(`Random movie selected: ${randomMovie[0].title}`);
      res.json({ movie: randomMovie[0] });
    } else {
      console.log('Random movie selection failed');
      res.status(404).json({ error: 'No movie found' });
    }
  } catch (error) {
    console.error('Error fetching random movie:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Looking for movie with ID: ${id}`);
    
    // Add adult content filter to details endpoint
    const filter = {
      _id: new ObjectId(id),
      ...adultContentFilter
    };
    
    const movie = await db.collection('tmdb1million').findOne(filter);
    
    if (movie) {
      console.log('Movie found:', movie.title);
      res.json({ movie });
    } else {
      console.log('Movie not found');
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test route to check database connection and view sample document
app.get('/api/test-db', async (req, res) => {
  try {
    const sampleMovie = await db.collection('tmdb1million').findOne({});
    
    if (sampleMovie) {
      console.log('Sample movie found:', sampleMovie.title);
      res.json({ 
        message: 'Database connection successful!', 
        sampleMovie,
        fields: Object.keys(sampleMovie)
      });
    } else {
      res.status(404).json({ error: 'No movies found in collection' });
    }
  } catch (error) {
    console.error('Error testing database:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use("/api", movieRoutes); // Use the recommendations route under '/api'

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});