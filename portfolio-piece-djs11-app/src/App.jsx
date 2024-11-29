import React, { useState, useEffect } from 'react';

// Genre mapping based on provided table
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
  const [showDetails, setShowDetails] = useState(null);

  // Fetch all previews (summarized shows) on component mount
  useEffect(() => {
    async function fetchPreviews() {
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        const data = await response.json();
        const mappedPreviews = data.map(preview => ({
          ...preview,
          genres: preview.genreIds.map(genreId => genreMapping[genreId] || 'Unknown Genre'),
        }));
        setPreviews(mappedPreviews);
      } catch (error) {
        console.error('Error fetching previews:', error);
      }
    }
    fetchPreviews();
  }, []);

  // Fetch show details by ID
  const fetchShowDetails = async (showId) => {
    try {
      const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      const show = await response.json();
      setShowDetails(show);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  // Render Preview List
  const PreviewList = () => (
    <div>
      <h2>Podcast Previews</h2>
      <ul>
        {previews.map(preview => (
          <li
            key={preview.id}
            onClick={() => fetchShowDetails(preview.id)}
            style={{ cursor: 'pointer', padding: '10px', margin: '10px 0', background: '#f4f4f4', borderRadius: '5px' }}
          >
            <strong>{preview.title}</strong><br />
            {preview.description}<br />
            <span>{preview.genres.join(', ')}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render Show Details
  const ShowDetails = () => {
    if (!showDetails) return null;

    const { title, description, seasons, genreIds } = showDetails;
    const genres = genreIds.map(genreId => genreMapping[genreId] || 'Unknown Genre');

    return (
      <div style={{ marginTop: '20px' }}>
        <h2>{title}</h2>
        <p>{description}</p>
        <p><strong>Genres:</strong> {genres.join(', ')}</p>

        <h3>Seasons</h3>
        {seasons.map((season, index) => (
          <div key={season.id}>
            <h4>Season {index + 1}: {season.title}</h4>
            <img src={season.image} alt={season.title} style={{ width: '100px', borderRadius: '5px' }} />
            <ul>
              {season.episodes.map((episode) => (
                <li key={episode.id}>
                  <strong>{episode.title}</strong><br />
                  <audio controls>
                    <source src={episode.file} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Podcast Shows</h1>
      <PreviewList />
      <ShowDetails />
    </div>
  );
};

export default App;
