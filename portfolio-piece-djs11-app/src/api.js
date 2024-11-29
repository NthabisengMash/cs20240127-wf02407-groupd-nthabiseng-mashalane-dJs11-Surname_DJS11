// src/api.js

export const getPreviews = async () => {
    const response = await fetch('https://podcast-api.netlify.app');
    if (!response.ok) throw new Error('Failed to fetch previews');
    return await response.json();
  };
  
  export const getGenreById = async (id) => {
    const response = await fetch(`https://podcast-api.netlify.app/genre/${id}`);
    if (!response.ok) throw new Error('Failed to fetch genre');
    return await response.json();
  };
  
  export const getShowById = async (id) => {
    const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!response.ok) throw new Error('Failed to fetch show');
    return await response.json();
  };
  