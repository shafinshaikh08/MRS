const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB ✅');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connect();

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

const getMoviesBySearch = async (req, res) => {
    const { query, genre } = req.query;
    console.log('Received request with:', { query, genre });

    try {
        const database = client.db('movies');
        const collection = database.collection('tmdb1million');

        let filter = { ...adultContentFilter };
        if (query) {
            filter.$and.push({ title: { $regex: query, $options: 'i' } });
        }
        if (genre) {
            // Skip the "Unknown Genre" completely
            if (genre.toLowerCase() === 'unknown genre') {
                return res.json({ movies: [] });
            }
            filter.$and.push({ genres: { $regex: genre, $options: 'i' } });
        }

        console.log('Filter being used:', filter);
        
        const movies = await collection.find(filter).toArray();
        console.log('Fetched movies:', movies.length);

        res.json({ movies });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: error.message });
    }
};

const getRandomMovie = async (req, res) => {
    try {
        console.log('Fetching a random movie');
        const database = client.db('movies');
        const collection = database.collection('tmdb1million');
        
        // Enhanced filter to exclude adult content and ensure quality
        const filter = { 
            poster_path: { $ne: null },
            vote_average: { $gte: 6.0 },
            ...adultContentFilter
        };
        
        console.log('Using filter to exclude adult content:', filter);
        
        // Count matching documents to get a random index
        const count = await collection.countDocuments(filter);
        
        if (count === 0) {
            console.log('No movies found matching criteria');
            return res.status(404).json({ error: 'No movies found' });
        }
        
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * count);
        
        // Skip to the random movie
        const randomMovie = await collection
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
};

const getMovieDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const database = client.db('movies');
        const collection = database.collection('tmdb1million');
        const movie = await collection.findOne({ 
            _id: new ObjectId(id),
            ...adultContentFilter
        });

        if (movie) {
            res.json({ movie });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: error.message });
    }
};

const searchMovies = async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    try {
        const database = client.db('movies');
        const collection = database.collection('tmdb1million');
        
        console.log('Searching for movies with query:', query);
        
        // Create search filter with title search
        const filter = {
            ...adultContentFilter,
            $and: [
                ...adultContentFilter.$and,
                { title: { $regex: query, $options: 'i' } }
            ]
        };
        
        console.log('Using search filter:', filter);
        const movies = await collection.find(filter).limit(100).toArray();
        console.log(`Found ${movies.length} movies matching query: ${query}`);
        
        res.json({ movies });
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMoviesBySearch,
    getMovieDetails,
    getRandomMovie,
    searchMovies
};