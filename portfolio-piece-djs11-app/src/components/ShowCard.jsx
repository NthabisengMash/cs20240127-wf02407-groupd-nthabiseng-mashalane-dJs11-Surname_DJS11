// src/components/ShowCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ShowCard = ({ show }) => {
  return (
    <div className="show-card">
      <img src={show.image} alt={show.title} />
      <h3>{show.title}</h3>
      <p>{show.description}</p>
      <Link to={`/show/${show.id}`}>See Details</Link>
    </div>
  );
};

export default ShowCard;
