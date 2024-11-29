import React, { useState, useEffect } from 'react';

// Genre mapping
const genreMapping = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

const App = () => {
  // State for storing podcast previews (show summaries)
  const [previews, setPreviews] = useState([]);
  // State for storing the details of the clicked show
  const [showDetails, setShowDetails] = useState(null);
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch podcast previews (summary of shows)
  useEffect(() => {
    async function fetchPreviews() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Failed to fetch previews');
        }
        const data = await response.json();
        const mappedPreviews = data.map(preview => ({
          ...preview,
          genres: preview.genreIds ? preview.genreIds.map(genreId => genreMapping[genreId] || 'Unknown Genre') : [],
        }));
        setPreviews(mappedPreviews);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPreviews();
  }, []);

  // Fetch the details of a specific show
  const fetchShowDetails = async (showId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch show details');
      }
      const show = await response.json();
      // Ensure that show.seasons is an array to avoid errors when calling .map()
      setShowDetails({
        ...show,
        seasons: show.seasons || [], // Default to empty array if no seasons
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Component for displaying a list of podcast previews
  const PreviewList = () => (
    <div>
      <h2>Podcast Previews</h2>
      {loading ? (
        <p>Loading previews...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <ul style={styles.list}>
          {previews.map((preview) => (
            <li
              key={preview.id}
              onClick={() => fetchShowDetails(preview.id)}
              style={styles.previewItem}
            >
              <h3>{preview.title}</h3>
              <p>{preview.description}</p>
              <p><strong>Genres:</strong> {preview.genres.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Component for displaying the details of a specific show
  const ShowDetails = () => {
    if (!showDetails) return null;

    const { title, description, seasons, genreIds } = showDetails;
    const genres = genreIds ? genreIds.map((genreId) => genreMapping[genreId] || 'Unknown Genre') : [];

    return (
      <div style={styles.showDetails}>
        <h2>{title}</h2>
        <p>{description}</p>
        <p><strong>Genres:</strong> {genres.join(', ')}</p>

        <h3>Seasons</h3>
        {seasons.length === 0 ? (
          <p>No seasons available for this show.</p>
        ) : (
          seasons.map((season, index) => (
            <div key={season.id} style={styles.season}>
              <h4>Season {index + 1}: {season.title}</h4>
              <img src={season.image} alt={season.title} style={styles.seasonImage} />
              <ul>
                {season.episodes.map((episode) => (
                  <li key={episode.id} style={styles.episode}>
                    <strong>{episode.title}</strong>
                    <audio controls>
                      <source src={episode.file} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Podcast Shows</h1>
      <PreviewList />
      <ShowDetails />
    </div>
  );
};

// Simple styles for better visualization
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff', // White background to make the text stand out
    color: '#333333', // Dark text for contrast
  },
  list: {
    padding: '0',
    listStyleType: 'none',
    fontSize: '18px', // Slightly larger font size for readability
  },
  previewItem: {
    cursor: 'pointer',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    fontSize: '16px', // Text size for list items
    color: '#333', // Dark text color
  },
  showDetails: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    fontSize: '18px', // Larger text size for show details
    color: '#333', // Dark text color for contrast
  },
  season: {
    marginTop: '20px',
  },
  seasonImage: {
    width: '150px',
    borderRadius: '5px',
  },
  episode: {
    marginBottom: '10px',
  },
};

export default App;
