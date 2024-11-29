import { useEffect, useState } from 'react';
import { getPreviews } from './api';
import { genreMapping } from './genreMapping';

function App() {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPreviews();
        setPreviews(data);
      } catch (error) {
        console.error('Error fetching previews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Podcast Previews</h1>
      <ul>
        {previews.map((preview) => (
          <li key={preview.id}>
            <h2>{preview.title}</h2>
            <p>{preview.description}</p>
            <p>Seasons: {preview.seasons}</p>
            <p>Genres: {preview.genreIds.map((id) => genreMapping[id]).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
