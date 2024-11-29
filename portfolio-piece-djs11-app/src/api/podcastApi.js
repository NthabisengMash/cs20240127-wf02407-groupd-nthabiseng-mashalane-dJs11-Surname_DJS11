// src/api/podcastApi.js

const API_BASE_URL = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching previews:', error);
    return [];
  }
};

export const fetchGenreById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/genre/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching genre with ID ${id}:`, error);
    return null;
  }
};

export const fetchShowById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/id/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching show with ID ${id}:`, error);
    return null;
  }
};
