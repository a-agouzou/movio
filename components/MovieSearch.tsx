import { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/useDebounce';

interface MovieSearchProps {
  onSearch: (query: string) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500) as string;

  useEffect(() => {
    onSearch(debouncedSearch || '');
  }, [debouncedSearch, onSearch]);

  return (
    <div className="p-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a movie"
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
};

export default MovieSearch;