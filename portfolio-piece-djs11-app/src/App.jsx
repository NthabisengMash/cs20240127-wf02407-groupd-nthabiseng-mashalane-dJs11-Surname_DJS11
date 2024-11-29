import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid'; // Import Mermaid
import './index.css';  // CSS file for styling

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
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);  // Track selected podcast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Fetch podcast previews (show summaries)
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
        setFilteredPreviews(mappedPreviews); // Initially, set filtered previews to all
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPreviews();
  }, []);

  // Filter previews based on search and selected genre
  useEffect(() => {
    const filtered = previews.filter(preview => {
      const matchesQuery = preview.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           preview.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre ? preview.genres.includes(selectedGenre) : true;
      return matchesQuery && matchesGenre;
    });
    setFilteredPreviews(filtered);
  }, [searchQuery, selectedGenre, previews]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Full-screen preview display
  const PreviewList = () => (
    <div>
      <h2>Podcast Previews</h2>
      {loading ? (
        <p>Loading previews...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <div style={styles.previewContainer}>
          {filteredPreviews.map((preview) => (
            <div
              key={preview.id}
              onClick={() => setSelectedPreview(preview)} // Show full-screen preview
              style={styles.previewBlock}
            >
              <h3>{preview.title}</h3>
              <p>{preview.description}</p>
              <p><strong>Genres:</strong> {preview.genres.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const FullScreenPreview = () => {
    if (!selectedPreview) return null;

    const { title, description, genres } = selectedPreview;

    return (
      <div style={styles.fullScreenPreview}>
        <button onClick={() => setSelectedPreview(null)} style={styles.closeButton}>
          Close Preview
        </button>
        <h2>{title}</h2>
        <p>{description}</p>
        <p><strong>Genres:</strong> {genres.join(', ')}</p>
        <button onClick={() => setSelectedPreview(null)} style={styles.closeButton}>
          Back to List
        </button>
      </div>
    );
  };

  return (
    <div style={darkMode ? styles.darkContainer : styles.container}>
      <div style={styles.appContent}>
        <h1>Podcast Shows</h1>

        <button onClick={toggleDarkMode} style={styles.themeToggleBtn}>
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <div style={styles.searchFilterContainer}>
          <input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
            style={styles.genreSelect}
          >
            <option value="">All Genres</option>
            {Object.values(genreMapping).map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Render Full-Screen Preview if Selected */}
        {selectedPreview ? <FullScreenPreview /> : <PreviewList />}
      </div>
    </div>
  );
};

// Simple styles for better visualization
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    color: '#333333',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '1000px',
  },
  darkContainer: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#333333',
    color: '#ffffff',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '1000px',
  },
  appContent: {
    margin: '0 auto',
    padding: '20px',
  },
  previewContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  previewBlock: {
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    fontSize: '14px',
    color: '#333',
    height: '250px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  fullScreenPreview: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
  searchFilterContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '200px',
  },
  genreSelect: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  themeToggleBtn: {
    padding: '10px 20px',
    margin: '10px 0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
};

export default App;
