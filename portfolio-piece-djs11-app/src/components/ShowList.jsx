// src/components/ShowList.jsx
import React, { useEffect, useState } from 'react';
import { fetchPreviews } from '../api/podcastApi';
import ShowCard from './ShowCard';

const ShowList = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const getPreviews = async () => {
      const previews = await fetchPreviews();
      setShows(previews);
    };

    getPreviews();
  }, []);

  return (
    <div className="show-list">
      {shows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
};

export default ShowList;
