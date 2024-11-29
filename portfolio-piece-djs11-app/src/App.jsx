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
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailsTimeout, setDetailsTimeout] = useState(null);
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
      const matchesGenre = selectedGenre ? preview.genres.includes(selectedGenre) : true; // Fix this comparison
      return matchesQuery && matchesGenre;
    });
    setFilteredPreviews(filtered);
  }, [searchQuery, selectedGenre, previews]);

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
      setShowDetails({
        ...show,
        seasons: show.seasons || [],
      });

      if (detailsTimeout) {
        clearTimeout(detailsTimeout); 
      }
      const newTimeout = setTimeout(() => setShowDetails(null), 120000);
      setDetailsTimeout(newTimeout);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

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
              onClick={() => fetchShowDetails(preview.id)}
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

  const ShowDetails = () => {
    if (!showDetails) return null;

    const { title, description, seasons, genreIds } = showDetails;
    const genres = genreIds ? genreIds.map((genreId) => genreMapping[genreId] || 'Unknown Genre') : [];

    return (
      <div style={styles.showDetailsBlock}>
        <h2>{title}</h2>
        <p>{description}</p>
        <p><strong>Genres:</strong> {genres.join(', ')}</p>

        <h3>Seasons</h3>
        {seasons.length === 0 ? (
          <p>No seasons available for this show.</p>
        ) : (
          seasons.map((season, index) => (
            <div key={season.id} style={styles.seasonBlock}>
              <h4>Season {index + 1}: {season.title}</h4>
              <img src={season.image} alt={season.title} style={styles.seasonImage} />
              <ul>
                {season.episodes.map((episode) => (
                  <li key={episode.id} style={styles.episodeBlock}>
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

  const MermaidDiagram = () => {
    useEffect(() => {
      mermaid.initialize({ startOnLoad: true });
      mermaid.contentLoaded();
    }, []);

    const mermaidCode = `
      erDiagram
          ROUTER {
              string type "BrowserRouter"
              string behavior "Wraps the application and enables routing"
          }

          ROUTE {
              string path "URL path, can include dynamic segments"
              string component "Component that is rendered when path is matched"
              string exact "Whether the route matches exactly"
          }

          LINK {
              string to "Path to navigate to"
              string behavior "Used for navigation, prevents full page reload"
          }

          HISTORY {
              string push "Programmatically navigate to a new route"
              string goBack "Navigate back in history"
              string goForward "Navigate forward in history"
          }

          COMPONENT {
              string name "A React component rendered by a route"
              string behavior "Display content based on route"
          }

          ROUTER ||--o| ROUTE: "contains"
          ROUTE ||--o| COMPONENT: "renders"
          LINK ||--o| ROUTE: "links to"
          HISTORY ||--o| ROUTE: "navigates to"
          ROUTE ||--o| LINK: "links to"
    `;

    return (
      <div className="mermaid">
        {mermaidCode}
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

        <PreviewList />
        {showDetails && <ShowDetails />}
        
        <h2>React Router - ER Diagram</h2>
        <MermaidDiagram />
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
  showDetailsBlock: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#333',
  },
  seasonBlock: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e8e8e8',
    borderRadius: '8px',
  },
  seasonImage: {
    width: '150px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  episodeBlock: {
    marginBottom: '10px',
    padding: '5px',
    backgroundColor: '#f1f1f1',
    borderRadius: '5px',
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
