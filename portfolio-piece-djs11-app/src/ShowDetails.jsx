// src/ShowDetails.jsx
import { useState, useEffect } from 'react';
import { getShowById } from './api';

function ShowDetails({ showId }) {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const data = await getShowById(showId);
        setShow(data);
      } catch (error) {
        console.error('Error fetching show:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  if (loading) return <div>Loading Show...</div>;

  return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <h2>Seasons</h2>
      <ul>
        {show.seasons.map((season) => (
          <li key={season.id}>
            <h3>{season.title}</h3>
            <ul>
              {season.episodes.map((episode) => (
                <li key={episode.id}>
                  <strong>{episode.title}</strong> - <a href={episode.file}>Listen</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowDetails;
