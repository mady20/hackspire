import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorProfile } from '../services/api';

export default function CreatorProfilePage() {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getCreatorProfile(username);
        setCreator(data.data);
      } catch (error) {
        console.error('Error fetching creator:', error);
        setError('Creator not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              {creator.profilePic ? (
                <img
                  src={creator.profilePic}
                  alt={creator.name}
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {creator.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {creator.name}
                </h2>
                <p className="text-sm text-gray-500">@{creator.username}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">{creator.bio}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Wallet Address
                </dt>
                <dd className="mt-1 text-sm font-mono text-gray-900">
                  {creator.walletAddress}
                </dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Fund Creator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
