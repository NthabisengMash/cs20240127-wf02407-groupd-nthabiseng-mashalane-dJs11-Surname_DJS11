import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid'; // Import Mermaid
import './index.css';  // Include the CSS file for styling

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
  // State to manage the timeout of the show details
  const [detailsTimeout, setDetailsTimeout] = useState(null);

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
      
      // Set timeout to hide details after 2 minutes (120000ms)
      if (detailsTimeout) {
        clearTimeout(detailsTimeout); // Clear any existing timeouts
      }
      const newTimeout = setTimeout(() => setShowDetails(null), 120000); // Hide after 2 minutes
      setDetailsTimeout(newTimeout);
      
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
        <div style={styles.previewContainer}>
          {previews.map((preview) => (
            <div
              key={preview.id}
              onClick={() => fetchShowDetails(preview.id)} // Ensuring that this triggers the fetch
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

  // Component for displaying the details of a specific show
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

  // Mermaid Diagram component
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
    <div style={styles.container}>
      <h1>Podcast Shows</h1>
      <PreviewList />
      {showDetails && <ShowDetails />}
      
      <h2>React Router - ER Diagram</h2>
      <MermaidDiagram />
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
    marginLeft: '50px',  // Add 50px margin on the left
    marginRight: '50px', // Add 50px margin on the right
  },
  previewContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // Compact grid layout with smaller blocks
    gap: '20px', // Space between blocks
  },
  previewBlock: {
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    fontSize: '14px',  // Smaller text
    color: '#333',
    height: '250px',  // Limit height for compact block
    overflow: 'hidden',  // Prevent overflow
    display: 'flex',
    flexDirection: 'column',  // Stack elements vertically
    justifyContent: 'space-between', // Space out title, description, and genres
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
};

export default App;
