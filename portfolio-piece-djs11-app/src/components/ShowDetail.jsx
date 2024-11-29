// src/components/ShowDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To capture dynamic ID from URL
import { fetchShowById } from '../api/podcastApi';

const ShowDetail = () => {
  const { id } = useParams(); // Get the show ID from the URL
  const [show, setShow] = useState(null); // Store show data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch show data when component is mounted
  useEffect(() => {
    const getShowDetails = async () => {
      const data = await fetchShowById(id);
      setShow(data);
      setLoading(false); // Set loading to false after data is fetched
    };

    getShowDetails();
  }, [id]); // Re-fetch when the ID changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>Show not found!</div>;
  }

  return (
    <div className="show-detail">
      <h2>{show.title}</h2>
      <img src={show.image} alt={show.title} />
      <p>{show.description}</p>

      <h3>Seasons</h3>
      <div className="seasons">
        {show.seasons.map((season) => (
          <div key={season.id} className="season">
            <h4>{season.title}</h4>
            <img src={season.image} alt={season.title} />
            <h5>Episodes</h5>
            <ul>
              {season.episodes.map((episode) => (
                <li key={episode.id}>
                  <strong>{episode.title}</strong>
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
    </div>
  );
};

export default ShowDetail;
