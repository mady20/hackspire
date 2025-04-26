import { Link } from 'react-router-dom';

export default function CreatorCard({ creator }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center">
          {creator.profilePic ? (
            <img
              src={creator.profilePic}
              alt={creator.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xl text-gray-500">
                {creator.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {creator.name}
            </h3>
            <p className="text-sm text-gray-500">@{creator.username}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-600 line-clamp-2">{creator.bio}</p>
        <div className="mt-6 flex justify-between items-center">
          <Link
            to={`/creator/${creator.username}`}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            View Profile
          </Link>
          <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Support
          </button>
        </div>
      </div>
    </div>
  );
}
