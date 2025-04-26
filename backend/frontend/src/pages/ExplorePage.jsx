import { useState, useEffect } from 'react';
import { getAllCreators } from '../services/api';
import CreatorCard from '../components/CreatorCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ExplorePage() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCreators();
  }, [page]);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllCreators(page);
      setCreators(prev => [...prev, ...data.data]);
      setHasMore(data.data.length === 12); // Assuming 12 is our page size
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Creators
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Discover and support amazing creators in our community
          </p>
        </div>

        <div className="mt-12">
          {error && <ErrorMessage message={error} />}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <CreatorCard key={creator.username} creator={creator} />
            ))}
          </div>

          {loading && (
            <div className="mt-8">
              <LoadingSpinner />
            </div>
          )}

          {!loading && hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Load More
              </button>
            </div>
          )}

          {!loading && !hasMore && creators.length > 0 && (
            <p className="mt-8 text-center text-gray-600">
              You've reached the end of the list
            </p>
          )}

          {!loading && creators.length === 0 && !error && (
            <div className="text-center text-gray-600 mt-8">
              No creators found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
