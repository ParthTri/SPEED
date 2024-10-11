// In frontend/src/pages/articles/search.tsx
import { useState } from 'react';
import { ArticleInterface } from '../../utils/article.interface'; // Adjust path if needed

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/search?term=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const results: ArticleInterface[] = await response.json();
      setFilteredArticles(results);
    } catch (e) {
      setError(e.message);
      setFilteredArticles([]); // Clear articles on error
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="container">
      <h1>Search Articles</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search articles..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="results">
        {filteredArticles.length > 0 ? (
          <ul>
            {filteredArticles.map((article) => (
              <li key={article.id}>{article.title}</li>
            ))}
          </ul>
        ) : (
          !loading && <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
